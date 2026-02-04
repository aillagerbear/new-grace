import { cache } from 'react';
import Link from 'next/link';
import { HandHeart, TrendingUp, Sparkles } from 'lucide-react';
import pool, { ensurePrayerTable } from '@/lib/db';

interface Prayer {
  id: string;
  title: string;
  authorName: string;
  prayerCount: number;
  isAnswered: boolean;
  createdAt: string;
}

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

// server-cache-react: React.cache()로 요청 당 중복 호출 방지
const getRecentPrayers = cache(async function getRecentPrayers(): Promise<Prayer[]> {
  try {
    await ensurePrayerTable();
    const client = await pool.connect();

    try {
      const result = await client.query(`
        SELECT id, title, is_anonymous, author_name, prayer_count, is_answered, created_at
        FROM prayer
        WHERE visibility = 'public'
        ORDER BY created_at DESC
        LIMIT 6
      `);

      return result.rows.map((row) => ({
        id: row.id,
        title: row.title,
        authorName: row.is_anonymous ? "익명" : (row.author_name || "익명"),
        prayerCount: row.prayer_count,
        isAnswered: row.is_answered,
        createdAt: row.created_at,
      }));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching prayers:', error);
    return [];
  }
});

/**
 * NewsGrid component - Prayer Community Platform (Server Component)
 */
export default async function NewsGrid() {
  const recentPrayers = await getRecentPrayers();

  // 최신순, 기도 많은 순, 응답받은 기도로 분류
  const latestPrayers = recentPrayers.slice(0, 3);
  const popularPrayers = [...recentPrayers].sort((a, b) => b.prayerCount - a.prayerCount).slice(0, 3);
  const answeredPrayers = recentPrayers.filter(p => p.isAnswered).slice(0, 3);

  const sections = [
    {
      title: "최신 기도 요청",
      icon: HandHeart,
      items: latestPrayers.map(p => ({
        id: p.id,
        title: p.title,
        author: p.authorName,
        prayers: p.prayerCount,
        time: formatTimeAgo(p.createdAt),
      }))
    },
    {
      title: "많은 분이 기도 중",
      icon: TrendingUp,
      items: popularPrayers.map(p => ({
        id: p.id,
        title: p.title,
        author: p.authorName,
        prayers: p.prayerCount,
        time: formatTimeAgo(p.createdAt),
      }))
    },
    {
      title: "최근 응답받은 기도",
      icon: Sparkles,
      items: answeredPrayers.map(p => ({
        id: p.id,
        title: p.title,
        author: p.authorName,
        badge: "응답",
        time: formatTimeAgo(p.createdAt),
      }))
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <section
            key={section.title}
            className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg hover:shadow-black/5 transition-all duration-300 group"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-secondary/30">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-[15px] font-semibold text-foreground">
                {section.title}
              </h3>
              <Link
                href="/prayer"
                className="ml-auto text-[13px] text-muted-foreground hover:text-primary transition-colors"
              >
                더보기
              </Link>
            </div>

            {/* Content */}
            <div className="divide-y divide-border">
              {section.items.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                  아직 기도 요청이 없습니다
                </div>
              ) : (
                section.items.map((item) => (
                  <Link
                    key={item.id}
                    href="/prayer"
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <span className="text-[14px] text-foreground line-clamp-1">
                        {item.title}
                      </span>
                      <span className="text-[12px] text-muted-foreground">{item.author}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {"badge" in item && item.badge ? (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                          {item.badge}
                        </span>
                      ) : "prayers" in item && item.prayers !== undefined ? (
                        <span className="text-[11px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          🙏 {item.prayers}
                        </span>
                      ) : null}
                      <span className="text-[12px] text-muted-foreground">
                        {item.time}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
