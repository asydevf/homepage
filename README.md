# QQHKX 的个人主页

基于 Next.js 15 构建的个人主页，展示研究方向、技术栈、项目和论文笔记。

🔗 **在线访问**：https://qqhkx.com

## 特性

- 🎨 拟物风格卡片 + 动态光球背景
- 🎭 Framer Motion 流畅动画（打字机、视差、入场效果）
- 📱 响应式设计，适配桌面和移动端
- ⚡ Next.js 15 App Router + Tailwind CSS 4
- 🔒 安全响应头 + URL 协议校验
- 📚 Zotero 文献同步，自动导入论文笔记
- 🛡️ 全局错误处理 + 加载状态页面
- 🔍 全文搜索，支持标题、作者、笔记内容搜索
- 📂 按研究方向分板块展示论文和项目

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 15, React 19 |
| 样式 | Tailwind CSS 4 |
| 动画 | Framer Motion |
| 语言 | TypeScript |
| 部署 | 阿里云 |
| 文献管理 | Zotero + Better BibTeX |

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
├── updates/              # 📝 研究日志
├── papers/               # 📄 论文笔记
├── directions/           # 🔬 研究方向
├── projects/             # 🚀 项目展示
├── skills.md             # 💻 技术栈
└── categories.json       # 🏷️ 论文分类配置
scripts/
├── build-updates.js      # 构建脚本：md → JSON
├── sync-zotero.js        # Zotero 文献同步
└── lib/                  # 脚本工具库
src/
├── app/
│   ├── page.tsx          # 主页（组合各区块）
│   ├── layout.tsx        # 根布局 + 字体配置
│   ├── globals.css       # 全局样式 + 拟物卡片
│   ├── error.tsx         # 全局错误边界
│   └── loading.tsx       # 全局加载状态
├── components/
│   ├── TypingText.tsx        # 打字机效果
│   ├── SkillBar.tsx          # 技能进度条
│   ├── SectionTitle.tsx      # 通用板块标题
│   ├── ResearchDirectionsList.tsx  # 研究方向列表
│   ├── PapersList.tsx        # 论文列表（按方向分板块）
│   ├── PaperCard.tsx         # 论文卡片
│   ├── SearchInput.tsx       # 搜索输入组件
│   ├── SocialIcon.tsx        # 社交平台图标
│   └── MouseTrackingOrbs.tsx # 鼠标跟踪光球
└── data/
    ├── profile.ts        # 个人信息配置
    └── *.json            # 自动生成（勿手动编辑）
```

## 配置

所有个人信息通过 `.env` 文件配置，详见 [ENV_CONFIG.md](ENV_CONFIG.md)。

关键配置项：
- `NEXT_PUBLIC_PROFILE_NAME` — 显示名称
- `NEXT_PUBLIC_PROFILE_MOTTO` — 座右铭（打字机效果）
- `NEXT_PUBLIC_SOCIALS` — 社交链接（JSON）

## 📝 内容管理（不用写代码）

所有内容通过 `content/` 目录下的 Markdown 文件管理，修改后运行 `npm run build` 即可。

### 研究日志

在 `content/updates/` 创建文件，文件名格式：`2026-06-13-标题.md`

```markdown
---
title: 今天的标题
date: 2026-06-13
category: 论文复现
status: 进行中
tags: [Diffusion, Motion]
---

正文内容...
```

### 论文笔记

在 `content/papers/` 创建文件，添加 `direction` 字段自动归入方向板块：

```markdown
---
title: "论文标题"
authors: 作者 et al.
venue: ICCV 2023
year: 2023
arxiv: https://arxiv.org/abs/xxxx.xxxxx
progress: 60
status: 阅读中
tags: [Diffusion, Motion]
direction: 人体交互生成
---

## 论文概述
...

## 阅读笔记
...
```

**direction 可选值：** `图像融合`、`人体交互生成`、`路径规划`

### 研究方向

在 `content/directions/` 创建文件，用数字前缀控制顺序：

```markdown
---
title: 方向名称
emoji: 🔬
keywords: [关键词1, 关键词2]
---

方向描述...
```

### 项目展示

在 `content/projects/` 创建文件：

```markdown
---
title: 项目名称
url: https://github.com/asydevf/xxx
description: 一句话描述
tags: [Next.js, TypeScript]
status: 已完成
direction: 人体交互生成
---

项目介绍...
```

### 技术栈

编辑 `content/skills.md`，`level` 范围 1-5：

```yaml
languages:
  - name: Python
    level: 5

frameworks:
  - name: PyTorch
    level: 5
```

## 部署

项目构建为静态站点，部署到阿里云：

```bash
npm run build
# 产物在 out/ 目录，上传到服务器即可
```

## 更新日志

### 2026-06-30
- 🔀 按研究方向分板块展示论文和项目（图像融合、人体交互生成、路径规划）
- ✂️ 拆分 page.tsx 为独立组件，提升可维护性
- 🖼️ 压缩图片资源（avatar 1.7MB→63KB，web 3MB→114KB）
- 📄 添加 CLAUDE.md 项目开发指南
- 🧹 清理杂项文件

### 2026-06-14
- ✨ 新增 Zotero 文献同步功能
- 🛡️ 添加全局错误边界和加载状态页面
- 🔍 新增全文搜索功能

### 2026-06-13
- 🎉 项目上线

## License

[MIT](LICENSE)
