import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import pool from "@/lib/db";

async function verifyAdminSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) return false;

    const result = await pool.query(
      `SELECT role FROM "user" WHERE id = $1`,
      [session.user.id]
    );

    return result.rows[0]?.role === "admin";
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 총 사용자 수
    const usersResult = await pool.query(`SELECT COUNT(*) FROM "user"`);
    const totalUsers = parseInt(usersResult.rows[0].count, 10);

    // 오늘 가입한 사용자 수
    const todayUsersResult = await pool.query(`
      SELECT COUNT(*) FROM "user"
      WHERE "createdAt" >= CURRENT_DATE
    `);
    const todayUsers = parseInt(todayUsersResult.rows[0].count, 10);

    // 총 게시글 수
    const postsResult = await pool.query(`SELECT COUNT(*) FROM post`);
    const totalPosts = parseInt(postsResult.rows[0].count, 10);

    // 오늘 작성된 게시글 수
    const todayPostsResult = await pool.query(`
      SELECT COUNT(*) FROM post
      WHERE "createdAt" >= CURRENT_DATE
    `);
    const todayPosts = parseInt(todayPostsResult.rows[0].count, 10);

    // 활성 세션 수
    const sessionsResult = await pool.query(`
      SELECT COUNT(*) FROM session
      WHERE "expiresAt" > NOW()
    `);
    const activeSessions = parseInt(sessionsResult.rows[0].count, 10);

    // 최근 7일간 가입자 통계
    const weeklyUsersResult = await pool.query(`
      SELECT
        DATE("createdAt") as date,
        COUNT(*) as count
      FROM "user"
      WHERE "createdAt" >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE("createdAt")
      ORDER BY date
    `);

    return NextResponse.json({
      totalUsers,
      todayUsers,
      totalPosts,
      todayPosts,
      activeSessions,
      weeklyUsers: weeklyUsersResult.rows,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
