"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import SearchInput from "@/components/SearchInput";
import PaperCard from "@/components/PaperCard";
import type { PaperContent } from "@/data/profile";

// 研究方向配置
const DIRECTIONS = [
  { name: "图像融合", emoji: "🔀", color: "from-blue-400 to-cyan-400" },
  { name: "人体交互生成", emoji: "🤸", color: "from-purple-400 to-pink-400" },
  { name: "路径规划", emoji: "🗺️", color: "from-emerald-400 to-teal-400" },
] as const;

const DEFAULT_SHOW = 3;

// 活跃状态（排在前面）
const ACTIVE_STATUSES = ["复现中", "阅读中", "进行中", "已复现", "已读"];

/**
 * 判断论文是否为活跃状态
 */
function isActive(paper: PaperContent): boolean {
  return ACTIVE_STATUSES.includes(paper.status || "");
}

/**
 * 论文方向板块组件
 * 每个方向：标题 + 标签筛选 + 折叠论文列表
 */
function DirectionSection({
  dir,
  papers,
  searchQuery,
}: {
  dir: (typeof DIRECTIONS)[number];
  papers: PaperContent[];
  searchQuery: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // 提取本方向的所有标签
  const tags = useMemo(() => {
    const set = new Set<string>();
    papers.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [papers]);

  // 按标签筛选
  const tagFiltered = useMemo(() => {
    if (!activeTag) return papers;
    return papers.filter((p) => (p.tags || []).includes(activeTag));
  }, [papers, activeTag]);

  // 排序：活跃的在前，其余在后
  const sorted = useMemo(() => {
    return [...tagFiltered].sort((a, b) => {
      const aActive = isActive(a) ? 0 : 1;
      const bActive = isActive(b) ? 0 : 1;
      return aActive - bActive;
    });
  }, [tagFiltered]);

  const displayed = showAll ? sorted : sorted.slice(0, DEFAULT_SHOW);
  const hasMore = sorted.length > DEFAULT_SHOW;
  const activeCount = papers.filter(isActive).length;

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative card-skeu texture-spot p-6"
    >
      {/* 板块头部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${dir.color} bg-opacity-20 flex items-center justify-center text-xl`}
            style={{ background: `linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.15))` }}
          >
            {dir.emoji}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-800">{dir.name}</h3>
            <p className="text-xs text-zinc-400">
              {papers.length} 篇论文
              {activeCount > 0 && (
                <span className="ml-2 text-purple-500">· {activeCount} 篇进行中</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 标签筛选 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setActiveTag(null)}
            className={`chip-ios px-2.5 py-1 text-[11px] transition-colors ${
              !activeTag
                ? "bg-purple-100/60 border-purple-200/60 text-purple-700"
                : "text-zinc-400"
            }`}
          >
            全部
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`chip-ios px-2.5 py-1 text-[11px] transition-colors ${
                activeTag === tag
                  ? "bg-purple-100/60 border-purple-200/60 text-purple-700"
                  : "text-zinc-400"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* 论文列表 */}
      <div className="space-y-3">
        {displayed.map((paper, idx) => (
          <PaperCard
            key={paper.title}
            paper={paper}
            idx={idx}
            searchQuery={searchQuery}
          />
        ))}
      </div>

      {/* 展开/收起按钮 */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-4 pt-4 border-t border-white/10"
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn-ios px-5 py-2 text-xs text-zinc-500 hover:text-zinc-700"
          >
            {showAll ? "收起" : `查看全部 ${sorted.length} 篇`}
            <svg
              className={`w-3 h-3 ml-1 transition-transform ${showAll ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </motion.div>
      )}

      {/* 空状态 */}
      {sorted.length === 0 && (
        <p className="text-center text-zinc-400 text-sm py-6">暂无匹配的论文</p>
      )}
    </motion.div>
  );
}

/**
 * 论文列表组件（按方向分板块，每个板块可折叠）
 * @param papers - 论文数据数组
 */
export default function PapersList({ papers }: { papers: PaperContent[] }) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 搜索过滤函数
  const matchesSearch = useCallback(
    (paper: PaperContent, query: string): boolean => {
      if (!query) return true;
      const q = query.toLowerCase();
      if (paper.title?.toLowerCase().includes(q)) return true;
      if (paper.authors?.toLowerCase().includes(q)) return true;
      if (paper.venue?.toLowerCase().includes(q)) return true;
      if (paper.direction?.toLowerCase().includes(q)) return true;
      if (paper.tags?.some((t) => t.toLowerCase().includes(q))) return true;
      if (paper.content) {
        const text = paper.content.replace(/<[^>]*>/g, "");
        if (text.toLowerCase().includes(q)) return true;
      }
      return false;
    },
    []
  );

  // 按方向分组（搜索后）
  const grouped = useMemo(() => {
    const filtered = papers.filter((p) => matchesSearch(p, searchQuery));
    return DIRECTIONS.map((dir) => ({
      dir,
      papers: filtered.filter((p) => p.direction === dir.name),
    })).filter((g) => g.papers.length > 0);
  }, [papers, searchQuery, matchesSearch]);

  // 不属于任何方向的论文
  const ungrouped = useMemo(() => {
    const dirNames = new Set<string>(DIRECTIONS.map((d) => d.name));
    return papers
      .filter((p) => !dirNames.has(p.direction || ""))
      .filter((p) => matchesSearch(p, searchQuery));
  }, [papers, searchQuery, matchesSearch]);

  const totalCount = papers.length;
  const filteredCount = grouped.reduce((s, g) => s + g.papers.length, 0) + ungrouped.length;

  return (
    <div>
      {/* 全局搜索 */}
      <SearchInput
        resultCount={filteredCount}
        totalCount={totalCount}
        onSearch={setSearchQuery}
      />

      {/* 按方向分板块（横向并排） */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {grouped.map(({ dir, papers: dirPapers }) => (
          <DirectionSection
            key={dir.name}
            dir={dir}
            papers={dirPapers}
            searchQuery={searchQuery}
          />
        ))}
      </div>

      {/* 不属于任何方向的论文 */}
      {ungrouped.length > 0 && (
        <div className="mt-6">
          <div className="space-y-3">
            {ungrouped.map((paper, idx) => (
              <PaperCard
                key={paper.title}
                paper={paper}
                idx={idx}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        </div>
      )}

      {/* 全局空状态 */}
      {filteredCount === 0 && (
        <p className="text-center text-zinc-400 text-sm py-8">
          没有匹配的论文
        </p>
      )}
    </div>
  );
}
