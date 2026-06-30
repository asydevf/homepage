"use client";

import { motion } from "framer-motion";

/**
 * 通用板块标题组件
 * @param title - 主标题
 * @param subtitle - 副标题描述
 */
export default function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
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
