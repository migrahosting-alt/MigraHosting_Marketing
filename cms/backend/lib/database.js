import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

dbPool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

// Helper function for transactions
export async function withTransaction(callback) {
  const client = await dbPool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Query builder helpers
export const query = {
  async one(text, params) {
    const result = await dbPool.query(text, params);
    return result.rows[0] || null;
  },

  async many(text, params) {
    const result = await dbPool.query(text, params);
    return result.rows;
  },

  async exec(text, params) {
    const result = await dbPool.query(text, params);
    return result;
  },
};

export default dbPool;
