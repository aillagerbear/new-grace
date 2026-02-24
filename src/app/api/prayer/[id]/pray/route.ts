import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { canViewPrayer, getSessionWithRole, type UserRole } from "@/lib/auth-helpers";

interface PrayerVisibilityRow {
  id: string;
  visibility: "public" | "pastor_only";
  authorId: string;
}

async function getPrayerVisibility(prayerId: string): Promise<PrayerVisibilityRow | null> {
  const result = await pool.query(
    `SELECT id, visibility, "authorId"
     FROM prayer
     WHERE id = $1`,
    [prayerId]
  );
  return (result.rows[0] as PrayerVisibilityRow | undefined) ?? null;
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  try {

    const session = await getSessionWithRole();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
    }

    const { id } = await params;
    const prayer = await getPrayerVisibility(id);
    if (!prayer) {
      return NextResponse.json({ error: "기도 요청을 찾을 수 없습니다" }, { status: 404 });
    }

    const userRole: UserRole = session.user.role;
    const isAuthor = session.user.id === prayer.authorId;
    if (!canViewPrayer(prayer.visibility, userRole, isAuthor)) {
      return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
    }

    await client.query("BEGIN");

    const inserted = await client.query(
      `INSERT INTO prayer_reaction ("prayerId", "userId")
       VALUES ($1, $2)
       ON CONFLICT ("prayerId", "userId") DO NOTHING
       RETURNING id`,
      [id, session.user.id]
    );

    if (inserted.rowCount && inserted.rowCount > 0) {
      await client.query(
        `UPDATE prayer
         SET "prayerCount" = "prayerCount" + 1
         WHERE id = $1`,
        [id]
      );
    }

    const countResult = await client.query(
      `SELECT "prayerCount"
       FROM prayer
       WHERE id = $1`,
      [id]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      prayed: true,
      alreadyPrayed: !(inserted.rowCount && inserted.rowCount > 0),
      prayerCount: countResult.rows[0]?.prayerCount ?? 0,
    });
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // no-op
    }
    console.error("Error praying for request:", error);
    return NextResponse.json(
      { error: "기도 참여 처리에 실패했습니다" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  try {

    const session = await getSessionWithRole();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
    }

    const { id } = await params;

    await client.query("BEGIN");

    const deleted = await client.query(
      `DELETE FROM prayer_reaction
       WHERE "prayerId" = $1 AND "userId" = $2
       RETURNING id`,
      [id, session.user.id]
    );

    if (deleted.rowCount && deleted.rowCount > 0) {
      await client.query(
        `UPDATE prayer
         SET "prayerCount" = GREATEST("prayerCount" - 1, 0)
         WHERE id = $1`,
        [id]
      );
    }

    const countResult = await client.query(
      `SELECT "prayerCount"
       FROM prayer
       WHERE id = $1`,
      [id]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      prayed: false,
      prayerCount: countResult.rows[0]?.prayerCount ?? 0,
    });
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // no-op
    }
    console.error("Error canceling prayer reaction:", error);
    return NextResponse.json(
      { error: "기도 참여 취소에 실패했습니다" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

