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
- 📚 Zotero 文献同步，自动导入论文笔记
- 🛡️ 全局错误处理 + 加载状态页面
- 🏷️ 论文分类系统（arXiv、会议、期刊等）
- 🔍 全文搜索，支持标题、作者、笔记内容搜索

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 15, React 19 |
| 样式 | Tailwind CSS 4 |
| 动画 | Framer Motion |
| 语言 | TypeScript |
| 部署 | Vercel |
| 文献管理 | Zotero + Better BibTeX |

## 错误处理与加载状态

项目内置了全局错误边界和加载状态页面：

- **错误页面** (`error.tsx`): 当页面组件抛出异常时，显示友好的错误界面而非白屏
- **加载页面** (`loading.tsx`): 在页面数据加载期间显示 iOS 风格的加载动画

这些页面会自动生效，无需额外配置。

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

# （可选）同步 Zotero 论文
npm run sync-zotero
```

访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
content/
├── updates/              # 📝 研究日志（直接编辑 .md 文件）
├── papers/               # 📄 论文笔记（直接编辑 .md 文件）
├── directions/           # 🔬 研究方向（直接编辑 .md 文件）
├── projects/             # 🚀 项目展示（直接编辑 .md 文件）
├── skills.md             # 💻 技术栈（直接编辑此文件）
└── categories.json       # 🏷️ 论文分类配置
scripts/
├── build-updates.js      # 构建脚本：md → JSON
├── sync-zotero.js        # Zotero 文献同步脚本
└── lib/                  # 脚本工具库
src/
├── app/
│   ├── page.tsx          # 主页（所有板块）
│   ├── layout.tsx        # 根布局 + 字体配置
│   ├── globals.css       # 全局样式 + 拟物卡片
│   ├── error.tsx         # 全局错误边界
│   └── loading.tsx       # 全局加载状态
├── components/
│   ├── MouseTrackingOrbs.tsx  # 鼠标跟踪光球
│   ├── SocialIcon.tsx         # 社交平台图标
│   └── SearchInput.tsx        # 搜索输入组件
└── data/
    ├── profile.ts        # 个人信息配置
    ├── updates.json      # 自动生成（勿手动编辑）
    ├── papers-content.json  # 自动生成
    ├── directions.json   # 自动生成
    ├── projects-content.json  # 自动生成
    └── skills.json       # 自动生成
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

## 🔬 研究方向（不用写代码）

在 `content/directions/` 目录创建 `.md` 文件即可添加研究方向。

### 模板

```markdown
---
title: 方向名称
emoji: 🔬
keywords: [关键词1, 关键词2]
---

这个方向的简要描述...
```

**字段说明：**
| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | ✅ | 方向名称 |
| `emoji` | ❌ | 显示的 emoji 图标 |
| `keywords` | ❌ | 关键词数组 |

用数字前缀控制显示顺序：`01-xxx.md`、`02-xxx.md`。

## 🚀 项目展示（不用写代码）

在 `content/projects/` 目录创建 `.md` 文件即可添加项目。

### 模板

```markdown
---
title: 项目名称
url: https://github.com/asydevf/xxx
description: 一句话描述
tags: [Next.js, TypeScript]
status: 已完成
---

项目详细介绍...
```

**字段说明：**
| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | ✅ | 项目名称 |
| `url` | ❌ | 项目链接（GitHub、演示站等） |
| `description` | ❌ | 一句话描述 |
| `tags` | ❌ | 技术栈标签数组 |
| `status` | ❌ | 状态：已完成 / 进行中 / 规划中 |

## 💻 技术栈（不用写代码）

编辑 `content/skills.md` 文件即可修改技术栈：

```markdown
---
languages:
  - name: Python
    level: 5
  - name: JavaScript
    level: 4

frameworks:
  - name: PyTorch
    level: 5
  - name: React
    level: 4
---
```

`level` 范围 1-5，显示为进度条。

## 📄 论文笔记（不用写代码）

在 `content/papers/` 目录创建 Markdown 文件即可添加论文笔记。

### 方式一：手动创建

1. 打开 GitHub 仓库页面：`content/papers/`
2. 点 **Add file** → **Create new file**
3. 文件名：`论文简称.md`（如 `intergen.md`）
4. 按模板填写 → Commit → 自动部署

### 方式二：Zotero 自动同步

项目支持从 Zotero 文献管理器自动同步论文笔记：

```bash
# 同步 Zotero 中的论文到 content/papers/
npm run sync-zotero
```

**配置要求：**
- 安装 [Zotero](https://www.zotero.org/) 并配置 Better BibTeX 插件
- 在 Zotero 中导出论文时添加自定义字段：
  - `progress`: 阅读进度 (0-100)
  - `status`: 状态（已读/阅读中/复现中/已复现）
  - `tags`: 标签（逗号分隔）

**同步后的文件会自动：**
- 生成标准 Markdown 格式
- 包含论文元数据（标题、作者、会议等）
- 保留你的笔记和标注
- 自动分类到对应类别

### Markdown 模板

```markdown
---
title: "论文完整标题"
authors: 作者 et al.
venue: ICCV 2023
year: 2023
arxiv: https://arxiv.org/abs/xxxx.xxxxx
doi: 10.1016/j.eswa.2025.129988
url: https://example.com/paper
progress: 60
status: 阅读中
repo: https://github.com/xxx/xxx
tags: [Diffusion, Motion]
category: arXiv 预印本
---

## 论文概述
一句话说清楚论文做了什么...

## 核心方法
方法的关键点...

## 阅读笔记
你的理解和思考...

## 复现进展
- [x] 读完论文
- [x] 跑通代码
- [ ] 对比实验
```

**字段说明：**
| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | ✅ | 论文标题 |
| `authors` | ❌ | 作者（多个用逗号分隔） |
| `venue` | ❌ | 会议/期刊名称 |
| `year` | ❌ | 发表年份 |
| `arxiv` | ❌ | arXiv 链接（自动提取元数据） |
| `doi` | ❌ | DOI 编号（如 `10.1016/j.eswa.2025.129988`） |
| `url` | ❌ | 论文链接（非 arXiv 时使用） |
| `progress` | ❌ | 阅读进度 0-100 |
| `status` | ❌ | 状态：已读 / 阅读中 / 复现中 / 已复现 / 待读 |
| `repo` | ❌ | 项目仓库地址 |
| `tags` | ❌ | 标签数组 |
| `category` | ❌ | 分类：arxiv / conference / journal / book / other |

**论文分类系统：**

在 `content/categories.json` 中配置论文分类：

```json
[
  { "id": "arxiv", "name": "arXiv 预印本", "emoji": "📄" },
  { "id": "conference", "name": "会议论文", "emoji": "🎤" },
  { "id": "journal", "name": "期刊论文", "emoji": "📰" },
  { "id": "book", "name": "书籍", "emoji": "📖" },
  { "id": "other", "name": "其他", "emoji": "📁" }
]
```

论文会根据 `category` 字段自动分类显示。

## 部署

推送到 GitHub 后，[Vercel](https://vercel.com) 自动部署：

```bash
git push origin main
```

## 更新日志

### 2026-06-14
- ✨ 新增 Zotero 文献同步功能
- 🛡️ 添加全局错误边界和加载状态页面
- 🏷️ 实现论文分类系统
- 📁 优化项目结构，添加脚本工具库
- 🔍 新增全文搜索功能，支持标题、作者、笔记内容搜索

### 2026-06-13
- 🎉 项目上线，支持研究日志、论文笔记、研究方向、项目展示
- 🎨 实现拟物风格卡片 + 动态光球背景
- 📱 完成响应式设计适配

## License

[MIT](LICENSE)
