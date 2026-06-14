/**
 * Zotero Web API 同步模块
 *
 * 从 Zotero 云文献库拉取论文元数据，用于自动补全 paper frontmatter 中缺失的字段。
 * 匹配规则：优先 arXiv ID，其次标题模糊匹配。
 * 导入新论文时自动创建 markdown 文件，方便后续添加阅读笔记。
 */

const fs = require("fs");
const path = require("path");

const ZOTERO_API = "https://api.zotero.org";

/**
 * 从 Zotero 获取用户文献库中的所有条目（分页）
 * @param {string} userId - Zotero User ID
 * @param {string} apiKey - Zotero API Key
 * @returns {Promise<Array>} Zotero 条目数组
 */
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

/**
 * 从 Zotero 条目中提取论文元数据
 * @param {Object} item - Zotero API 返回的单个条目
 * @returns {Object} 结构化的论文数据
 */
function extractMetadata(item) {
  const d = item.data || {};

  // 提取 arXiv ID（从 URL 或 DOI 中）
  let arxivId = "";
  const url = d.url || "";
  const doi = d.DOI || "";
  const arxivMatch = url.match(/arxiv\.org\/abs\/(\S+)/i);
  if (arxivMatch) {
    arxivId = arxivMatch[1];
  }
  // 从 DOI 中提取 arXiv ID（格式如 10.48550/arXiv.2410.10010）
  if (!arxivId && doi.startsWith("10.48550/arXiv.")) {
    arxivId = doi.replace("10.48550/arXiv.", "");
  }

  // 提取作者
  const authors = (d.creators || [])
    .map((c) => {
      if (c.lastName && c.firstName) return `${c.lastName} ${c.firstName}`;
      return c.lastName || c.name || "";
    })
    .filter(Boolean)
    .join(", ");

  // 提取发表信息
  let venue = d.proceedingsTitle || d.publicationTitle || d.university || "";
  const year = d.date ? parseInt(d.date.substring(0, 4), 10) : undefined;

  return {
    title: d.title || "",
    authors,
    venue,
    year,
    arxivId,
    doi,
    url,
    zoteroKey: d.key,
  };
}

/**
 * 根据 arXiv ID 或标题匹配 Zotero 条目
 * @param {Array} zoteroItems - Zotero 条目数组
 * @param {string} arxivId - arXiv ID
 * @param {string} title - 论文标题
 * @returns {Object|null} 匹配到的元数据，或 null
 */
function matchPaper(zoteroItems, arxivId, title) {
  // 优先通过 arXiv ID 匹配
  if (arxivId) {
    for (const item of zoteroItems) {
      const meta = extractMetadata(item);
      if (meta.arxivId && meta.arxivId.includes(arxivId)) {
        return meta;
      }
    }
  }

  // 其次通过标题模糊匹配（忽略大小写、标点、多余空格）
  if (title) {
    const normalize = (s) =>
      s.toLowerCase().replace(/[^a-z0-9一-鿿]/g, "").trim();
    const normTitle = normalize(title);

    for (const item of zoteroItems) {
      const meta = extractMetadata(item);
      if (meta.title && normalize(meta.title) === normTitle) {
        return meta;
      }
    }
  }

  return null;
}

/**
 * 加载/保存已导入论文的记录（用于检测用户删除行为）
 */
const IMPORTED_FILE = ".zotero-imported.json";
const IGNORED_FILE = ".zotero-ignored.json";

function loadJSON(filepath) {
  try {
    if (fs.existsSync(filepath)) {
      return JSON.parse(fs.readFileSync(filepath, "utf-8"));
    }
  } catch { /* ignore */ }
  return {};
}

function saveJSON(filepath, data) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf-8");
}

function loadIgnored(papersDir) {
  return loadJSON(path.join(papersDir, IGNORED_FILE));
}

function saveIgnored(papersDir, ignored) {
  saveJSON(path.join(papersDir, IGNORED_FILE), ignored);
}

function loadImported(papersDir) {
  return loadJSON(path.join(papersDir, IMPORTED_FILE));
}

function saveImported(papersDir, imported) {
  saveJSON(path.join(papersDir, IMPORTED_FILE), imported);
}

/**
 * 检测用户删除了哪些之前导入的论文，更新忽略列表
 * 通过检查文件是否存在来判断（比标题匹配更可靠）
 */
function detectDeletedPapers(papersDir) {
  const imported = loadImported(papersDir);
  const ignored = loadIgnored(papersDir);

  let newIgnored = 0;
  for (const [key, info] of Object.entries(imported)) {
    // 通过文件名检查是否被删除
    const filepath = path.join(papersDir, info.filename);
    if (!fs.existsSync(filepath)) {
      if (!ignored[key]) {
        ignored[key] = { title: info.title, deletedAt: new Date().toISOString() };
        newIgnored++;
        console.log(`   🗑️  [忽略] 检测到删除：${info.title.substring(0, 50)}...`);
      }
    }
  }

  if (newIgnored > 0) {
    saveIgnored(papersDir, ignored);
  }

  return ignored;
}

/**
 * 从标题生成文件名 slug（只保留英文数字和连字符）
 */
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 60);
}

/**
 * 为导入的论文创建 markdown 文件
 */
function createPaperMarkdown(papersDir, meta, arxivUrl) {
  const filename = slugify(meta.title) + ".md";
  const filepath = path.join(papersDir, filename);

  // 已存在则跳过
  if (fs.existsSync(filepath)) return false;

  const frontmatter = [
    "---",
    `title: "${meta.title.replace(/"/g, '\\"')}"`,
    meta.authors ? `authors: ${meta.authors}` : null,
    meta.venue ? `venue: ${meta.venue}` : null,
    meta.year ? `year: ${meta.year}` : null,
    arxivUrl ? `arxiv: ${arxivUrl}` : null,
    "progress: 0",
    "status: 待读",
    "tags: []",
    "---",
    "",
    "## 阅读笔记",
    "",
    "（待补充）",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  fs.writeFileSync(filepath, frontmatter, "utf-8");
  return filename;
}

/**
 * 从 Zotero 补全已有论文的元数据（不导入新论文）
 * 新论文请使用 `npm run sync` 交互式导入
 * @param {Array} papers - 解析后的论文 frontmatter 数组
 * @param {string} userId - Zotero User ID
 * @param {string} apiKey - Zotero API Key
 * @param {string} papersDir - 论文 markdown 目录路径
 * @returns {Promise<void>}
 */
async function syncFromZotero(papers, userId, apiKey, papersDir) {
  console.log("🔄 正在从 Zotero 补全论文元数据...");
  const zoteroItems = await fetchZoteroItems(userId, apiKey);
  console.log(`   📚 Zotero 文献库：${zoteroItems.length} 条`);

  let matched = 0;
  for (const paper of papers) {
    const meta = matchPaper(zoteroItems, paper.arxivId, paper.title);
    if (!meta) continue;

    if (!paper.title && meta.title) paper.title = meta.title;
    if ((!paper.authors || paper.authors === "et al.") && meta.authors) {
      paper.authors = meta.authors;
    }
    if (!paper.venue && meta.venue) paper.venue = meta.venue;
    if (!paper.year && meta.year) paper.year = meta.year;
    if (!paper.arxivId && meta.arxivId) paper.arxivId = meta.arxivId;
    if (!paper.doi && meta.doi) paper.doi = meta.doi;
    if (!paper.url && meta.url) paper.url = meta.url;

    matched++;
    console.log(`   ✅ [补全] ${paper.title.substring(0, 50)}...`);
  }

  console.log(`   📊 Zotero 补全：${matched}/${papers.length} 篇`);
  console.log(`   💡 导入新论文请运行 npm run sync`);
}

/** 提取 arXiv ID（供外部使用） */
function extractArxivId(url) {
  if (!url) return "";
  const match = url.match(/(\d{4}\.\d{4,5})(v\d+)?/);
  return match ? match[1] : "";
}

module.exports = { syncFromZotero };
