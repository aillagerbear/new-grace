"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, HandHeart, Clock, Filter } from "lucide-react";

interface Prayer {
  id: string;
  type: string;
  title: string;
  content: string;
  category: string;
  isAnonymous: boolean;
  authorName: string;
  prayerCount: number;
  isAnswered: boolean;
  createdAt: string;
}

const categories = [
  { value: "", label: "전체" },
  { value: "health", label: "건강", emoji: "🏥" },
  { value: "family", label: "가정", emoji: "👨‍👩‍👧‍👦" },
  { value: "work", label: "직장", emoji: "💼" },
  { value: "study", label: "학업", emoji: "📚" },
  { value: "general", label: "일반", emoji: "🙏" },
  { value: "etc", label: "기타", emoji: "✨" },
];

function formatTimeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString("ko-KR");
}

export default function PrayerListPage() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPrayers();
  }, [category, page]);

  const fetchPrayers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "10" });
      if (category) params.set("category", category);

      const res = await fetch(`/api/prayer?${params}`);
      const data = await res.json();

      if (res.ok) {
        setPrayers(data.prayers);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching prayers:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryInfo = (cat: string) => {
    return categories.find((c) => c.value === cat) || { label: cat, emoji: "🙏" };
  };

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

      {/* Category Filter */}
      <div className="sticky top-[65px] z-40 bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setCategory(cat.value);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                  category === cat.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
              >
                {cat.emoji && <span className="mr-1">{cat.emoji}</span>}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prayer List */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : prayers.length === 0 ? (
          <div className="text-center py-12">
            <HandHeart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">아직 기도 요청이 없습니다</p>
            <Link
              href="/prayer/new"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              첫 기도 요청 올리기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {prayers.map((prayer) => {
              const catInfo = getCategoryInfo(prayer.category);
              return (
                <article
                  key={prayer.id}
                  className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm px-2 py-0.5 bg-secondary rounded-full">
                        {catInfo.emoji} {catInfo.label}
                      </span>
                      {prayer.isAnswered && (
                        <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-full">
                          ✓ 응답됨
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(prayer.createdAt)}
                    </div>
                  </div>

                  {/* Content */}
                  <h2 className="text-[15px] font-semibold text-foreground mb-2">
                    {prayer.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {prayer.content}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {prayer.authorName || "익명"}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-primary">
                      <HandHeart className="w-4 h-4" />
                      <span>{prayer.prayerCount}명 기도 중</span>
                    </div>
                  </div>
                </article>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>
                <span className="px-4 py-2 text-sm text-muted-foreground">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
