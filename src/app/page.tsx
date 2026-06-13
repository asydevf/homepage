"use client";
import Image from "next/image";
import Link from "next/link";
import { profile, type SkillItem } from "@/data/profile";
import { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SocialIcon from "@/components/SocialIcon";
import MouseTrackingOrbs from "@/components/MouseTrackingOrbs";

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

  // 项目数据直接使用，不再分组
  const projects = profile.projects;

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
                  className="px-3 py-1 rounded-full text-xs bg-gradient-to-r from-purple-100/60 to-pink-100/60 border border-purple-200/40 text-purple-700"
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
                  <span className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/40 backdrop-blur-sm border border-white/50 hover:bg-white/60 transition-colors">
                    {profile.role}
                  </span>
                  <span className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/40 backdrop-blur-sm border border-white/50 hover:bg-white/60 transition-colors">
                    {profile.location}
                  </span>
                  {profile.interests.slice(0, 2).map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/40 backdrop-blur-sm border border-white/50 hover:bg-white/60 transition-colors"
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
                        className="relative card-skeu texture-spot flex items-center gap-2 text-sm md:text-base lg:text-lg px-4 py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-[20px] hover:opacity-95 transition group"
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
        <SectionTitle title="研究方向" subtitle="探索人机交互、动作生成与扩散模型的交叉领域" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {profile.researchDirections.map((dir, idx) => (
            <motion.div
              key={dir.title}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: "spring", stiffness: 120, damping: 20, delay: idx * 0.1 }}
              className="relative card-skeu texture-spot p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-lg">
                  {["🔬", "✍️", "🎨"][idx]}
                </div>
                <h3 className="font-semibold text-zinc-800">{dir.title}</h3>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed mb-4">{dir.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {dir.keywords.map((kw) => (
                  <span key={kw} className="px-2 py-0.5 text-[11px] rounded-full bg-white/40 border border-white/50 text-zinc-600">
                    {kw}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 开源项目 */}
      <section id="projects" className="mx-auto max-w-6xl px-6 pb-16 scroll-mt-24">
        <SectionTitle title="开源项目" subtitle="研究过程中的代码实现与工具" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={project.title}
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              whileInView={{ scale: 1, opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 20,
                delay: idx * 0.1,
              }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="group relative card-skeu texture-spot p-6 overflow-hidden border border-white/10 hover:border-white/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <Link href={project.url} className="block" target="_blank"
                        rel="noopener noreferrer">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <h3 className="font-semibold text-zinc-800 group-hover:text-white transition-colors duration-200 text-lg leading-tight truncate">
                        {project.title}
                      </h3>
                      <span
                        className={`flex-shrink-0 px-2 py-0.5 text-[10px] font-medium rounded-full border ${
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
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-white/40 group-hover:bg-white/60 flex items-center justify-center transition-colors duration-200">
                        <svg className="w-4 h-4 text-zinc-500 group-hover:text-zinc-700 transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 17L17 7" />
                          <path d="M8 7h9v9" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-zinc-600 text-sm leading-relaxed mb-4 group-hover:text-zinc-700 transition-colors duration-200">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 text-xs rounded-full bg-white/40 border border-white/50 text-zinc-700 backdrop-blur-sm transition-all duration-200 hover:bg-white/15 hover:border-white/30 hover:text-zinc-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-zinc-400 group-hover:text-white/50 transition-colors duration-200">
                    研究笔记 · 论文复现
                  </div>
                </Link>
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
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/50 backdrop-blur-sm hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/30 transition-all duration-300 group"
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
              {profile.languages.map((item) => (
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
              {profile.frameworksAndTools.map((item) => (
                <SkillBar key={item.name} item={item} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 论文阅读 */}
      <section id="papers" className="mx-auto max-w-6xl px-6 pb-20 scroll-mt-24">
        <SectionTitle title="论文阅读" subtitle="近期关注的代表性论文" />
        <div className="space-y-4">
          {profile.papers.map((paper, idx) => (
            <motion.div
              key={paper.title}
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.08 }}
            >
              <Link
                href={paper.url}
                target="_blank"
                        rel="noopener noreferrer"
                className="group block relative card-skeu texture-spot p-5 hover:border-white/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/15 to-pink-500/15 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-zinc-800 group-hover:text-purple-700 transition-colors truncate">
                        {paper.title}
                      </h3>
                      <span className="flex-shrink-0 text-xs text-zinc-400 font-mono">{paper.venue}</span>
                    </div>
                    <p className="text-xs text-zinc-500 mb-2">{paper.authors}</p>
                    <p className="text-sm text-zinc-600 leading-relaxed">{paper.highlight}</p>
                  </div>
                  <svg className="flex-shrink-0 w-4 h-4 text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-1 transition-all mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

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

/**
 * 打字机效果组件
 * @param text - 要显示的文本
 * @param speed - 打字速度（毫秒）
 * @param delay - 开始打字前的延迟时间（毫秒）
 */
function TypingText({ text, speed = 80, delay = 0 }: { text: string; speed?: number; delay?: number }) {
  const [index, setIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [started, setStarted] = useState(false);
  
  // 处理初始延迟
  useEffect(() => {
    if (delay > 0) {
      const startTimer = setTimeout(() => {
        setStarted(true);
      }, delay);
      return () => clearTimeout(startTimer);
    } else {
      setStarted(true);
    }
  }, [delay]);
  
  useEffect(() => {
    if (!started || index >= text.length) return;
    
    // 检查当前字符是否为逗号，如果是则增加停顿时间
     const currentChar = text[index - 1];
     const isComma = currentChar === '，' || currentChar === ',';
     const typingDelay = isComma ? speed * 5 : speed; // 逗号处停顿5倍时间
    
    const timer = setTimeout(() => {
      setIndex((i) => (i < text.length ? i + 1 : i));
    }, typingDelay);
    
    return () => clearTimeout(timer);
  }, [started, index, text, speed]);

  // 光标闪烁效果
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <span aria-label={text} aria-live="polite" className="relative">
      {text.slice(0, index)}
      <motion.span
        animate={{ opacity: showCursor ? 1 : 0 }}
        transition={{ duration: 0.1 }}
        className="inline-block w-0.5 h-5 bg-white/70 ml-0.5 align-middle"
      />
    </span>
  );
}

/**
 * 技能熟练度进度条组件
 * @param item - 技能项，包含名称和熟练度
 */
function SkillBar({ item }: { item: SkillItem }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-zinc-700 w-20 flex-shrink-0">{item.name}</span>
      <div className="flex-1 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < item.level
                ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                : 'bg-zinc-200/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * 通用板块标题组件
 * @param title - 主标题
 * @param subtitle - 副标题描述
 */
function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-8"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {title}
      </h2>
      <p className="text-zinc-500 text-sm md:text-base">{subtitle}</p>
    </motion.div>
  );
}
