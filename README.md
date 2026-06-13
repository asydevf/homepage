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
src/
├── app/
│   ├── page.tsx          # 主页（Hero + 各板块）
│   ├── layout.tsx        # 根布局 + 字体配置
│   └── globals.css       # 全局样式 + 拟物卡片
├── components/
│   ├── MouseTrackingOrbs.tsx  # 鼠标跟踪光球
│   └── SocialIcon.tsx         # 社交平台图标
└── data/
    └── profile.ts        # 个人信息 + 项目 + 论文数据
```

## 配置

所有个人信息通过 `.env.local` 配置，详见 [.env.example](.env.example)。

关键配置项：
- `NEXT_PUBLIC_SITE_NAME` — 网站名称
- `NEXT_PUBLIC_PROFILE_MOTTO` — 座右铭（打字机效果）
- `NEXT_PUBLIC_SOCIALS` — 社交链接（JSON）

## 部署

推送到 GitHub 后，[Vercel](https://vercel.com) 自动部署：

```bash
git push origin main
```

## License

[MIT](LICENSE)
