# maomao 的个人主页

基于 Next.js 15 构建的个人主页，展示研究方向、技术栈、项目和论文笔记。

🔗 **在线访问**：[maomao-home.vercel.app](https://maomao-home.vercel.app)

## 特性

- 🎨 拟物风格卡片 + 动态光球背景
- 🎭 Framer Motion 流畅动画（打字机、视差、入场效果）
- 📱 响应式设计，适配桌面和移动端
- ⚡ Next.js 15 App Router + Tailwind CSS
- 🔒 安全响应头 + URL 协议校验
- 🚀 Vercel 一键部署，GitHub 推送自动更新

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 15, React 19 |
| 样式 | Tailwind CSS 4 |
| 动画 | Framer Motion |
| 语言 | TypeScript |
| 部署 | Vercel |

## 本地开发

```bash
# 克隆
git clone https://github.com/asydevf/homepage.git
cd homepage

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的信息

# 启动
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
content/
└── updates/              # 📝 研究日志（直接编辑 .md 文件）
scripts/
└── build-updates.js      # 构建脚本：md → JSON
src/
├── app/
│   ├── page.tsx          # 主页（Hero + 各板块 + 研究日志）
│   ├── layout.tsx        # 根布局 + 字体配置
│   └── globals.css       # 全局样式 + 拟物卡片
├── components/
│   ├── MouseTrackingOrbs.tsx  # 鼠标跟踪光球
│   └── SocialIcon.tsx         # 社交平台图标
└── data/
    ├── profile.ts        # 个人信息 + 项目 + 论文数据
    └── updates.json      # 自动生成（勿手动编辑）
```

## 配置

所有个人信息通过 `.env.local` 配置，详见 [.env.example](.env.example)。

关键配置项：
- `NEXT_PUBLIC_SITE_NAME` — 网站名称
- `NEXT_PUBLIC_PROFILE_MOTTO` — 座右铭（打字机效果）
- `NEXT_PUBLIC_SOCIALS` — 社交链接（JSON）

## 📝 研究日志（不用写代码）

在 `content/updates/` 目录创建 Markdown 文件即可更新网站内容。

### 操作步骤

1. 打开 GitHub 仓库页面：`content/updates/`
2. 点 **Add file** → **Create new file**
3. 文件名格式：`2026-06-13-标题.md`
4. 按下面模板填写内容
5. 点 **Commit changes** → Vercel 自动重新部署

### Markdown 模板

```markdown
---
title: 今天的标题
date: 2026-06-13
category: 论文复现
status: 进行中
tags: [Diffusion, Motion]
---

## 今日进展
做了什么写在这里...

## 心得收获
学到了什么写在这里...

## 下一步
接下来要做什么...
```

**字段说明：**
| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | ✅ | 标题 |
| `date` | ✅ | 日期 (YYYY-MM-DD) |
| `category` | ❌ | 分类，如"论文复现"、"项目"、"学习" |
| `status` | ❌ | 状态：已完成 / 进行中 / 规划中 |
| `tags` | ❌ | 标签数组 |

正文支持完整 Markdown 语法（标题、列表、代码块、引用等）。

## 部署

推送到 GitHub 后，[Vercel](https://vercel.com) 自动部署：

```bash
git push origin main
```

## License

[MIT](LICENSE)
