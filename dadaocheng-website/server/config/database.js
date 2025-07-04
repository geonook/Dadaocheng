import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Zeabur PostgreSQL 連線配置
const dbConfig = {
  // 優先使用 DATABASE_URL (Zeabur 提供的完整連線字串)
  connectionString: process.env.DATABASE_URL,
  
  // PostgreSQL 連線池配置
  max: 20,                    // 最大連線數
  idleTimeoutMillis: 30000,   // 閒置連線超時
  connectionTimeoutMillis: 5000, // 連線超時 (增加到5秒給 Zeabur)
  
  // SSL 配置 (Zeabur 環境自動判斷)
  ssl: process.env.NODE_ENV === 'production' && process.env.DATABASE_URL?.includes('ssl=require') 
    ? { rejectUnauthorized: false } 
    : false
};

// 創建連線池
const pool = new Pool(dbConfig);

// 連線測試
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
  process.exit(-1);
});

// 測試資料庫連線
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('🎯 Database connection test successful:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    return false;
  }
};

// 執行查詢的輔助函數
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Query executed:', { text: text.substring(0, 50), duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('❌ Query error:', { text: text.substring(0, 50), error: error.message });
    throw error;
  }
};

// 取得單一連線 (用於交易)
export const getClient = async () => {
  return await pool.connect();
};

export default pool;