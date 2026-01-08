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
    const category = searchParams.get("category") || "";
    const offset = (page - 1) * limit;

    let query = `
      SELECT
        p.id,
        p.title,
        p.content,
        p.category,
        p."createdAt",
        p."updatedAt",
        u.name as "authorName",
        u.email as "authorEmail"
      FROM post p
      LEFT JOIN "user" u ON p."authorId" = u.id
      WHERE 1=1
    `;

    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (p.title ILIKE $${paramIndex} OR p.content ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (category) {
      query += ` AND p.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    query += ` ORDER BY p."createdAt" DESC`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // 총 게시글 수 조회
    let countQuery = `SELECT COUNT(*) FROM post WHERE 1=1`;
    const countParams: string[] = [];
    let countParamIndex = 1;

    if (search) {
      countQuery += ` AND (title ILIKE $${countParamIndex} OR content ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }

    if (category) {
      countQuery += ` AND category = $${countParamIndex}`;
      countParams.push(category);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count, 10);

    return NextResponse.json({
      posts: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
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

    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    }

    await pool.query(`DELETE FROM post WHERE id = $1`, [postId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
