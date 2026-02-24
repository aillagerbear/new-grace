import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import pool from "@/lib/db";
import type { PoolClient } from "pg";

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

async function ensureDeletedAuthIdentityTable(client: PoolClient) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS deleted_auth_identity (
      id BIGSERIAL PRIMARY KEY,
      email TEXT,
      "providerId" TEXT,
      "providerAccountId" TEXT,
      reason TEXT,
      "deletedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_deleted_auth_identity_email_lower
    ON deleted_auth_identity (LOWER(email))
  `);

  await client.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_deleted_auth_identity_provider_account_unique
    ON deleted_auth_identity("providerId", "providerAccountId")
    WHERE "providerId" IS NOT NULL AND "providerAccountId" IS NOT NULL
  `);
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

    if (typeof userId !== "string" || userId.trim().length === 0) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }
    const normalizedUserId = userId.trim();

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await ensureDeletedAuthIdentityTable(client);

      const userResult = await client.query<{ email: string | null }>(
        `SELECT email FROM "user" WHERE id = $1`,
        [normalizedUserId]
      );

      if (!userResult.rows[0]) {
        await client.query("ROLLBACK");
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const normalizedEmail = userResult.rows[0].email?.trim().toLowerCase() ?? null;

      if (normalizedEmail) {
        await client.query(
          `
            INSERT INTO deleted_auth_identity (email, "deletedAt")
            SELECT $1, NOW()
            WHERE NOT EXISTS (
              SELECT 1
              FROM deleted_auth_identity
              WHERE email IS NOT NULL
                AND LOWER(email) = LOWER($1)
            )
          `,
          [normalizedEmail]
        );
      }

      const accountResult = await client.query<{
        providerId: string | null;
        accountId: string | null;
      }>(
        `
          SELECT "providerId" AS "providerId", "accountId" AS "accountId"
          FROM account
          WHERE "userId" = $1
        `,
        [normalizedUserId]
      );

      for (const row of accountResult.rows) {
        if (!row.providerId || !row.accountId) continue;

        await client.query(
          `
            INSERT INTO deleted_auth_identity (email, "providerId", "providerAccountId", "deletedAt")
            SELECT $1, $2, $3, NOW()
            WHERE NOT EXISTS (
              SELECT 1
              FROM deleted_auth_identity
              WHERE "providerId" = $2
                AND "providerAccountId" = $3
            )
          `,
          [normalizedEmail, row.providerId, row.accountId]
        );
      }

      await client.query(`DELETE FROM "user" WHERE id = $1`, [normalizedUserId]);
      await client.query("COMMIT");

      return NextResponse.json({ success: true });
    } catch (error) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // rollback 실패는 원본 에러를 우선 반환
      }
      throw error;
    } finally {
      client.release();
    }
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
