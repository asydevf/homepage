/**
 * Zotero 交互式同步工具
 *
 * 用法：npm run sync
 *
 * 功能：
 *   1. 列出 Zotero 文献库中的所有论文
 *   2. 标记哪些已导入、哪些未导入
 *   3. 让用户选择要导入的论文（输入编号）
 *   4. 只导入选中的论文，创建 markdown 文件
 *   5. build 时只处理已有的 markdown 文件，不会自动导入新论文
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// 加载环境变量
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

const ZOTERO_API = "https://api.zotero.org";
const PAPERS_DIR = path.join(__dirname, "..", "content", "papers");
const IGNORED_FILE = path.join(PAPERS_DIR, ".zotero-ignored.json");

// ── 工具函数 ──

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 60);
}

function extractArxivId(url) {
  if (!url) return "";
  const match = url.match(/(\d{4}\.\d{4,5})(v\d+)?/);
  return match ? match[1] : "";
}

function xmlGet(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`);
  const m = xml.match(re);
  return m ? m[1].trim() : "";
}

function loadJSON(filepath) {
  try {
    if (fs.existsSync(filepath))
      return JSON.parse(fs.readFileSync(filepath, "utf-8"));
  } catch {}
  return {};
}

function saveJSON(filepath, data) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf-8");
}

// ── Zotero API ──

async function fetchZoteroItems(userId, apiKey) {
  const items = [];
  let start = 0;
  const limit = 100;

  while (true) {
    const url = `${ZOTERO_API}/users/${userId}/items?format=json&itemType=journalArticle%20%7C%7C%20conferencePaper%20%7C%7C%20preprint%20%7C%7C%20book%20%7C%7C%20bookSection&start=${start}&limit=${limit}&v=3`;
    const res = await fetch(url, {
      headers: { "Zotero-API-Key": apiKey },
    });

    if (!res.ok) {
      throw new Error(`Zotero API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (data.length === 0) break;
    items.push(...data);
    start += limit;
  }

  return items;
}

function extractMetadata(item) {
  const d = item.data || {};
  const url = d.url || "";
  const doi = d.DOI || "";

  let arxivId = "";
  // 从 URL 中提取 arXiv ID
  const arxivMatch = url.match(/arxiv\.org\/abs\/(\S+)/i);
  if (arxivMatch) arxivId = arxivMatch[1];
  // 从 DOI 中提取 arXiv ID（格式如 10.48550/arXiv.2410.10010）
  if (!arxivId && doi.startsWith("10.48550/arXiv.")) {
    arxivId = doi.replace("10.48550/arXiv.", "");
  }

  // 构建论文链接（优先级：arXiv > DOI > 原始 URL）
  let paperUrl = "";
  if (arxivId) {
    paperUrl = `https://arxiv.org/abs/${arxivId}`;
  } else if (doi) {
    paperUrl = `https://doi.org/${doi}`;
  } else if (url) {
    paperUrl = url;
  }

  const authors = (d.creators || [])
    .map((c) => {
      if (c.lastName && c.firstName) return `${c.lastName} ${c.firstName}`;
      return c.lastName || c.name || "";
    })
    .filter(Boolean)
    .join(", ");

  const venue = d.proceedingsTitle || d.publicationTitle || d.university || "";
  const year = d.date ? parseInt(d.date.substring(0, 4), 10) : undefined;

  // 自动推导分类
  const category = guessCategory(d.itemType, venue, arxivId);

  return {
    title: d.title || "",
    authors,
    venue,
    year,
    arxivId,
    paperUrl,
    doi,
    category,
    zoteroKey: d.key,
  };
}

/**
 * 根据 Zotero itemType 和 venue 自动推导分类
 */
function guessCategory(itemType, venue, arxivId) {
  if (itemType === "preprint" || arxivId) return "arXiv 预印本";
  if (itemType === "conferencePaper") return "会议论文";
  if (itemType === "journalArticle") return "期刊论文";
  if (itemType === "book" || itemType === "bookSection") return "书籍";
  return "其他";
}

// ── 从 arXiv 补充元数据 ──

async function fetchArxivMeta(arxivId) {
  if (!arxivId) return null;
  try {
    const res = await fetch(
      `http://export.arxiv.org/api/query?id_list=${arxivId}&max_results=1`
    );
    if (!res.ok) return null;
    const xml = await res.text();
    const entry = xml.split("<entry>")[1];
    if (!entry) return null;
    const entryXml = entry.split("</entry>")[0];

    const rawTitle = xmlGet(entryXml, "title").replace(/\s+/g, " ").trim();
    const authorBlocks = entryXml.match(/<author>[\s\S]*?<\/author>/g) || [];
    const authors = authorBlocks
      .map((a) => xmlGet(a, "name"))
      .filter(Boolean)
      .join(", ");
    const published = xmlGet(entryXml, "published");
    const year = published
      ? parseInt(published.substring(0, 4), 10)
      : undefined;
    const summary = xmlGet(entryXml, "summary").replace(/\s+/g, " ").trim();

    return { title: rawTitle, authors, year, summary };
  } catch {
    return null;
  }
}

// ── 创建 markdown 文件 ──

function createPaperMarkdown(meta, summary) {
  const filename = slugify(meta.title) + ".md";
  const filepath = path.join(PAPERS_DIR, filename);

  if (fs.existsSync(filepath)) return { filename, created: false };

  // 自动总结：用 arXiv 摘要的前 200 字作为初始总结
  const autoSummary = summary
    ? summary.length > 200
      ? summary.substring(0, 200) + "..."
      : summary
    : "";

  const frontmatter = [
    "---",
    `title: "${meta.title.replace(/"/g, '\\"')}"`,
    meta.authors ? `authors: ${meta.authors}` : null,
    meta.venue ? `venue: ${meta.venue}` : null,
    meta.year ? `year: ${meta.year}` : null,
    meta.arxivId ? `arxiv: https://arxiv.org/abs/${meta.arxivId}` : null,
    meta.doi ? `doi: ${meta.doi}` : null,
    meta.paperUrl && !meta.arxivId ? `url: ${meta.paperUrl}` : null,
    meta.category ? `category: "${meta.category}"` : null,
    "progress: 0",
    "status: 待读",
    "tags: []",
    "---",
    "",
    "## 论文总结",
    "",
    autoSummary ? `> ${autoSummary}` : "> （待填写：用一句话概括论文的核心贡献）",
    "",
    "## 阅读笔记",
    "",
    "（待补充）",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  fs.writeFileSync(filepath, frontmatter, "utf-8");
  return { filename, created: true };
}

// ── 主流程 ──

async function main() {
  const userId = process.env.ZOTERO_USER_ID;
  const apiKey = process.env.ZOTERO_API_KEY;

  if (!userId || !apiKey) {
    console.error("❌ 请在 .env 中配置 ZOTERO_USER_ID 和 ZOTERO_API_KEY");
    process.exit(1);
  }

  console.log("🔄 正在连接 Zotero 文献库...\n");
  const items = await fetchZoteroItems(userId, apiKey);
  console.log(`📚 文献库共 ${items.length} 条记录\n`);

  if (items.length === 0) {
    console.log("文献库为空，请先在 Zotero 客户端添加论文。");
    return;
  }

  // 加载忽略列表
  const ignored = loadJSON(IGNORED_FILE);

  // 检查已导入的文件
  const existingFiles = new Set(
    fs.readdirSync(PAPERS_DIR).filter((f) => f.endsWith(".md"))
  );

  // 构建论文列表
  const papers = items.map((item, idx) => {
    const meta = extractMetadata(item);
    const slug = slugify(meta.title);
    const filename = slug + ".md";
    const isImported = existingFiles.has(filename);
    const isIgnored = !!ignored[slug];

    return {
      idx: idx + 1,
      meta,
      slug,
      filename,
      isImported,
      isIgnored,
    };
  });

  // 显示列表
  console.log("─".repeat(70));
  console.log(
    "编号".padEnd(6) +
      "状态".padEnd(10) +
      "年份".padEnd(6) +
      "标题"
  );
  console.log("─".repeat(70));

  for (const p of papers) {
    const status = p.isIgnored
      ? "🗑️ 已忽略"
      : p.isImported
      ? "✅ 已导入"
      : "⬜ 未导入";
    const year = p.meta.year ? String(p.meta.year) : "----";
    const title =
      p.meta.title.length > 45
        ? p.meta.title.substring(0, 45) + "..."
        : p.meta.title;

    console.log(
      String(p.idx).padEnd(6) + status.padEnd(12) + year.padEnd(6) + title
    );
  }

  console.log("─".repeat(70));
  console.log("");
  console.log("操作说明：");
  console.log("  输入编号导入论文，多个用逗号分隔，如: 1,3,5");
  console.log("  输入 all    → 导入所有未导入的论文");
  console.log("  输入 q      → 退出");
  console.log("  已忽略的论文需要先编辑 .zotero-ignored.json 取消忽略");
  console.log("");

  // 交互式输入
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await new Promise((resolve) => {
    rl.question("请选择要导入的论文编号: ", resolve);
  });
  rl.close();

  const input = answer.trim().toLowerCase();
  if (input === "q" || input === "") {
    console.log("已取消。");
    return;
  }

  // 解析选择
  let selected;
  if (input === "all") {
    selected = papers.filter((p) => !p.isImported && !p.isIgnored);
  } else {
    const nums = input
      .split(/[,，\s]+/)
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n >= 1 && n <= papers.length);
    selected = nums.map((n) => papers[n - 1]);
  }

  if (selected.length === 0) {
    console.log("没有可导入的论文（可能都已导入或被忽略）。");
    return;
  }

  console.log(`\n📥 正在导入 ${selected.length} 篇论文...\n`);

  // 批量获取 arXiv 元数据（如果有多个 arXiv ID）
  const arxivIds = selected
    .map((p) => p.meta.arxivId)
    .filter(Boolean);
  const arxivCache = new Map();

  if (arxivIds.length > 0) {
    console.log("🔬 从 arXiv 补充元数据...");
    for (const id of arxivIds) {
      const arxivMeta = await fetchArxivMeta(id);
      if (arxivMeta) arxivCache.set(id, arxivMeta);
      // arXiv API 限速：每次请求间隔 3 秒
      if (arxivIds.indexOf(id) < arxivIds.length - 1) {
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
    console.log(`   ✅ 获取 ${arxivCache.size} 篇\n`);
  }

  // 导入
  let imported = 0;
  let skipped = 0;

  for (const p of selected) {
    const meta = { ...p.meta };

    // 用 arXiv 数据补充
    let arxivSummary = "";
    if (meta.arxivId && arxivCache.has(meta.arxivId)) {
      const arxiv = arxivCache.get(meta.arxivId);
      if (!meta.authors && arxiv.authors) meta.authors = arxiv.authors;
      if (!meta.year && arxiv.year) meta.year = arxiv.year;
      if (!meta.title && arxiv.title) meta.title = arxiv.title;
      arxivSummary = arxiv.summary || "";
    }

    const { filename, created } = createPaperMarkdown(meta, arxivSummary);

    if (created) {
      imported++;
      console.log(`  ✅ ${meta.title.substring(0, 55)}...`);
      console.log(`     → content/papers/${filename}`);
    } else {
      skipped++;
      console.log(`  ⏭️  ${meta.title.substring(0, 55)}...（已存在）`);
    }
  }

  console.log(`\n📊 完成：导入 ${imported} 篇，跳过 ${skipped} 篇`);
  console.log("运行 npm run build 更新网站。\n");
}

main().catch((err) => {
  console.error("❌ 错误:", err.message);
  process.exit(1);
});
