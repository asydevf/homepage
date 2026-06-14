"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchInputProps {
  /** 搜索结果数量 */
  resultCount: number;
  /** 总数量 */
  totalCount: number;
  /** 搜索值变化回调 */
  onSearch: (query: string) => void;
  /** 占位符文本 */
  placeholder?: string;
}

/**
 * 搜索输入组件
 * 支持实时搜索和结果计数显示
 */
export default function SearchInput({
  resultCount,
  totalCount,
  onSearch,
  placeholder = "搜索论文标题、作者、笔记内容...",
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      onSearch(value);
    },
    [onSearch]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    onSearch("");
  }, [onSearch]);

  const isSearching = query.length > 0;

  return (
    <div className="relative mb-6">
      {/* 搜索输入框 */}
      <div
        className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300 ${
          isFocused
            ? "border-purple-300/60 bg-white/80 shadow-[0_4px_20px_-4px_rgba(180,120,255,0.15)]"
            : "border-white/20 bg-white/50 hover:bg-white/70"
        }`}
      >
        {/* 搜索图标 */}
        <svg
          className={`w-5 h-5 flex-shrink-0 transition-colors ${
            isFocused ? "text-purple-500" : "text-zinc-400"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>

        {/* 输入框 */}
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-zinc-800 placeholder:text-zinc-400 outline-none"
        />

        {/* 清除按钮 */}
        <AnimatePresence>
          {isSearching && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="flex-shrink-0 p-1 rounded-full hover:bg-zinc-100 transition-colors"
            >
              <svg
                className="w-4 h-4 text-zinc-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* 搜索结果统计 */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 -bottom-6 text-xs text-zinc-400"
          >
            找到 {resultCount} / {totalCount} 篇论文
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * 高亮搜索关键词
 * @param text - 原始文本
 * @param query - 搜索关键词
 * @returns 高亮后的 JSX
 */
export function HighlightText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  if (!query || !text) return <>{text}</>;

  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, "gi"));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={index}
            className="bg-yellow-200/60 text-zinc-800 rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

/**
 * 转义正则表达式特殊字符
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
