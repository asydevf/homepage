/**
 * 构建脚本：将 content/ 下的 .md 文件解析为 JSON
 * 在 `npm run build` 时自动生成：
 *   - src/data/updates.json          (研究日志)
 *   - src/data/papers-content.json   (论文笔记)
 *   - src/data/directions.json       (研究方向)
 *   - src/data/projects-content.json (项目)
 *   - src/data/skills.json           (技术栈)
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

const CONTENT_DIR = path.join(__dirname, "..", "content");
const DATA_DIR = path.join(__dirname, "..", "src", "data");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

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

// === 研究日志 ===
const updates = parseMarkdownDir(path.join(CONTENT_DIR, "updates"), ["title", "date"])
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
writeJSON("updates.json", updates);
console.log(`✅ 研究日志：${updates.length} 条`);

// === 论文笔记 ===
const papers = parseMarkdownDir(path.join(CONTENT_DIR, "papers"), ["title"]);
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
