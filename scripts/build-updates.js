/**
 * 构建脚本：将 content/updates/*.md 解析为 JSON
 * 在 `npm run build` 时自动执行，生成 src/data/updates.json
 *
 * 使用方法：
 *   node scripts/build-updates.js
 *
 * 添加新内容：
 *   1. 在 content/updates/ 目录创建 .md 文件
 *   2. 按模板填写 frontmatter 和正文
 *   3. git push → Vercel 自动重新部署
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

const UPDATES_DIR = path.join(__dirname, "..", "content", "updates");
const OUTPUT_FILE = path.join(__dirname, "..", "src", "data", "updates.json");

// 确保输出目录存在
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 读取所有 .md 文件
if (!fs.existsSync(UPDATES_DIR)) {
  console.log("⚠️  content/updates/ 目录不存在，跳过");
  fs.writeFileSync(OUTPUT_FILE, "[]", "utf-8");
  process.exit(0);
}

const files = fs.readdirSync(UPDATES_DIR).filter((f) => f.endsWith(".md"));

if (files.length === 0) {
  console.log("⚠️  content/updates/ 为空，生成空数组");
  fs.writeFileSync(OUTPUT_FILE, "[]", "utf-8");
  process.exit(0);
}

const updates = files
  .map((filename) => {
    const filepath = path.join(UPDATES_DIR, filename);
    const raw = fs.readFileSync(filepath, "utf-8");
    const { data, content } = matter(raw);

    // 校验必填字段
    if (!data.title || !data.date) {
      console.warn(`⚠️  ${filename} 缺少 title 或 date，已跳过`);
      return null;
    }

    return {
      title: data.title,
      date: data.date,
      category: data.category || "其他",
      status: data.status || "",
      tags: data.tags || [],
      content: marked.parse(content),
    };
  })
  .filter(Boolean)
  // 按日期倒序
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(updates, null, 2), "utf-8");
console.log(`✅ 已生成 ${updates.length} 条研究日志 → src/data/updates.json`);
