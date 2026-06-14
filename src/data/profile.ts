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
  /** DOI */
  doi?: string;
  /** 论文链接（非 arXiv 时使用） */
  url?: string;
  /** 分类 */
  category?: string;
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
  /** 关键统计数据（可点击导航） */
  stats: StatItem[];
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
// 注意：skills、projects、papers、directions 数据统一由 content/ 下的 markdown 文件管理
// 通过 npm run build 时 scripts/build-updates.js 自动构建为 JSON，无需在此硬编码
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
  stats: [
    { label: "研究方向", value: "3+", href: "#research" },
    { label: "开源项目", value: "5+", href: "#projects" },
    { label: "技术栈", value: "10+", href: "#skills" },
    { label: "论文阅读", value: "50+", href: "#papers" },
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