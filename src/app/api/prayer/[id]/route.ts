import { NextRequest, NextResponse } from "next/server";
import pool, { ensurePrayerTable } from "@/lib/db";
import { canViewPrayer, getSessionWithRole, type UserRole } from "@/lib/auth-helpers";

interface PrayerRow {
  id: string;
  type: "request" | "testimony";
  title: string;
  content: string;
  category: string;
  visibility: "public" | "pastor_only";
  authorId: string;
  authorName: string | null;
  isAnonymous: boolean;
  prayerCount: number;
  commentCount: number;
  isAnswered: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PastorResponseRow {
  id: string;
  pastorId: string;
  pastorName: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensurePrayerTable();
    const { id } = await params;
    const session = await getSessionWithRole();

    const prayerResult = await pool.query(
      `SELECT
         id,
         type,
         title,
         content,
         category,
         visibility,
         "authorId",
         "authorName",
         "isAnonymous",
         "prayerCount",
         "commentCount",
         "isAnswered",
         "createdAt",
         "updatedAt"
       FROM prayer
       WHERE id = $1`,
      [id]
    );

    const prayer = prayerResult.rows[0] as PrayerRow | undefined;
    if (!prayer) {
      return NextResponse.json({ error: "기도 요청을 찾을 수 없습니다" }, { status: 404 });
    }

    const userRole: UserRole = session?.user.role ?? "user";
    const isAuthor = Boolean(session?.user?.id && session.user.id === prayer.authorId);

    if (!canViewPrayer(prayer.visibility, userRole, isAuthor)) {
      return NextResponse.json({ error: "조회 권한이 없습니다" }, { status: 403 });
    }

    const responseResult = await pool.query(
      `SELECT
         id,
         "pastorId",
         "pastorName",
         content,
         "createdAt",
         "updatedAt"
       FROM pastor_response
       WHERE "prayerId" = $1`,
      [id]
    );

    const pastorResponse = (responseResult.rows[0] as PastorResponseRow | undefined) ?? null;

    let userHasPrayed = false;
    if (session?.user?.id) {
      const prayedResult = await pool.query(
        `SELECT 1
         FROM prayer_reaction
         WHERE "prayerId" = $1 AND "userId" = $2
         LIMIT 1`,
        [id, session.user.id]
      );
      userHasPrayed = Boolean(prayedResult.rows[0]);
    }

    return NextResponse.json({
      prayer: {
        ...prayer,
        authorName: prayer.isAnonymous ? "익명" : prayer.authorName,
      },
      pastorResponse,
      userHasPrayed,
      canRespondAsPastor: userRole === "pastor" || userRole === "admin",
    });
  } catch (error) {
    console.error("Error fetching prayer detail:", error);
    return NextResponse.json(
      { error: "기도 요청 상세 조회에 실패했습니다" },
      { status: 500 }
    );
  }
}

