import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import pool from "@/lib/db";

export async function GET() {
  try {
    // Better Auth 세션 가져오기
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({
        authenticated: false,
        reason: "not_logged_in",
      });
    }

    // 사용자 역할 확인
    const result = await pool.query(
      `SELECT role FROM "user" WHERE id = $1`,
      [session.user.id]
    );

    const userRole = result.rows[0]?.role || "user";

    if (userRole !== "admin") {
      return NextResponse.json({
        authenticated: false,
        reason: "not_admin",
        userRole,
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: userRole,
      },
    });
  } catch (error) {
    console.error("Admin verify error:", error);
    return NextResponse.json({
      authenticated: false,
      reason: "error",
    });
  }
}
