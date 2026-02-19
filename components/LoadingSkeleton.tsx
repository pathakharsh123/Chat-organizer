export default function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-paper-soft rounded-xl border-l-4 border-ink/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-ink/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full shimmer" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-32 rounded shimmer" />
              <div className="h-3 w-16 rounded shimmer" />
            </div>
          </div>
          <div className="px-5 py-4 space-y-3">
            {[...Array(2)].map((_, j) => (
              <div key={j} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-ink/10 mt-2 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-12 rounded shimmer" />
                  <div className="h-3 w-full rounded shimmer" />
                  <div className="h-3 w-3/4 rounded shimmer" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
