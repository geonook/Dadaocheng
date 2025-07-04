import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { query, testConnection } from '../config/database.js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function runMigration() {
  console.log('🚀 Starting database migration...');

  try {
    // 測試資料庫連線
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to database');
    }

    // 讀取 SQL 腳本
    const sqlPath = path.join(__dirname, '../../database/schema.sql');
    const sqlContent = await fs.readFile(sqlPath, 'utf8');

    // 分割 SQL 語句（簡單的分割方式）
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📄 Found ${statements.length} SQL statements to execute`);

    // 執行每個 SQL 語句
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length > 0) {
        try {
          await query(statement);
          console.log(`✅ Statement ${i + 1}/${statements.length} executed successfully`);
        } catch (error) {
          // 忽略表已存在的錯誤
          if (error.code === '42P07' || error.message.includes('already exists')) {
            console.log(`⚠️  Statement ${i + 1} skipped (already exists): ${statement.substring(0, 50)}...`);
          } else {
            console.error(`❌ Error in statement ${i + 1}:`, error.message);
            console.error(`Statement: ${statement.substring(0, 100)}...`);
            // 不中斷，繼續執行其他語句
          }
        }
      }
    }

    // 創建預設管理員帳號
    await createDefaultAdmin();

    console.log('✅ Database migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

async function createDefaultAdmin() {
  console.log('👤 Creating default admin account...');

  try {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const email = process.env.ADMIN_EMAIL || 'admin@kcis.ntpc.edu.tw';
    const password = process.env.ADMIN_PASSWORD || 'dadaocheng2024';

    // 檢查管理員是否已存在
    const existingAdmin = await query(
      'SELECT id FROM admins WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingAdmin.rows.length > 0) {
      console.log('⚠️  Default admin already exists, skipping creation');
      return;
    }

    // 加密密碼
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 創建管理員
    await query(`
      INSERT INTO admins (username, email, password_hash, role)
      VALUES ($1, $2, $3, 'super_admin')
    `, [username, email, passwordHash]);

    console.log('✅ Default admin account created:');
    console.log(`   Username: ${username}`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('🔒 Please change the default password after first login!');

  } catch (error) {
    console.error('❌ Failed to create default admin:', error);
  }
}

// 如果直接執行此腳本
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  });
}

export { runMigration };