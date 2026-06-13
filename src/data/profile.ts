/*
 * 文件用途：集中存放 QQHKX 的个人资料与项目数据，供页面渲染调用。
 * 说明：数据来源于环境变量配置，支持动态配置管理。
 */

export type SocialLink = {
  /** 平台名称，例如 GitHub/Bilibili/Blog */
  name: string;
  /** 访问地址 */
  url: string;
};

export type SkillItem = {
  /** 技术名称 */
  name: string;
  /** 熟练度 1-5 */
  level: number;
};

export type Project = {
  /** 项目名称/仓库名 */
  title: string;
  /** 项目链接（GitHub 或外链） */
  url: string;
  /** 项目简要描述 */
  description: string;
  /** 项目标签数组，用于标识技术栈或特性 */
  tags: string[];
  /** 项目状态 */
  status: '已完成' | '进行中' | '规划中';
};

export type StatItem = {
  /** 统计标签 */
  label: string;
  /** 统计数值 */
  value: string;
  /** 锚点 ID，点击跳转到对应区域 */
  href: string;
};

export type Update = {
  /** 标题 */
  title: string;
  /** 日期 (YYYY-MM-DD) */
  date: string;
  /** 分类 */
  category: string;
  /** 状态 */
  status: string;
  /** 标签 */
  tags: string[];
  /** 渲染后的 HTML 内容 */
  content: string;
};

export type PaperContent = {
  /** 论文标题 */
  title: string;
  /** 作者 */
  authors?: string;
  /** 发表会议/期刊 */
  venue?: string;
  /** 年份 */
  year?: number;
  /** arXiv 链接 */
  arxiv?: string;
  /** 阅读进度 0-100 */
  progress?: number;
  /** 复现状态 */
  status?: string;
  /** 项目仓库 */
  repo?: string;
  /** 标签 */
  tags?: string[];
  /** 渲染后的笔记 HTML */
  content: string;
};

export type ResearchDirection = {
  /** 方向名称 */
  title: string;
  /** 简要描述 */
  description: string;
  /** 相关关键词 */
  keywords: string[];
};

export type Paper = {
  /** 论文标题 */
  title: string;
  /** 作者 */
  authors: string;
  /** 发表信息（会议/期刊 + 年份） */
  venue: string;
  /** 一句话核心要点 */
  highlight: string;
  /** 链接（arXiv / 项目页） */
  url: string;
};

export type Profile = {
  /** 用户名或展示名 */
  name: string;
  /** 座右铭/签名 */
  motto: string;
  /** 当前所在地 */
  location: string;
  /** 当前身份 */
  role: string;
  /** 头像链接（远程地址） */
  avatar: string;
  /** 个人简介描述 */
  description: string;
  /** 研究兴趣关键词 */
  interests: string[];
  /** 社交链接集合 */
  socials: SocialLink[];
  /** 编程语言（带熟练度） */
  languages: SkillItem[];
  /** 框架与工具（带熟练度） */
  frameworksAndTools: SkillItem[];
  /** 关键统计数据（可点击导航） */
  stats: StatItem[];
  /** 研究方向 */
  researchDirections: ResearchDirection[];
  /** 个人项目 */
  projects: Project[];
  /** 论文阅读列表 */
  papers: Paper[];
  /** 备案号 */
  icpNumber?: string;
  /** 网站名称 */
  siteName: string;
  /** 网站域名后缀 */
  siteDomain: string;
  /** 头像alt文本 */
  avatarAlt: string;
  /** 图片域名 */
  imageHostname: string;
};

/**
 * 校验 URL 协议是否安全（仅允许 https: 和 mailto:）
 * @param url - 待校验的 URL 字符串
 * @returns 是否合法
 */
function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["https:", "mailto:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * 从环境变量安全解析JSON字符串
 * @param envVar - 环境变量值
 * @param fallback - 解析失败时的默认值
 * @returns 解析后的对象或默认值
 */
function parseEnvJSON<T>(envVar: string | undefined, fallback: T): T {
  if (!envVar) return fallback;
  try {
    return JSON.parse(envVar) as T;
  } catch {
    console.warn(`Failed to parse environment variable: ${envVar}`);
    return fallback;
  }
}


// 创建基础配置对象
const baseProfile = {
  name: process.env.NEXT_PUBLIC_PROFILE_NAME || "",
  motto: process.env.NEXT_PUBLIC_PROFILE_MOTTO || "",
  location: process.env.NEXT_PUBLIC_PROFILE_LOCATION || "",
  role: process.env.NEXT_PUBLIC_PROFILE_ROLE || "",
  avatar: "/image/avatar.png",
  icpNumber: process.env.NEXT_PUBLIC_ICP_NUMBER || undefined,
  socials: parseEnvJSON<SocialLink[]>(process.env.NEXT_PUBLIC_SOCIALS, []).filter(s => isSafeUrl(s.url)),
  interests: [
    "人机交互",
    "动作生成",
    "扩散模型",
    "美学界面",
  ],
  languages: [
    { name: "Python", level: 5 },
    { name: "JavaScript", level: 4 },
    { name: "TypeScript", level: 4 },
    { name: "C++", level: 3 },
  ],
  frameworksAndTools: [
    { name: "PyTorch", level: 5 },
    { name: "React", level: 4 },
    { name: "Next.js", level: 4 },
    { name: "Node.js", level: 3 },
    { name: "Git", level: 4 },
    { name: "LaTeX", level: 3 },
  ],
  stats: [
    { label: "研究方向", value: "3+", href: "#research" },
    { label: "开源项目", value: "5+", href: "#projects" },
    { label: "技术栈", value: "10+", href: "#skills" },
    { label: "论文阅读", value: "50+", href: "#papers" },
  ],
  researchDirections: [
    {
      title: "交互感知动作生成",
      description: "研究多人场景下的交互动作合成，让模型理解人与人之间的物理互动关系，生成自然协调的交互动作序列。",
      keywords: ["Human Interaction", "Motion Generation", "Physics-aware"],
    },
    {
      title: "文本驱动动作合成",
      description: "将自然语言描述映射为连续人体动作序列，探索语言与动作空间的对齐方法，实现细粒度的动作控制。",
      keywords: ["Text2Motion", "Language-Action Alignment", "Fine-grained Control"],
    },
    {
      title: "扩散模型与美学界面",
      description: "探索扩散模型在视觉生成中的应用，同时研究如何构建具有美学价值的人机交互界面。",
      keywords: ["Diffusion Models", "Aesthetic Interface", "Visual Generation"],
    },
  ],
  projects: [
    {
      title: "个人主页",
      description: "基于 Next.js 构建的个人主页，包含研究方向、技术栈、论文笔记等功能模块。",
      tags: ["Next.js", "TypeScript", "Tailwind"],
      url: "https://github.com/asydevf/homepage",
      status: "已完成" as const,
    },
    {
      title: "论文复现 — InterGen",
      description: "复现交互感知动作生成论文，学习扩散模型在动作合成中的应用。",
      tags: ["Diffusion", "Motion", "复现"],
      url: "https://github.com/asydevf",
      status: "进行中" as const,
    },
    {
      title: "更多项目待补充",
      description: "后续会在 GitHub 上开源更多研究相关代码和工具。",
      tags: ["Coming Soon"],
      url: "https://github.com/asydevf",
      status: "规划中" as const,
    },
  ],
  papers: [
    {
      title: "InterGen: Interaction-aware Human Motion Generation via Diffusion",
      authors: "Li et al.",
      venue: "ICCV 2023",
      highlight: "首次将交互感知引入扩散模型动作生成",
      url: "https://arxiv.org/abs/2304.12294",
    },
    {
      title: "MotionDiffuse: Text-Driven Human Motion Generation with Diffusion",
      authors: "Zhang et al.",
      venue: "arXiv 2022",
      highlight: "文本到动作的扩散模型 baseline",
      url: "https://arxiv.org/abs/2208.15001",
    },
    {
      title: "HumanMAC: Masked Motion Completion for Human Motion Prediction",
      authors: "Chen et al.",
      venue: "ICCV 2023",
      highlight: "基于掩码补全的动作预测范式",
      url: "https://arxiv.org/abs/2303.14937",
    },
  ],
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "",
  siteDomain: process.env.NEXT_PUBLIC_SITE_DOMAIN || "",
  imageHostname: process.env.NEXT_PUBLIC_IMAGE_HOSTNAME || "",
};

// 处理头像alt文本的模板变量替换
const rawAvatarAlt = process.env.NEXT_PUBLIC_PROFILE_AVATAR_ALT || "";
const processedAvatarAlt = rawAvatarAlt
  .replace(/\{name\}/g, baseProfile.name);

// 处理描述中的模板变量替换
const rawDescription = process.env.NEXT_PUBLIC_PROFILE_DESCRIPTION || "";
const processedDescription = rawDescription
  .replace(/\{location\}/g, baseProfile.location)
  .replace(/\{role\}/g, baseProfile.role);

export const profile: Profile = {
  ...baseProfile,
  description: processedDescription,
  avatarAlt: processedAvatarAlt,
};