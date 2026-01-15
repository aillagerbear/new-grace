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

  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS prayer (
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
      );

      CREATE INDEX IF NOT EXISTS idx_prayer_author_id ON prayer(author_id);
      CREATE INDEX IF NOT EXISTS idx_prayer_category ON prayer(category);
      CREATE INDEX IF NOT EXISTS idx_prayer_created_at ON prayer(created_at DESC);
    `);
    tableInitialized = true;
  } finally {
    client.release();
  }
}
