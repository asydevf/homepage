/**
 * 全局加载状态
 * 在页面数据加载期间显示骨架屏
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* iOS 风格加载指示器 */}
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-zinc-200" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-400 animate-spin" />
        </div>
        <p className="text-sm text-zinc-400">加载中…</p>
      </div>
    </div>
  );
}
