import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { cookies } from "next/headers";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

async function verifyAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session?.value) return false;

  try {
    const decoded = Buffer.from(session.value, "base64").toString();
    const [prefix, timestamp] = decoded.split(":");
    const tokenTime = parseInt(timestamp, 10);
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    return prefix === "admin" && now - tokenTime < oneDay;
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
