"use client";

import type { SkillItem } from "@/data/profile";

/**
 * 技能熟练度进度条组件
 * @param item - 技能项，包含名称和熟练度
 */
export default function SkillBar({ item }: { item: SkillItem }) {
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
