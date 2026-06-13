/**
 * 构建脚本：将 content/ 下的 .md 文件解析为 JSON
 * 在 `npm run build` 时自动生成：
 *   - src/data/updates.json  (研究日志)
 *   - src/data/papers-content.json  (论文笔记)
 *
 * 使用方法：
 *   node scripts/build-updates.js
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

const CONTENT_DIR = path.join(__dirname, "..", "content");
const DATA_DIR = path.join(__dirname, "..", "src", "data");

// 确保输出目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * 读取指定目录下的所有 .md 文件并解析
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
      return { ...data, content: marked.parse(content) };
    })
    .filter(Boolean);
}

// === 研究日志 ===
const updatesDir = path.join(CONTENT_DIR, "updates");
const updates = parseMarkdownDir(updatesDir, ["title", "date"])
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
fs.writeFileSync(path.join(DATA_DIR, "updates.json"), JSON.stringify(updates, null, 2), "utf-8");
console.log(`✅ 研究日志：${updates.length} 条 → src/data/updates.json`);

// === 论文笔记 ===
const papersDir = path.join(CONTENT_DIR, "papers");
const papers = parseMarkdownDir(papersDir, ["title"]);
fs.writeFileSync(path.join(DATA_DIR, "papers-content.json"), JSON.stringify(papers, null, 2), "utf-8");
console.log(`✅ 论文笔记：${papers.length} 篇 → src/data/papers-content.json`);
