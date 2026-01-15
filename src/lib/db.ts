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

export async function ensurePrayerTable() {
  if (tableInitialized) return;

  let client;
  try {
    client = await pool.connect();

    // 기존 테이블 삭제 후 재생성 (스키마 변경 시)
    await client.query(`DROP TABLE IF EXISTS prayer CASCADE`);

    // 테이블 생성
    await client.query(`
      CREATE TABLE prayer (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type VARCHAR(20) NOT NULL DEFAULT 'request',
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        visibility VARCHAR(20) NOT NULL DEFAULT 'public',
        is_anonymous BOOLEAN NOT NULL DEFAULT false,
        author_id VARCHAR(255) NOT NULL,
        author_name VARCHAR(255),
        prayer_count INTEGER NOT NULL DEFAULT 0,
        is_answered BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 인덱스 생성
    await client.query(`CREATE INDEX idx_prayer_author_id ON prayer(author_id)`);
    await client.query(`CREATE INDEX idx_prayer_category ON prayer(category)`);
    await client.query(`CREATE INDEX idx_prayer_created_at ON prayer(created_at DESC)`);

    tableInitialized = true;
    console.log("Prayer table created successfully");
  } catch (error) {
    console.error("Error initializing prayer table:", error);
    throw error;
  } finally {
    if (client) client.release();
  }
}
