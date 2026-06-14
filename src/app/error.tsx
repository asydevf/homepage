"use client";

/**
 * 全局错误边界
 * 当页面组件抛出未捕获异常时，显示此 UI 而非白屏
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">😵</div>
        <h2 className="text-xl font-semibold text-zinc-800 mb-2">
          页面出了点问题
        </h2>
        <p className="text-sm text-zinc-500 mb-6">
          {error.message || "发生了未知错误，请尝试刷新页面。"}
        </p>
        <button
          onClick={reset}
          className="btn-ios px-6 py-2.5 text-sm text-zinc-700 hover:text-zinc-900"
        >
          重新加载
        </button>
      </div>
    </div>
  );
}
