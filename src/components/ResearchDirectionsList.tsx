"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import directions from "@/data/directions.json";

const RESEARCH_DEFAULT_COUNT = 3;

/**
 * 研究方向列表组件（默认显示前 3 个，可展开全部）
 */
export default function ResearchDirectionsList() {
  const [showAll, setShowAll] = useState(false);
  const all = directions as { title: string; emoji?: string; keywords?: string[]; content: string }[];
  const displayed = showAll ? all : all.slice(0, RESEARCH_DEFAULT_COUNT);
  const hasMore = all.length > RESEARCH_DEFAULT_COUNT;

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayed.map((dir, idx) => (
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
                {dir.emoji || "🔬"}
              </div>
              <h3 className="font-semibold text-zinc-800">{dir.title}</h3>
            </div>
            {dir.content && (
              <div
                className="text-sm text-zinc-600 leading-relaxed mb-4 [&_p]:mb-2"
                dangerouslySetInnerHTML={{ __html: dir.content }}
              />
            )}
            <div className="flex flex-wrap gap-1.5">
              {(dir.keywords || []).map((kw) => (
                <span key={kw} className="chip-ios px-2 py-0.5 text-[11px] text-zinc-600">
                  {kw}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-6"
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn-ios px-6 py-2.5 text-sm text-zinc-600 hover:text-zinc-800"
          >
            {showAll ? "收起" : `查看全部 ${all.length} 个方向`}
            <svg
              className={`w-3.5 h-3.5 transition-transform ${showAll ? "rotate-180" : ""}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </motion.div>
      )}
    </div>
  );
}
