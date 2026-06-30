# CLAUDE.md — 项目开发指南

## 项目概述

QQHKX 个人主页 — 基于 Next.js 15 的静态个人品牌展示页面，部署在 Cloudflare Pages。

## 技术栈

- **框架:** Next.js 15 (App Router, 静态导出)
- **UI:** React 19 + Tailwind CSS 4 + Framer Motion 12
- **语言:** TypeScript
- **内容管理:** Markdown-as-CMS (gray-matter + marked)
- **部署:** Cloudflare Pages (静态 export)

## 常用命令

```bash
npm run dev          # 本地开发服务器
npm run build        # 解析 Markdown 内容 + 构建静态站点
npm run build:updates # 仅解析 Markdown → JSON
npm run sync         # 从 Zotero 导入论文
npm run lint         # ESLint 检查
```

## 项目结构

```
src/
├── app/
│   ├── page.tsx         # 主页面（组合各区块）
│   ├── layout.tsx       # 根布局
│   └── globals.css      # 全局样式（玻璃拟态风格）
├── components/
│   ├── TypingText.tsx       # 打字机效果
│   ├── SkillBar.tsx         # 技能进度条
│   ├── SectionTitle.tsx     # 通用板块标题
│   ├── ResearchDirectionsList.tsx  # 研究方向列表
│   ├── PapersList.tsx       # 论文列表+筛选
│   ├── PaperCard.tsx        # 论文卡片（可展开）
│   ├── SearchInput.tsx      # 搜索输入+高亮
│   ├── SocialIcon.tsx       # 社交媒体图标
│   └── MouseTrackingOrbs.tsx # 鼠标跟踪光球背景
└── data/
    ├── profile.ts       # 个人资料（读取环境变量）
    └── *.json           # 由 build-updates.js 自动生成
```

## 内容管理

所有内容在 `content/` 目录下以 Markdown + YAML frontmatter 管理：

| 内容类型 | 目录 | 构建输出 |
|---------|------|---------|
| 研究日志 | `content/updates/` | `src/data/updates.json` |
| 论文笔记 | `content/papers/` | `src/data/papers-content.json` |
| 研究方向 | `content/paths/` | `src/data/directions.json` |
| 开源项目 | `content/projects/` | `src/data/projects-content.json` |
| 技术栈 | `content/skills.md` | `src/data/skills.json` |
| 论文分类 | `content/categories.json` | 直接复制 |

## 代码规范

- 组件使用 `"use client"` 声明（因为使用了 Framer Motion 动画）
- 样式使用 Tailwind CSS 工具类 + `globals.css` 中的自定义类（`card-skeu`、`btn-ios`、`chip-ios`）
- 动画使用 Framer Motion，遵循现有的 `initial/whileInView/viewport` 模式
- 所有外部链接添加 `target="_blank" rel="noopener noreferrer"`
- 类型定义集中在 `src/data/profile.ts`

## 部署

静态导出模式 (`output: "export"`)，构建产物在 `out/` 目录，部署到阿里云。环境变量通过 `.env` 文件配置。
