import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSessionWithRole } from "@/lib/auth-helpers";
import { prayerSchema } from "@/lib/validations/prayer";

// 기도 요청 생성
export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const session = await getSessionWithRole();

    if (!session?.user?.id) {
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
        { error: result.error.issues[0]?.message || "입력값이 올바르지 않습니다" },
        { status: 400 }
      );
    }

    const { type, title, content, category, visibility, isAnonymous } = result.data;

    // DB에 저장
    const client = await pool.connect();
    try {
      const id = crypto.randomUUID();
      const queryResult = await client.query(
        `INSERT INTO prayer (id, type, title, content, category, visibility, "isAnonymous", "authorId", "authorName")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, "createdAt"`,
        [
          id,
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
          createdAt: queryResult.rows[0].createdAt,
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
    const rawPage = parseInt(searchParams.get("page") || "1", 10);
    const rawLimit = parseInt(searchParams.get("limit") || "10", 10);
    const page = Number.isNaN(rawPage) ? 1 : Math.max(1, rawPage);
    const limit = Number.isNaN(rawLimit) ? 10 : Math.min(50, Math.max(1, rawLimit));
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const offset = (page - 1) * limit;
    const session = await getSessionWithRole();

    const client = await pool.connect();
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

      if (type) {
        whereConditions.push(`type = $${paramIndex}`);
        params.push(type);
        paramIndex++;
      }

      const whereClause =
        whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

      // 총 개수 조회
      const countResult = await client.query(
        `SELECT COUNT(*) FROM prayer ${whereClause}`,
        params
      );
      const total = parseInt(countResult.rows[0].count);

      // 목록 조회
      params.push(limit, offset);
      const listResult = await client.query(
        `SELECT id, type, title, content, category, visibility, "isAnonymous", "authorName", "authorId", "prayerCount", "isAnswered", "createdAt"
         FROM prayer
         ${whereClause}
         ORDER BY "createdAt" DESC
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
