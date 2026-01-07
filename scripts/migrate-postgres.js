const postgres = require('postgres');

// PostgreSQL 연결
const sql = postgres(process.env.DATABASE_URL, {
  max: 1, // 마이그레이션은 단일 연결만 필요
});

// Better Auth PostgreSQL 테이블 생성
const migrations = [
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
  `CREATE INDEX IF NOT EXISTS idx_verification_identifier ON verification(identifier)`,

  // 기존 테이블에 누락된 컬럼 추가 (ALTER TABLE)
  `ALTER TABLE account ADD COLUMN IF NOT EXISTS "accessTokenExpiresAt" TIMESTAMP`,
  `ALTER TABLE account ADD COLUMN IF NOT EXISTS "refreshTokenExpiresAt" TIMESTAMP`,
  `ALTER TABLE account ADD COLUMN IF NOT EXISTS scope TEXT`,
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
