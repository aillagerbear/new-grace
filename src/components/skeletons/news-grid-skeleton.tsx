export default function NewsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm animate-pulse"
        >
          <div className="h-14 bg-secondary/30" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-secondary rounded w-3/4" />
            <div className="h-4 bg-secondary rounded w-1/2" />
            <div className="h-4 bg-secondary rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
