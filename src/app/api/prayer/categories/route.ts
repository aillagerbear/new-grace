import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { PRAYER_CATEGORY_LABELS, PrayerCategory } from "@/types/prayer";

// 카테고리별 기도 요청 개수 조회
export async function GET() {
  try {

    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT category, COUNT(*) as count
        FROM prayer
        WHERE visibility = 'public'
        GROUP BY category
      `);

      // 모든 카테고리를 포함하되, DB에 없는 것은 0으로 설정
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

      // 총 개수도 함께 반환
      const total = categories.reduce((sum, cat) => sum + cat.count, 0);

      return NextResponse.json({
        categories,
        total,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching prayer categories:", error);
    return NextResponse.json(
      { error: "카테고리 조회에 실패했습니다" },
      { status: 500 }
    );
  }
}
