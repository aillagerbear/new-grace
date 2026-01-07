const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
});

async function testConnection() {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    console.log('✅ Successfully connected to database');

    const result = await client.query('SELECT version()');
    console.log('PostgreSQL version:', result.rows[0].version);

    client.release();
    await pool.end();
    console.log('Connection closed');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testConnection();
