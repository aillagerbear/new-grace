import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import pool, { ensurePrayerTable } from "@/lib/db";
import { prayerSchema } from "@/lib/validations/prayer";

// 기도 요청 생성
export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // 유효성 검사
    const result = prayerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { type, title, content, category, visibility, isAnonymous } = result.data;

    // 테이블 확인
    await ensurePrayerTable();

    // DB에 저장
    const client = await pool.connect();
    try {
      const queryResult = await client.query(
        `INSERT INTO prayer (type, title, content, category, visibility, is_anonymous, author_id, author_name)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id, created_at`,
        [
          type,
          title,
          content,
          category,
          visibility,
          isAnonymous,
          session.user.id,
          isAnonymous ? null : session.user.name,
        ]
      );

      return NextResponse.json({
        success: true,
        prayer: {
          id: queryResult.rows[0].id,
          createdAt: queryResult.rows[0].created_at,
        },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error creating prayer:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "기도 요청 등록에 실패했습니다", details: errorMessage },
      { status: 500 }
    );
  }
}

// 기도 요청 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const offset = (page - 1) * limit;

    // 테이블 확인
    await ensurePrayerTable();

    const client = await pool.connect();
    try {
      let whereClause = "WHERE visibility = 'public'";
      const params: (string | number)[] = [];
      let paramIndex = 1;

      if (category) {
        whereClause += ` AND category = $${paramIndex}`;
        params.push(category);
        paramIndex++;
      }

      if (type) {
        whereClause += ` AND type = $${paramIndex}`;
        params.push(type);
        paramIndex++;
      }

      // 총 개수 조회
      const countResult = await client.query(
        `SELECT COUNT(*) FROM prayer ${whereClause}`,
        params
      );
      const total = parseInt(countResult.rows[0].count);

      // 목록 조회
      params.push(limit, offset);
      const listResult = await client.query(
        `SELECT id, type, title, content, category, is_anonymous, author_name, prayer_count, is_answered, created_at
         FROM prayer
         ${whereClause}
         ORDER BY created_at DESC
         LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
        params
      );

      return NextResponse.json({
        prayers: listResult.rows.map((row) => ({
          id: row.id,
          type: row.type,
          title: row.title,
          content: row.content,
          category: row.category,
          isAnonymous: row.is_anonymous,
          authorName: row.is_anonymous ? "익명" : row.author_name,
          prayerCount: row.prayer_count,
          isAnswered: row.is_answered,
          createdAt: row.created_at,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching prayers:", error);
    return NextResponse.json(
      { error: "기도 요청 목록 조회에 실패했습니다" },
      { status: 500 }
    );
  }
}
