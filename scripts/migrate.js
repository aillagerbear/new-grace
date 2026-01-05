const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// 데이터베이스 경로 설정
const dbPath = path.join(process.cwd(), 'db.sqlite');
const dbDir = path.dirname(dbPath);

// 디렉토리 생성
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Better Auth 테이블 생성
const migrations = [
  // User 테이블
  `CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    emailVerified INTEGER NOT NULL DEFAULT 0,
    image TEXT,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  )`,

  // Session 테이블
  `CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    expiresAt INTEGER NOT NULL,
    ipAddress TEXT,
    userAgent TEXT,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
  )`,

  // Account 테이블 (소셜 로그인용)
  `CREATE TABLE IF NOT EXISTS account (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    accountId TEXT NOT NULL,
    providerId TEXT NOT NULL,
    accessToken TEXT,
    refreshToken TEXT,
    idToken TEXT,
    expiresAt INTEGER,
    password TEXT,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
  )`,

  // Verification 테이블
  `CREATE TABLE IF NOT EXISTS verification (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expiresAt INTEGER NOT NULL,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  )`,

  // 인덱스 생성
  `CREATE INDEX IF NOT EXISTS idx_session_userId ON session(userId)`,
  `CREATE INDEX IF NOT EXISTS idx_account_userId ON account(userId)`,
  `CREATE INDEX IF NOT EXISTS idx_verification_identifier ON verification(identifier)`,
];

console.log('Running migrations...');

try {
  migrations.forEach((migration, index) => {
    db.exec(migration);
    console.log(`✓ Migration ${index + 1}/${migrations.length} completed`);
  });
  console.log('\n✓ All migrations completed successfully!');
} catch (error) {
  console.error('✗ Migration failed:', error);
  process.exit(1);
} finally {
  db.close();
}
