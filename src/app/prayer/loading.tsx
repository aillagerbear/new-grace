import { ArrowLeft, Plus, Filter } from "lucide-react";
import Link from "next/link";

export default function PrayerLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-semibold">기도 요청</h1>
          </div>
          <Link
            href="/prayer/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">기도 요청하기</span>
          </Link>
        </div>
      </header>

      {/* Category Filter Skeleton */}
      <div className="sticky top-[65px] z-40 bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-8 w-16 bg-secondary rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Prayer List Skeleton */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-card rounded-2xl border border-border p-5 animate-pulse"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-6 w-20 bg-secondary rounded-full" />
                <div className="h-4 w-16 bg-secondary rounded" />
              </div>
              <div className="h-5 w-3/4 bg-secondary rounded mb-2" />
              <div className="space-y-2 mb-4">
                <div className="h-4 w-full bg-secondary rounded" />
                <div className="h-4 w-2/3 bg-secondary rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-4 w-16 bg-secondary rounded" />
                <div className="h-4 w-24 bg-secondary rounded" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
