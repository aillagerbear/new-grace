import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 20000,
  connectionTimeoutMillis: 10000,
});

export default pool;

// Prayer 테이블 생성
let tableInitialized = false;
let tableInitPromise: Promise<void> | null = null;

export async function ensurePrayerTable() {
  if (tableInitialized) return;
  if (tableInitPromise) {
    await tableInitPromise;
    return;
  }

  tableInitPromise = initializePrayerTables();
  try {
    await tableInitPromise;
  } finally {
    tableInitPromise = null;
  }
}

async function initializePrayerTables() {
  let client;
  try {
    client = await pool.connect();

    // UUID 기본값 생성을 위해 확장 설치
    await client.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);

    // Prayer 테이블 생성 (기도제목/간증)
    await client.query(`
      CREATE TABLE IF NOT EXISTS prayer (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        type TEXT NOT NULL DEFAULT 'request',
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'general',
        visibility TEXT NOT NULL DEFAULT 'public',
        "authorId" TEXT NOT NULL,
        "authorName" TEXT,
        "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
        "prayerCount" INTEGER NOT NULL DEFAULT 0,
        "commentCount" INTEGER NOT NULL DEFAULT 0,
        "isAnswered" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // 기존 prayer 테이블(legacy 컬럼 포함) 보정
    await client.query(`ALTER TABLE prayer ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'general'`);
    await client.query(`ALTER TABLE prayer ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'public'`);
    await client.query(`ALTER TABLE prayer ADD COLUMN IF NOT EXISTS "authorId" TEXT`);
    await client.query(`ALTER TABLE prayer ADD COLUMN IF NOT EXISTS "authorName" TEXT`);
    await client.query(`ALTER TABLE prayer ADD COLUMN IF NOT EXISTS "isAnonymous" BOOLEAN NOT NULL DEFAULT false`);
    await client.query(`ALTER TABLE prayer ADD COLUMN IF NOT EXISTS "prayerCount" INTEGER NOT NULL DEFAULT 0`);
    await client.query(`ALTER TABLE prayer ADD COLUMN IF NOT EXISTS "commentCount" INTEGER NOT NULL DEFAULT 0`);
    await client.query(`ALTER TABLE prayer ADD COLUMN IF NOT EXISTS "isAnswered" BOOLEAN NOT NULL DEFAULT false`);
    await client.query(`ALTER TABLE prayer ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()`);
    await client.query(`ALTER TABLE prayer ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()`);

    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'prayer'
            AND column_name = 'author_id'
        ) THEN
          EXECUTE 'UPDATE prayer SET "authorId" = COALESCE("authorId", author_id)';
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'prayer'
            AND column_name = 'author_name'
        ) THEN
          EXECUTE 'UPDATE prayer SET "authorName" = COALESCE("authorName", author_name)';
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'prayer'
            AND column_name = 'is_anonymous'
        ) THEN
          EXECUTE 'UPDATE prayer SET "isAnonymous" = COALESCE("isAnonymous", is_anonymous)';
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'prayer'
            AND column_name = 'prayer_count'
        ) THEN
          EXECUTE 'UPDATE prayer SET "prayerCount" = COALESCE("prayerCount", prayer_count)';
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'prayer'
            AND column_name = 'comment_count'
        ) THEN
          EXECUTE 'UPDATE prayer SET "commentCount" = COALESCE("commentCount", comment_count)';
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'prayer'
            AND column_name = 'is_answered'
        ) THEN
          EXECUTE 'UPDATE prayer SET "isAnswered" = COALESCE("isAnswered", is_answered)';
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'prayer'
            AND column_name = 'created_at'
        ) THEN
          EXECUTE 'UPDATE prayer SET "createdAt" = COALESCE("createdAt", created_at)';
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'prayer'
            AND column_name = 'updated_at'
        ) THEN
          EXECUTE 'UPDATE prayer SET "updatedAt" = COALESCE("updatedAt", updated_at)';
        END IF;
      END
      $$;
    `);

    await client.query(`ALTER TABLE prayer ALTER COLUMN "authorId" SET NOT NULL`);

    // Prayer Comment 테이블
    await client.query(`
      CREATE TABLE IF NOT EXISTS prayer_comment (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "prayerId" TEXT NOT NULL,
        "authorId" TEXT NOT NULL,
        "authorName" TEXT,
        content TEXT NOT NULL,
        "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Prayer Reaction 테이블 (기도했어요)
    await client.query(`
      CREATE TABLE IF NOT EXISTS prayer_reaction (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "prayerId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Pastor Response 테이블 (목사 답변)
    await client.query(`
      CREATE TABLE IF NOT EXISTS pastor_response (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "prayerId" TEXT NOT NULL UNIQUE,
        "pastorId" TEXT NOT NULL,
        "pastorName" TEXT,
        content TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // 인덱스 생성
    await client.query(`CREATE INDEX IF NOT EXISTS idx_prayer_author_id ON prayer("authorId")`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_prayer_category ON prayer(category)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_prayer_visibility ON prayer(visibility)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_prayer_created_at ON prayer("createdAt" DESC)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_prayer_comment_prayer_id ON prayer_comment("prayerId")`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_prayer_comment_author_id ON prayer_comment("authorId")`);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_prayer_reaction_unique ON prayer_reaction("prayerId", "userId")`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_prayer_reaction_prayer_id ON prayer_reaction("prayerId")`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_prayer_reaction_user_id ON prayer_reaction("userId")`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_pastor_response_prayer_id ON pastor_response("prayerId")`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_pastor_response_pastor_id ON pastor_response("pastorId")`);

    tableInitialized = true;
    console.log("Prayer tables initialized successfully");
  } catch (error) {
    console.error("Error initializing prayer tables:", error);
    throw error;
  } finally {
    if (client) client.release();
  }
}
