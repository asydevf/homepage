"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * 打字机效果组件
 * @param text - 要显示的文本
 * @param speed - 打字速度（毫秒）
 * @param delay - 开始打字前的延迟时间（毫秒）
 */
export default function TypingText({ text, speed = 80, delay = 0 }: { text: string; speed?: number; delay?: number }) {
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
