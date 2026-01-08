import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

async function verifyAdminSession() {
  try {
    // Better Auth 세션 가져오기
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) return false;

    // 사용자 역할 확인
    const result = await pool.query(
      `SELECT role FROM "user" WHERE id = $1`,
      [session.user.id]
    );

    return result.rows[0]?.role === "admin";
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const search = searchParams.get("search") || "";
    const offset = (page - 1) * limit;

    let query = `
      SELECT
        u.id,
        u.name,
        u.email,
        u."emailVerified",
        u.image,
        u.role,
        u."createdAt",
        a."providerId" as provider
      FROM "user" u
      LEFT JOIN account a ON u.id = a."userId"
    `;

    const params: (string | number)[] = [];

    if (search) {
      query += ` WHERE u.name ILIKE $1 OR u.email ILIKE $1`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY u."createdAt" DESC`;
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // 총 사용자 수 조회
    let countQuery = `SELECT COUNT(*) FROM "user"`;
    const countParams: string[] = [];

    if (search) {
      countQuery += ` WHERE name ILIKE $1 OR email ILIKE $1`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count, 10);

    return NextResponse.json({
      users: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    await pool.query(`DELETE FROM "user" WHERE id = $1`, [userId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

// 사용자 역할 업데이트
export async function PATCH(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, role } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // 유효한 역할인지 확인
    const validRoles = ["user", "pastor", "admin"];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be one of: user, pastor, admin" },
        { status: 400 }
      );
    }

    await pool.query(`UPDATE "user" SET role = $1, "updatedAt" = NOW() WHERE id = $2`, [
      role,
      userId,
    ]);

    return NextResponse.json({ success: true, role });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
