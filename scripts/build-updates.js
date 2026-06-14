/**
 * 构建脚本：将 content/ 下的 .md 文件解析为 JSON
 * 在 `npm run build` 时自动生成：
 *   - src/data/updates.json          (研究日志)
 *   - src/data/papers-content.json   (论文笔记)
 *   - src/data/directions.json       (研究方向)
 *   - src/data/projects-content.json (项目)
 *   - src/data/skills.json           (技术栈)
 *
 * 论文元数据自动补全策略（优先级从高到低）：
 *   1. markdown frontmatter 中手动填写的字段（永不覆盖）
 *   2. Zotero 云文献库同步（需配置 ZOTERO_USER_ID + ZOTERO_API_KEY）
 *   3. arXiv API 自动抓取（根据 arxiv 字段中的 ID）
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");
const { syncFromZotero } = require("./lib/zotero-sync");

const CONTENT_DIR = path.join(__dirname, "..", "content");
const DATA_DIR = path.join(__dirname, "..", "src", "data");

// 加载环境变量（简易实现，不依赖 dotenv）
// 优先级：系统环境变量 > .env.local > .env
function loadEnvFile(filename) {
  const envPath = path.join(__dirname, "..", filename);
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.substring(0, eqIdx).trim();
    const val = trimmed.substring(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ──────────────────────────────────────
// 基础工具函数
// ──────────────────────────────────────

/**
 * 读取目录下的所有 .md 文件并解析
 */
function parseMarkdownDir(dirPath, requiredFields) {
  if (!fs.existsSync(dirPath)) return [];
  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".md"));
  return files
    .map((filename) => {
      const filepath = path.join(dirPath, filename);
      const raw = fs.readFileSync(filepath, "utf-8");
      const { data, content } = matter(raw);
      for (const field of requiredFields) {
        if (!data[field]) {
          console.warn(`⚠️  ${filename} 缺少 ${field}，已跳过`);
          return null;
        }
      }
      const html = content.trim() ? marked.parse(content) : "";
      return { ...data, content: html };
    })
    .filter(Boolean);
}

function writeJSON(filename, data) {
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), "utf-8");
}

// ──────────────────────────────────────
// arXiv API 自动抓取
// ──────────────────────────────────────

/**
 * 从 arXiv URL 中提取 ID
 * 支持格式：
 *   https://arxiv.org/abs/2304.12294
 *   https://arxiv.org/abs/2304.12294v2
 *   2304.12294
 */
function extractArxivId(url) {
  if (!url) return "";
  const match = url.match(/(\d{4}\.\d{4,5})(v\d+)?/);
  return match ? match[1] : url.trim();
}

/**
 * 简易 XML 标签提取
 */
function xmlGet(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`);
  const m = xml.match(re);
  return m ? m[1].trim() : "";
}

/**
 * 根据论文元数据自动推导分类
 * 使用 content/categories.json 中的分类名称
 */
function deriveCategory(paper, categoryNames) {
  if (paper.category) return; // 已有分类，不覆盖

  const venue = (paper.venue || "").toLowerCase();
  const arxiv = paper.arxiv || "";
  const doi = paper.doi || "";

  // 从配置中获取分类名称（带 fallback）
  const getName = (id, fallback) => {
    const cat = categoryNames.find((c) => c.id === id);
    return cat ? cat.name : fallback;
  };

  // arXiv 预印本
  if (arxiv || venue.includes("arxiv")) {
    paper.category = getName("arxiv", "arXiv 预印本");
    return;
  }

  // 会议论文
  const conferences = [
    "iccv", "cvpr", "eccv", "neurips", "nips", "icml", "iclr",
    "aaai", "ijcai", "acl", "emnlp", "naacl", "siggraph", "chi",
    "icra", "iros", "rss", "uai", "aistats", "colm",
  ];
  if (conferences.some((c) => venue.includes(c))) {
    paper.category = getName("conference", "会议论文");
    return;
  }

  // 期刊论文
  const journalKeywords = [
    "journal", "transactions", "tpami", "tip", "tmm", "tmi",
    "nature", "science", "cell", "lancet",
  ];
  const journalDoiPrefixes = ["10.1016", "10.1109", "10.1007", "10.1038", "10.1145"];
  if (
    journalKeywords.some((j) => venue.includes(j)) ||
    journalDoiPrefixes.some((p) => doi.startsWith(p))
  ) {
    paper.category = getName("journal", "期刊论文");
    return;
  }

  paper.category = getName("other", "其他");
}

/**
 * 从 arXiv API 批量获取论文元数据
 * @param {Array} papers - 含 { arxivId, title } 的数组
 * @returns {Promise<Map>} arxivId -> { title, authors, year, summary }
 */
async function fetchArxivMetadata(papers) {
  const ids = papers
    .map((p) => extractArxivId(p.arxiv || ""))
    .filter(Boolean);

  if (ids.length === 0) return new Map();

  const url = `http://export.arxiv.org/api/query?id_list=${ids.join(",")}&max_results=${ids.length}`;
  console.log(`🔬 正在从 arXiv 获取 ${ids.length} 篇论文元数据...`);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`   ⚠️  arXiv API 返回 ${res.status}，跳过自动获取`);
      return new Map();
    }

    const xml = await res.text();
    const results = new Map();

    // 拆分每个 <entry>
    const entries = xml.split("<entry>").slice(1);
    for (const entry of entries) {
      const entryXml = entry.split("</entry>")[0];

      // 提取 arXiv ID
      const idUrl = xmlGet(entryXml, "id");
      const idMatch = idUrl.match(/(\d{4}\.\d{4,5})/);
      if (!idMatch) continue;
      const arxivId = idMatch[1];

      // 提取标题（清理多余空白）
      const rawTitle = xmlGet(entryXml, "title").replace(/\s+/g, " ").trim();

      // 提取作者
      const authorBlocks = entryXml.match(/<author>[\s\S]*?<\/author>/g) || [];
      const authors = authorBlocks
        .map((a) => xmlGet(a, "name"))
        .filter(Boolean)
        .join(", ");

      // 提取年份（从 published 日期）
      const published = xmlGet(entryXml, "published");
      const year = published ? parseInt(published.substring(0, 4), 10) : undefined;

      // 提取摘要
      const summary = xmlGet(entryXml, "summary").replace(/\s+/g, " ").trim();

      results.set(arxivId, { title: rawTitle, authors, year, summary });
    }

    console.log(`   ✅ arXiv 返回 ${results.size} 篇`);
    return results;
  } catch (err) {
    console.warn(`   ⚠️  arXiv API 请求失败：${err.message}`);
    return new Map();
  }
}

/**
 * 自动补全论文元数据
 * 策略：手动填写 > Zotero 补全 > arXiv API
 *
 * 注意：此函数只补全已有 markdown 论文的缺失字段，不会自动导入新论文。
 * 导入新论文请使用 `npm run sync`（交互式 Zotero 同步工具）。
 */
async function enrichPapers(papers, papersDir) {
  if (papers.length === 0) return;

  // ── Step 1: Zotero 补全已有论文（可选）──
  const zoteroUserId = process.env.ZOTERO_USER_ID;
  const zoteroApiKey = process.env.ZOTERO_API_KEY;

  if (zoteroUserId && zoteroApiKey) {
    try {
      await syncFromZotero(papers, zoteroUserId, zoteroApiKey, papersDir);
    } catch (err) {
      console.warn(`   ⚠️  Zotero 同步失败：${err.message}`);
    }
  } else {
    console.log("📚 Zotero 未配置，跳过同步（仅使用 arXiv API）");
  }

  // ── Step 2: arXiv API 补充仍缺失的论文 ──
  const needsArxiv = papers.filter(
    (p) => !p.authors || !p.year || p.authors === "et al."
  );

  if (needsArxiv.length > 0) {
    const arxivData = await fetchArxivMetadata(needsArxiv);

    for (const paper of needsArxiv) {
      const arxivId = extractArxivId(paper.arxiv || "");
      const meta = arxivData.get(arxivId);
      if (!meta) continue;

      // 只填充缺失字段
      if (!paper.title && meta.title) paper.title = meta.title;
      if ((!paper.authors || paper.authors === "et al.") && meta.authors) {
        paper.authors = meta.authors;
      }
      if (!paper.year && meta.year) paper.year = meta.year;

      console.log(`   ✅ [arXiv] ${paper.title.substring(0, 50)}...`);
    }
  }
}

// ──────────────────────────────────────
// 主构建流程
// ──────────────────────────────────────

async function main() {
  // === 论文分类配置 ===
  const categoriesPath = path.join(CONTENT_DIR, "categories.json");
  const categoryNames = fs.existsSync(categoriesPath)
    ? JSON.parse(fs.readFileSync(categoriesPath, "utf-8"))
    : [];

  // === 研究日志 ===
  const updates = parseMarkdownDir(path.join(CONTENT_DIR, "updates"), ["title", "date"])
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  writeJSON("updates.json", updates);
  console.log(`✅ 研究日志：${updates.length} 条`);

  // === 论文笔记（带自动元数据补全）===
  // 论文的 title 可以为空（由 arXiv/Zotero 自动补全），所以只校验 arxiv 字段
  const papersDir = path.join(CONTENT_DIR, "papers");
  const papersRaw = parseMarkdownDir(papersDir, []);
  const papers = papersRaw.filter((p) => p.title || p.arxiv);

  // 自动补全论文元数据（Zotero + arXiv）
  await enrichPapers(papers, papersDir);

  // 自动推导分类（没有 category 字段的论文）
  for (const paper of papers) {
    deriveCategory(paper, categoryNames);
  }

  writeJSON("papers-content.json", papers);
  console.log(`✅ 论文笔记：${papers.length} 篇`);

  // === 研究方向 ===
  const directions = parseMarkdownDir(path.join(CONTENT_DIR, "directions"), ["title"]);
  writeJSON("directions.json", directions);
  console.log(`✅ 研究方向：${directions.length} 个`);

  // === 项目 ===
  const projects = parseMarkdownDir(path.join(CONTENT_DIR, "projects"), ["title"]);
  writeJSON("projects-content.json", projects);
  console.log(`✅ 项目：${projects.length} 个`);

  // 写入分类配置到 data 目录
  writeJSON("categories.json", categoryNames);
  if (categoryNames.length > 0) {
    console.log(`✅ 论文分类：${categoryNames.length} 个`);
  }

  // === 技术栈 ===
  const skillsPath = path.join(CONTENT_DIR, "skills.md");
  if (fs.existsSync(skillsPath)) {
    const raw = fs.readFileSync(skillsPath, "utf-8");
    const { data } = matter(raw);
    writeJSON("skills.json", {
      languages: data.languages || [],
      frameworks: data.frameworks || [],
    });
    console.log(`✅ 技术栈：${(data.languages || []).length} 语言 + ${(data.frameworks || []).length} 框架`);
  } else {
    writeJSON("skills.json", { languages: [], frameworks: [] });
    console.log("⚠️  content/skills.md 不存在，技术栈为空");
  }
}

main().catch((err) => {
  console.error("❌ 构建失败:", err);
  process.exit(1);
});
