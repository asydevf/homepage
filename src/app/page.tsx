"use client";
import Image from "next/image";
import Link from "next/link";
import { profile, type SkillItem, type Update, type PaperContent } from "@/data/profile";
import updates from "@/data/updates.json";
import papersContent from "@/data/papers-content.json";
import projectsContent from "@/data/projects-content.json";
import skillsData from "@/data/skills.json";
import { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SocialIcon from "@/components/SocialIcon";
import MouseTrackingOrbs from "@/components/MouseTrackingOrbs";
import TypingText from "@/components/TypingText";
import SkillBar from "@/components/SkillBar";
import SectionTitle from "@/components/SectionTitle";
import ResearchDirectionsList from "@/components/ResearchDirectionsList";
import PapersList from "@/components/PapersList";

/**
 * Home 页面组件
 * 用途：渲染 QQHKX 个人主页，包括 Hero、关于、技术栈、项目与联系方式。
 * 返回：完整的主页 JSX 结构。
 */
export default function Home() {
  // 页面加载状态管理
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // 模拟页面资源加载完成
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // 项目数据从 JSON 读取，按研究方向分组
  type ProjectItem = { title: string; url: string; description: string; tags: string[]; status: string; direction?: string; content?: string };
  const projects = projectsContent as ProjectItem[];

  const dirEmoji: Record<string, string> = { "图像融合": "🔀", "人体交互生成": "🤸", "路径规划": "🗺️" };
  const projectGroups = useMemo(() => {
    const MAIN_DIRS = ["图像融合", "人体交互生成", "路径规划"];
    const dirMap = new Map<string, ProjectItem[]>();
    for (const d of MAIN_DIRS) dirMap.set(d, []);
    for (const p of projects) {
      const d = p.direction && MAIN_DIRS.includes(p.direction) ? p.direction : "__other__";
      if (!dirMap.has(d)) dirMap.set(d, []);
      dirMap.get(d)!.push(p);
    }
    const groups: { dir: string; items: ProjectItem[] }[] = [];
    for (const [dir, items] of dirMap) {
      groups.push({ dir, items });
    }
    // "其他" 放最后
    groups.sort((a, b) => (a.dir === "__other__" ? 1 : b.dir === "__other__" ? -1 : 0));
    return groups;
  }, [projects]);

  // 使用 useMemo 构造信息块，避免在 JSX 中直接书写复杂字面量
  const blocks = useMemo(
    () => [
      {
        title: "关于我",
        content: (
          <div>
            <p className="text-zinc-700 leading-7 mb-4">
              {profile.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="chip-ios px-3 py-1 text-xs text-purple-700"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full"
        >
          {/* 全页背景光球 */}
          <div className="pointer-events-none fixed inset-0 -z-10 opacity-80">
            <MouseTrackingOrbs />
          </div>

          {/* Hero 区域 — 不再撑满整屏 */}
          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative mx-auto max-w-6xl px-6 pt-28 pb-16 md:pt-36 md:pb-20 select-none"
          >
            {/* 主要内容区域 - 水平布局 */}
            <div className="w-full flex flex-col md:flex-row items-start gap-8">
              {/* 头像区域 */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: 0.2,
                  duration: 0.8,
                }}
                className="relative flex-shrink-0 size-32 md:size-40 rounded-full overflow-hidden ring-4 ring-pink-200/60 shadow-[0_20px_60px_-20px_rgba(180,120,255,0.35)]"
              >
                <Image
                  src={profile.avatar}
                  alt={profile.avatarAlt}
                  fill
                  sizes="(max-width: 768px) 128px, 160px"
                  className="object-cover"
                  priority
                />
              </motion.div>

              {/* 文字内容区域 */}
              <div className="flex-1 text-left">
                {/* 标题区域 */}
                <motion.h1
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.4,
                    duration: 0.9,
                    type: "spring",
                    stiffness: 80,
                    damping: 12,
                  }}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4"
                  style={{ letterSpacing: "0.1em" }}
                >
                  <span>{profile.siteName}</span>
                  <span
                    className="text-3xl md:text-4xl lg:text-5xl font-light"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {profile.siteDomain}
                  </span>
                </motion.h1>

                {/* 座右铭区域 */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.6,
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="mb-6"
                >
                  <p className="text-lg md:text-xl text-zinc-700 leading-relaxed">
                    <TypingText text={profile.motto} speed={120} delay={1500} />
                  </p>
                </motion.div>

                {/* 角色描述标签 */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.8,
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="flex flex-wrap items-center gap-3 mb-8 text-xs md:text-sm text-zinc-600"
                >
                  <span className="chip-ios px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-zinc-600">
                    {profile.role}
                  </span>
                  <span className="chip-ios px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-zinc-600">
                    {profile.location}
                  </span>
                  {profile.interests.slice(0, 2).map((interest) => (
                    <span
                      key={interest}
                      className="chip-ios px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-zinc-600"
                    >
                      {interest}
                    </span>
                  ))}
                </motion.div>

                {/* 社交链接 */}
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 1.0,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      },
                    },
                  }}
                  className="flex flex-wrap items-center gap-3"
                >
                  {profile.socials.map((s) => (
                    <motion.div
                      key={s.name}
                      variants={{
                        hidden: { opacity: 0, y: 15, scale: 0.9 },
                        show: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: {
                            type: "spring",
                            stiffness: 100,
                            damping: 15,
                          },
                        },
                      }}
                    >
                      <Link
                        href={s.url}
                        className="relative btn-ios-pill text-sm md:text-base lg:text-lg px-4 py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 group"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <SocialIcon
                          name={s.name}
                          size={20}
                          className="group-hover:scale-110 transition-transform duration-200"
                        />
                        <span className="hidden sm:inline">{s.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.section>

      {/* 数据统计条 — 可点击导航 */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {profile.stats.map((stat, idx) => (
            <motion.a
              key={stat.label}
              href={stat.href}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.97 }}
              className="relative card-skeu texture-spot p-5 text-center cursor-pointer group"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-pink-600 transition-all">
                {stat.value}
              </div>
              <div className="text-sm text-zinc-500 mt-1 group-hover:text-zinc-700 transition-colors">
                {stat.label}
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </section>

      {/* 关于我 */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        {blocks.map((block) => (
          <motion.div
            key={block.title}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative card-skeu texture-spot p-6"
          >
            <h2 className="text-xl font-semibold mb-3">{block.title}</h2>
            {block.content}
          </motion.div>
        ))}
      </section>

      {/* 研究方向 */}
      <section id="research" className="mx-auto max-w-6xl px-6 pb-16 scroll-mt-24">
        <SectionTitle title="研究方向" subtitle="图像融合、人体交互生成与路径规划" />
        <ResearchDirectionsList />
      </section>

      {/* 开源项目 */}
      <section id="projects" className="mx-auto max-w-6xl px-6 pb-16 scroll-mt-24">
        <SectionTitle title="开源项目" subtitle="研究过程中的代码实现与工具" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {projectGroups.map((group) => (
            <motion.div
              key={group.dir}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative card-skeu texture-spot p-6"
            >
              {/* 板块头部 */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.15))" }}
                >
                  {group.dir === "__other__" ? "📁" : (dirEmoji[group.dir] || "🔬")}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-800">
                    {group.dir === "__other__" ? "其他" : group.dir}
                  </h3>
                  <p className="text-xs text-zinc-400">{group.items.length} 个项目</p>
                </div>
              </div>

              {/* 项目列表 */}
              <div className="space-y-3">
                {group.items.map((project) => (
                  <Link
                    key={project.title}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-4 rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium text-zinc-800 text-sm leading-tight truncate group-hover:text-purple-600 transition-colors">
                        {project.title}
                      </h4>
                      <span
                        className={`flex-shrink-0 px-2 py-0.5 text-[10px] rounded-full border ${
                          project.status === "已完成"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                            : project.status === "进行中"
                            ? "bg-blue-50 border-blue-200 text-blue-600"
                            : "bg-zinc-50 border-zinc-200 text-zinc-500"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-xs leading-relaxed mb-2 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span key={tag} className="chip-ios px-2 py-0.5 text-[10px] text-zinc-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="text-center mt-10"
        >
          <Link
            href="https://github.com/asydevf"
            target="_blank"
                        rel="noopener noreferrer"
            className="btn-ios-tint px-8 py-4 text-base group"
          >
            <span className="text-zinc-800 font-medium">查看更多项目</span>
            <svg className="w-5 h-5 text-zinc-500 group-hover:text-zinc-700 group-hover:translate-x-1 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </section>

      {/* 技术栈 */}
      <section id="skills" className="mx-auto max-w-6xl px-6 pb-16 scroll-mt-24">
        <SectionTitle title="技术栈" subtitle="编程语言与常用框架工具" />
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative card-skeu texture-spot p-6"
          >
            <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">编程语言</h3>
            <div className="space-y-3">
              {(skillsData.languages as SkillItem[]).map((item) => (
                <SkillBar key={item.name} item={item} />
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="relative card-skeu texture-spot p-6"
          >
            <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">框架 & 工具</h3>
            <div className="space-y-3">
              {(skillsData.frameworks as SkillItem[]).map((item) => (
                <SkillBar key={item.name} item={item} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 论文阅读 */}
      <section id="papers" className="mx-auto max-w-6xl px-6 pb-16 scroll-mt-24">
        <SectionTitle title="论文阅读" subtitle="论文笔记、阅读进度与复现情况" />
        <PapersList papers={papersContent as PaperContent[]} />
      </section>

      {/* 研究日志 */}
      {updates.length > 0 && (
        <section id="updates" className="mx-auto max-w-6xl px-6 pb-20 scroll-mt-24">
          <SectionTitle title="研究日志" subtitle="项目进展、论文心得与日常收获" />
          <div className="space-y-6">
            {(updates as Update[]).map((entry, idx) => (
              <motion.div
                key={`${entry.date}-${entry.title}`}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.05 }}
                className="relative card-skeu texture-spot p-6"
              >
                {/* 顶部：日期 + 分类 + 状态 */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-xs font-mono text-zinc-400">{entry.date}</span>
                  <span className="px-2 py-0.5 text-[11px] rounded-full bg-purple-100/60 border border-purple-200/40 text-purple-600">
                    {entry.category}
                  </span>
                  {entry.status && (
                    <span className={`px-2 py-0.5 text-[11px] rounded-full border ${
                      entry.status === "已完成"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                        : entry.status === "进行中"
                        ? "bg-blue-50 border-blue-200 text-blue-600"
                        : "bg-zinc-50 border-zinc-200 text-zinc-500"
                    }`}>
                      {entry.status}
                    </span>
                  )}
                  <div className="flex flex-wrap gap-1.5 ml-auto">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="chip-ios px-2 py-0.5 text-[10px] text-zinc-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {/* 标题 */}
                <h3 className="text-lg font-semibold text-zinc-800 mb-3">{entry.title}</h3>
                {/* 正文（markdown 渲染的 HTML） */}
                <div
                  className="prose prose-sm prose-zinc max-w-none text-zinc-600 leading-relaxed
                    [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-zinc-700 [&_h2]:mt-4 [&_h2]:mb-2
                    [&_h3]:text-sm [&_h3]:font-medium [&_h3]:text-zinc-700 [&_h3]:mt-3 [&_h3]:mb-1.5
                    [&_p]:mb-3 [&_p]:text-sm
                    [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:space-y-1
                    [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_ol]:space-y-1
                    [&_li]:text-sm
                    [&_code]:text-xs [&_code]:bg-purple-50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
                    [&_blockquote]:border-l-2 [&_blockquote]:border-purple-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-zinc-500"
                  dangerouslySetInnerHTML={{ __html: entry.content }}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 联系方式/页脚 */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-zinc-600">
          {/* 主要页脚内容 */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div>
                © {new Date().getFullYear()} {profile.name}. All rights reserved.
              </div>
              {profile.icpNumber && (
                <div className="text-xs text-white/50">
                  <Link 
                    href="https://beian.miit.gov.cn/" 
                    target="_blank"
                        rel="noopener noreferrer" 
                    className="hover:text-zinc-600 transition-colors duration-200"
                  >
                    {profile.icpNumber}
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {profile.socials.map((s) => (
                <Link key={s.name} href={s.url} className="hover:text-white hover:scale-110 transition-all duration-200" target="_blank"
                        rel="noopener noreferrer">
                  <SocialIcon 
                    name={s.name} 
                    size={18} 
                    className="opacity-70 hover:opacity-100 transition-opacity duration-200" 
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
        </motion.main>
      )}
    </AnimatePresence>
  );
}
