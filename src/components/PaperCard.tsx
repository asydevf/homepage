"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HighlightText } from "@/components/SearchInput";
import type { PaperContent } from "@/data/profile";

// 状态对应的圆点颜色
const STATUS_DOT: Record<string, string> = {
  "已复现": "bg-emerald-400",
  "复现中": "bg-blue-400",
  "已读": "bg-purple-400",
  "阅读中": "bg-amber-400",
  "待读": "bg-zinc-300",
};

/**
 * 论文卡片组件（精简版）
 * 紧凑单行布局，点击展开详情
 */
export default function PaperCard({ paper, idx, searchQuery = "" }: { paper: PaperContent; idx: number; searchQuery?: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: idx * 0.05 }}
      className="group"
    >
      {/* 可点击行 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/30 transition-colors flex items-start gap-2.5"
      >
        {/* 状态圆点 */}
        <span className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 ${STATUS_DOT[paper.status || "待读"] || "bg-zinc-300"}`} />

        {/* 内容区 */}
        <div className="flex-1 min-w-0">
          {/* 标题 */}
          <h4 className="text-sm font-medium text-zinc-800 leading-snug truncate">
            <HighlightText text={paper.title} query={searchQuery} />
          </h4>
          {/* 元信息行：会议 · 作者 · 进度 */}
          <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
            {paper.venue && (
              <span className="font-mono">
                <HighlightText text={paper.venue} query={searchQuery} />
              </span>
            )}
            {paper.venue && paper.authors && <span className="mx-1">·</span>}
            {paper.authors && (
              <span>
                <HighlightText text={paper.authors} query={searchQuery} />
              </span>
            )}
            {paper.progress !== undefined && paper.progress > 0 && (
              <>
                <span className="mx-1">·</span>
                <span className="text-purple-400">{paper.progress}%</span>
              </>
            )}
          </p>
        </div>

        {/* 展开箭头 */}
        <svg
          className={`flex-shrink-0 w-3.5 h-3.5 text-zinc-300 transition-transform duration-200 mt-1.5 ${expanded ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* 展开详情 */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1 ml-[18px]">
              {/* 标签 */}
              {paper.tags && paper.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {paper.tags.map((tag) => (
                    <span key={tag} className="chip-ios px-2 py-0.5 text-[10px] text-zinc-500">
                      <HighlightText text={tag} query={searchQuery} />
                    </span>
                  ))}
                </div>
              )}

              {/* 进度条 */}
              {paper.progress !== undefined && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-1 bg-zinc-200/60 rounded-full overflow-hidden max-w-40">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                      style={{ width: `${paper.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400">{paper.progress}%</span>
                </div>
              )}

              {/* 链接 */}
              <div className="flex flex-wrap gap-3 mb-3">
                {paper.repo && paper.repo !== "" && (
                  <Link href={paper.repo} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-purple-500 hover:text-purple-700 transition-colors">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                    </svg>
                    代码
                  </Link>
                )}
                {paper.arxiv && (
                  <Link href={paper.arxiv} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 transition-colors">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    arXiv
                  </Link>
                )}
                {!paper.arxiv && paper.doi && (
                  <Link href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 transition-colors">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    DOI
                  </Link>
                )}
              </div>

              {/* 笔记正文 */}
              {paper.content && (
                <div
                  className="prose prose-sm prose-zinc max-w-none text-zinc-600 leading-relaxed
                    [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:text-zinc-700 [&_h2]:mt-3 [&_h2]:mb-1.5
                    [&_h3]:text-xs [&_h3]:font-medium [&_h3]:text-zinc-700 [&_h3]:mt-2 [&_h3]:mb-1
                    [&_p]:mb-2 [&_p]:text-xs
                    [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-2 [&_ul]:space-y-0.5
                    [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:mb-2 [&_ol]:space-y-0.5
                    [&_li]:text-xs
                    [&_code]:text-[10px] [&_code]:bg-purple-50 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded
                    [&_blockquote]:border-l-2 [&_blockquote]:border-purple-300 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-zinc-500"
                  dangerouslySetInnerHTML={{ __html: paper.content }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
