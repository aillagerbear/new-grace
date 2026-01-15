export default function SidebarRightSkeleton() {
  return (
    <aside className="w-[320px] shrink-0 hidden xl:block space-y-6">
      {/* Community Stats Skeleton */}
      <div className="bg-card rounded-2xl border border-border p-5 shadow-sm animate-pulse">
        <div className="h-5 bg-secondary rounded w-1/2 mb-4" />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-secondary rounded w-1/3" />
            <div className="h-4 bg-secondary rounded w-1/4" />
          </div>
        </div>
      </div>

      {/* Categories Skeleton */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm animate-pulse">
        <div className="h-14 bg-secondary/30" />
        <div className="p-4 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-8 w-16 bg-secondary rounded-full" />
          ))}
        </div>
      </div>

      {/* Notice Skeleton */}
      <div className="bg-primary/5 rounded-2xl border border-primary/10 p-5 animate-pulse">
        <div className="h-4 bg-primary/20 rounded w-1/3 mb-2" />
        <div className="space-y-2">
          <div className="h-3 bg-primary/10 rounded w-full" />
          <div className="h-3 bg-primary/10 rounded w-2/3" />
        </div>
      </div>
    </aside>
  );
}
