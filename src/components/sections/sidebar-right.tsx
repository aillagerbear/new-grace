import { cache } from 'react';
import { Bell, Hash, Award } from 'lucide-react';
import Link from 'next/link';
import pool from '@/lib/db';
import { PRAYER_CATEGORY_LABELS, PrayerCategory } from '@/types/prayer';

interface CategoryStats {
  id: string;
  name: string;
  count: number;
}

// server-cache-react: React.cache()로 요청 당 중복 호출 방지
const getCategoryStats = cache(async function getCategoryStats(): Promise<{ categories: CategoryStats[]; total: number }> {
  try {

    const client = await pool.connect();

    try {
      const result = await client.query(`
        SELECT category, COUNT(*) as count
        FROM prayer
        WHERE visibility = 'public'
        GROUP BY category
      `);

      const categoryMap = new Map(
        result.rows.map((row) => [row.category, parseInt(row.count)])
      );

      const categories = (Object.keys(PRAYER_CATEGORY_LABELS) as PrayerCategory[]).map(
        (key) => ({
          id: key,
          name: PRAYER_CATEGORY_LABELS[key],
          count: categoryMap.get(key) || 0,
        })
      );

      const total = categories.reduce((sum, cat) => sum + cat.count, 0);

      return { categories, total };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching category stats:', error);
    return { categories: [], total: 0 };
  }
});

/**
 * SidebarRight component - Prayer Community Platform (Server Component)
 */
export default async function SidebarRight() {
  const { categories, total } = await getCategoryStats();

  return (
    <aside className="w-[320px] shrink-0 hidden xl:block space-y-6">
      {/* Community Stats */}
      <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
        <h3 className="text-[14px] font-semibold text-foreground mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" />
          커뮤니티 현황
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-muted-foreground">전체 기도제목</span>
            <span className="text-[15px] font-semibold text-foreground">{total}개</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-secondary/30">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Hash className="w-5 h-5" />
          </div>
          <h3 className="text-[15px] font-semibold text-foreground">기도 카테고리</h3>
        </div>
        <div className="p-4 flex flex-wrap gap-2">
          {categories.length === 0 ? (
            <p className="text-[13px] text-muted-foreground w-full text-center py-4">
              카테고리가 없습니다
            </p>
          ) : (
            categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/prayer?category=${cat.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary/50 hover:bg-secondary rounded-full text-[13px] text-foreground transition-colors"
              >
                <span>{cat.name}</span>
                <span className="text-[11px] text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {cat.count}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Notice */}
      <div className="bg-primary/5 rounded-2xl border border-primary/10 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-4 h-4 text-primary" />
          <p className="text-[12px] font-medium text-primary">공지사항</p>
        </div>
        <p className="text-[13px] leading-relaxed text-foreground">
          기도 요청 시 개인정보는 익명으로 처리됩니다. 안심하고 나누어 주세요.
        </p>
      </div>
    </aside>
  );
}
