const postgres = require('postgres');

// PostgreSQL 연결
const sql = postgres(process.env.DATABASE_URL, {
  max: 1, // 마이그레이션은 단일 연결만 필요
});

// Better Auth PostgreSQL 테이블 생성
const migrations = [
  // UUID 생성 함수
  `CREATE EXTENSION IF NOT EXISTS pgcrypto`,

  // User 테이블
  `CREATE TABLE IF NOT EXISTS "user" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    image TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
  )`,

  // Session 테이블
  `CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    token TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE
  )`,

  // Account 테이블 (소셜 로그인용)
  `CREATE TABLE IF NOT EXISTS account (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "expiresAt" TIMESTAMP,
    "accessTokenExpiresAt" TIMESTAMP,
    "refreshTokenExpiresAt" TIMESTAMP,
    scope TEXT,
    password TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE
  )`,

  // 관리자 삭제 후 소셜 재가입 차단용 테이블
  `CREATE TABLE IF NOT EXISTS deleted_auth_identity (
    id BIGSERIAL PRIMARY KEY,
    email TEXT,
    "providerId" TEXT,
    "providerAccountId" TEXT,
    reason TEXT,
    "deletedAt" TIMESTAMP NOT NULL DEFAULT NOW()
  )`,

  // Verification 테이블
  `CREATE TABLE IF NOT EXISTS verification (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
  )`,

  // 인덱스 생성
  `CREATE INDEX IF NOT EXISTS idx_session_userId ON session("userId")`,
  `CREATE INDEX IF NOT EXISTS idx_account_userId ON account("userId")`,
  `CREATE INDEX IF NOT EXISTS idx_deleted_auth_identity_email_lower ON deleted_auth_identity(LOWER(email))`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_deleted_auth_identity_provider_account_unique
    ON deleted_auth_identity("providerId", "providerAccountId")
    WHERE "providerId" IS NOT NULL AND "providerAccountId" IS NOT NULL`,
  `CREATE INDEX IF NOT EXISTS idx_verification_identifier ON verification(identifier)`,

  // 기존 테이블에 누락된 컬럼 추가 (ALTER TABLE)
  `ALTER TABLE session ADD COLUMN IF NOT EXISTS token TEXT`,
  `ALTER TABLE account ADD COLUMN IF NOT EXISTS "accessTokenExpiresAt" TIMESTAMP`,
  `ALTER TABLE account ADD COLUMN IF NOT EXISTS "refreshTokenExpiresAt" TIMESTAMP`,
  `ALTER TABLE account ADD COLUMN IF NOT EXISTS scope TEXT`,

  // User 테이블에 role 컬럼 추가 (역할 관리용)
  // 역할: 'user' (일반), 'pastor' (목사), 'admin' (관리자)
  `ALTER TABLE "user" ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'`,

  // Post 테이블 (게시글 관리용)
  `CREATE TABLE IF NOT EXISTS post (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    category TEXT DEFAULT 'general',
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY ("authorId") REFERENCES "user"(id) ON DELETE CASCADE
  )`,

  // Post 인덱스
  `CREATE INDEX IF NOT EXISTS idx_post_authorId ON post("authorId")`,
  `CREATE INDEX IF NOT EXISTS idx_post_category ON post(category)`,
  `CREATE INDEX IF NOT EXISTS idx_post_createdAt ON post("createdAt" DESC)`,

  // ============================================
  // 기도 기능 테이블
  // ============================================

  // Prayer 테이블 (기도제목/간증)
  `CREATE TABLE IF NOT EXISTS prayer (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    type TEXT NOT NULL DEFAULT 'request',
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    visibility TEXT NOT NULL DEFAULT 'public',
    "authorId" TEXT NOT NULL,
    "authorName" TEXT,
    "isAnonymous" BOOLEAN DEFAULT false,
    "prayerCount" INTEGER DEFAULT 0,
    "commentCount" INTEGER DEFAULT 0,
    "isAnswered" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY ("authorId") REFERENCES "user"(id) ON DELETE CASCADE
  )`,

  // Prayer 기존 컬럼 보정
  `ALTER TABLE prayer ADD COLUMN IF NOT EXISTS "authorName" TEXT`,
  `ALTER TABLE prayer ADD COLUMN IF NOT EXISTS "prayerCount" INTEGER DEFAULT 0`,
  `ALTER TABLE prayer ADD COLUMN IF NOT EXISTS "commentCount" INTEGER DEFAULT 0`,
  `ALTER TABLE prayer ADD COLUMN IF NOT EXISTS "isAnswered" BOOLEAN DEFAULT false`,

  // 기존 prayedCount 컬럼에서 prayerCount로 백필
  `DO $$
   BEGIN
     IF EXISTS (
       SELECT 1
       FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name = 'prayer'
         AND column_name = 'prayedCount'
     ) THEN
       EXECUTE 'UPDATE prayer SET "prayerCount" = "prayedCount" WHERE "prayedCount" IS NOT NULL AND COALESCE("prayerCount", 0) = 0';
     END IF;
   END
   $$`,

  // Prayer 인덱스
  `CREATE INDEX IF NOT EXISTS idx_prayer_authorId ON prayer("authorId")`,
  `CREATE INDEX IF NOT EXISTS idx_prayer_type ON prayer(type)`,
  `CREATE INDEX IF NOT EXISTS idx_prayer_visibility ON prayer(visibility)`,
  `CREATE INDEX IF NOT EXISTS idx_prayer_createdAt ON prayer("createdAt" DESC)`,

  // Prayer Comment 테이블 (기도 댓글)
  `CREATE TABLE IF NOT EXISTS prayer_comment (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "prayerId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT,
    content TEXT NOT NULL,
    "isAnonymous" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY ("prayerId") REFERENCES prayer(id) ON DELETE CASCADE,
    FOREIGN KEY ("authorId") REFERENCES "user"(id) ON DELETE CASCADE
  )`,

  // Prayer Comment 인덱스
  `CREATE INDEX IF NOT EXISTS idx_prayer_comment_prayerId ON prayer_comment("prayerId")`,
  `CREATE INDEX IF NOT EXISTS idx_prayer_comment_authorId ON prayer_comment("authorId")`,

  // Prayer Reaction 테이블 (기도했어요)
  `CREATE TABLE IF NOT EXISTS prayer_reaction (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "prayerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY ("prayerId") REFERENCES prayer(id) ON DELETE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE
  )`,

  // Prayer Reaction 유니크 제약 및 인덱스
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_prayer_reaction_unique ON prayer_reaction("prayerId", "userId")`,
  `CREATE INDEX IF NOT EXISTS idx_prayer_reaction_prayerId ON prayer_reaction("prayerId")`,
  `CREATE INDEX IF NOT EXISTS idx_prayer_reaction_userId ON prayer_reaction("userId")`,

  // Pastor Response 테이블 (목사님 답변)
  `CREATE TABLE IF NOT EXISTS pastor_response (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "prayerId" TEXT NOT NULL UNIQUE,
    "pastorId" TEXT NOT NULL,
    "pastorName" TEXT,
    content TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY ("prayerId") REFERENCES prayer(id) ON DELETE CASCADE,
    FOREIGN KEY ("pastorId") REFERENCES "user"(id) ON DELETE CASCADE
  )`,

  // Pastor Response 인덱스
  `CREATE INDEX IF NOT EXISTS idx_pastor_response_prayerId ON pastor_response("prayerId")`,
  `CREATE INDEX IF NOT EXISTS idx_pastor_response_pastorId ON pastor_response("pastorId")`,
];

async function runMigrations() {
  console.log('Running PostgreSQL migrations...');

  try {
    for (let i = 0; i < migrations.length; i++) {
      await sql.unsafe(migrations[i]);
      console.log(`✓ Migration ${i + 1}/${migrations.length} completed`);
    }
    console.log('\n✓ All migrations completed successfully!');
  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigrations();
