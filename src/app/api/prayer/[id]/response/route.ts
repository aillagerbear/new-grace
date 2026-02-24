import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import {
  canRespondAsPastor,
  canViewPrayer,
  getSessionWithRole,
  type UserRole,
} from "@/lib/auth-helpers";
import { pastorResponseSchema } from "@/lib/validations/prayer";

interface PrayerRow {
  id: string;
  visibility: "public" | "pastor_only";
  authorId: string;
}

async function findPrayerById(prayerId: string): Promise<PrayerRow | null> {
  const result = await pool.query(
    `SELECT id, visibility, "authorId"
     FROM prayer
     WHERE id = $1`,
    [prayerId]
  );

  if (!result.rows[0]) return null;
  return result.rows[0] as PrayerRow;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;
    const session = await getSessionWithRole();
    const prayer = await findPrayerById(id);

    if (!prayer) {
      return NextResponse.json({ error: "기도 요청을 찾을 수 없습니다" }, { status: 404 });
    }

    const userRole: UserRole = session?.user.role ?? "user";
    const isAuthor = Boolean(session?.user?.id && session.user.id === prayer.authorId);

    if (!canViewPrayer(prayer.visibility, userRole, isAuthor)) {
      return NextResponse.json({ error: "조회 권한이 없습니다" }, { status: 403 });
    }

    const result = await pool.query(
      `SELECT
         id,
         "prayerId",
         "pastorId",
         "pastorName",
         content,
         "createdAt",
         "updatedAt"
       FROM pastor_response
       WHERE "prayerId" = $1`,
      [id]
    );

    return NextResponse.json({
      response: result.rows[0] ?? null,
    });
  } catch (error) {
    console.error("Error fetching pastor response:", error);
    return NextResponse.json(
      { error: "목사 답변 조회에 실패했습니다" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  try {

    const session = await getSessionWithRole();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
    }

    if (!canRespondAsPastor(session.user.role)) {
      return NextResponse.json(
        { error: "목사 또는 관리자만 답변할 수 있습니다" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = pastorResponseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "입력값이 올바르지 않습니다" },
        { status: 400 }
      );
    }

    const { id } = await params;

    await client.query("BEGIN");

    const prayerResult = await client.query(
      `SELECT id
       FROM prayer
       WHERE id = $1
       FOR UPDATE`,
      [id]
    );

    if (!prayerResult.rows[0]) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "기도 요청을 찾을 수 없습니다" }, { status: 404 });
    }

    const responseId = crypto.randomUUID();
    const responseResult = await client.query(
      `INSERT INTO pastor_response (id, "prayerId", "pastorId", "pastorName", content)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT ("prayerId")
       DO UPDATE SET
         "pastorId" = EXCLUDED."pastorId",
         "pastorName" = EXCLUDED."pastorName",
         content = EXCLUDED.content,
         "updatedAt" = NOW()
       RETURNING
         id,
         "prayerId",
         "pastorId",
         "pastorName",
         content,
         "createdAt",
         "updatedAt"`,
      [responseId, id, session.user.id, session.user.name || null, parsed.data.content]
    );

    await client.query(
      `UPDATE prayer
       SET "isAnswered" = true,
           "updatedAt" = NOW()
       WHERE id = $1`,
      [id]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      response: responseResult.rows[0],
    });
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // no-op
    }
    console.error("Error saving pastor response:", error);
    return NextResponse.json(
      { error: "목사 답변 등록에 실패했습니다" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

