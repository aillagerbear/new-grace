import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, HandHeart, Clock } from "lucide-react";
import pool, { ensurePrayerTable } from "@/lib/db";
import { getSessionWithRole } from "@/lib/auth-helpers";
import PrayerFilter from "@/components/prayer/prayer-filter";
import PrayerPagination from "@/components/prayer/prayer-pagination";

interface Prayer {
  id: string;
  type: string;
  title: string;
  content: string;
  category: string;
  visibility: "public" | "pastor_only";
  isAnonymous: boolean;
  authorName: string;
  prayerCount: number;
  isAnswered: boolean;
  createdAt: string;
  isMine: boolean;
}

interface PrayerListResult {
  prayers: Prayer[];
  pagination: {
    page: number;
    totalPages: number;
  };
}

const categories: Record<string, { label: string; emoji: string }> = {
  health: { label: "건강", emoji: "🏥" },
  family: { label: "가정", emoji: "👨‍👩‍👧‍👦" },
  work: { label: "직장", emoji: "💼" },
  study: { label: "학업", emoji: "📚" },
  general: { label: "일반", emoji: "🙏" },
  etc: { label: "기타", emoji: "✨" },
};

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

async function getPrayers(category?: string, page: number = 1): Promise<PrayerListResult> {
  try {
    await ensurePrayerTable();
    const client = await pool.connect();
    const session = await getSessionWithRole();
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
      const whereConditions: string[] = [];
      const params: (string | number)[] = [];
      let paramIndex = 1;

      if (!session?.user?.id) {
        whereConditions.push(`visibility = 'public'`);
      } else if (session.user.role === "pastor" || session.user.role === "admin") {
        whereConditions.push(`visibility IN ('public', 'pastor_only')`);
      } else {
        whereConditions.push(
          `(visibility = 'public' OR (visibility = 'pastor_only' AND "authorId" = $${paramIndex}))`
        );
        params.push(session.user.id);
        paramIndex++;
      }

      if (category) {
        whereConditions.push(`category = $${paramIndex}`);
        params.push(category);
        paramIndex++;
      }

      const whereClause =
        whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

      // Count total
      const countResult = await client.query(
        `SELECT COUNT(*) FROM prayer ${whereClause}`,
        params
      );
      const total = parseInt(countResult.rows[0].count);

      // Get list
      params.push(limit, offset);
      const listResult = await client.query(
        `SELECT id, type, title, content, category, visibility, "isAnonymous", "authorName", "authorId", "prayerCount", "isAnswered", "createdAt"
         FROM prayer
         ${whereClause}
         ORDER BY "createdAt" DESC
         LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
        params
      );

      return {
        prayers: listResult.rows.map((row) => ({
          id: row.id,
          type: row.type,
          title: row.title,
          content: row.content,
          category: row.category,
          visibility: row.visibility,
          isAnonymous: row.isAnonymous,
          authorName: row.isAnonymous ? "익명" : row.authorName,
          prayerCount: row.prayerCount,
          isAnswered: row.isAnswered,
          createdAt: row.createdAt,
          isMine: session?.user?.id ? row.authorId === session.user.id : false,
        })),
        pagination: {
          page,
          totalPages: Math.ceil(total / limit),
        },
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching prayers:", error);
    return { prayers: [], pagination: { page: 1, totalPages: 1 } };
  }
}

function getCategoryInfo(cat: string) {
  return categories[cat] || { label: cat, emoji: "🙏" };
}

// Prayer List Component (Server)
async function PrayerList({ category, page }: { category?: string; page: number }) {
  const { prayers, pagination } = await getPrayers(category, page);

  if (prayers.length === 0) {
    return (
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
    );
  }

  return (
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
                {prayer.visibility === "pastor_only" && (
                  <span className="text-xs px-2 py-0.5 bg-indigo-500/10 text-indigo-600 rounded-full">
                    목사님 전용
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
              <Link href={`/prayer/${prayer.id}`} className="hover:text-primary transition-colors">
                {prayer.title}
              </Link>
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

      <Suspense fallback={null}>
        <PrayerPagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
        />
      </Suspense>
    </div>
  );
}

// Loading skeleton for the list
function PrayerListSkeleton() {
  return (
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
  );
}

// Main Page Component (Server)
export default async function PrayerListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const page = parseInt(params.page || "1");

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

      {/* Category Filter (Client Component with Suspense) */}
      <Suspense fallback={
        <div className="sticky top-[65px] z-40 bg-card border-b border-border">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-8 w-16 bg-secondary rounded-full animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      }>
        <PrayerFilter />
      </Suspense>

      {/* Prayer List (Server Component with Suspense) */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        <Suspense fallback={<PrayerListSkeleton />}>
          <PrayerList category={category} page={page} />
        </Suspense>
      </main>
    </div>
  );
}
