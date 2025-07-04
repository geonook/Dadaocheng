import { query, testConnection } from '../config/database.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function createTables() {
  console.log('🚀 Creating database tables...');

  try {
    // 測試資料庫連線
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to database');
    }

    // 創建組別表
    console.log('📋 Creating groups table...');
    await query(`
      CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        group_number INTEGER NOT NULL UNIQUE CHECK (group_number >= 1 AND group_number <= 25),
        group_name VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 創建任務表
    console.log('📋 Creating tasks table...');
    await query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        task_key VARCHAR(50) NOT NULL UNIQUE,
        title_zh VARCHAR(255) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        description_zh TEXT,
        description_en TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 創建成果提交表
    console.log('📋 Creating submissions table...');
    await query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
        task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        youtube_link VARCHAR(500),
        submission_data JSONB,
        status VARCHAR(50) DEFAULT 'pending',
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approved_at TIMESTAMP,
        approved_by VARCHAR(255),
        UNIQUE(group_id)
      );
    `);

    // 創建檔案表
    console.log('📋 Creating files table...');
    await query(`
      CREATE TABLE IF NOT EXISTS files (
        id SERIAL PRIMARY KEY,
        submission_id INTEGER REFERENCES submissions(id) ON DELETE CASCADE,
        original_filename VARCHAR(255) NOT NULL,
        stored_filename VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size BIGINT NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 創建管理員表
    console.log('📋 Creating admins table...');
    await query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      );
    `);

    // 創建系統設定表
    console.log('📋 Creating settings table...');
    await query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT,
        description TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 創建索引
    console.log('📋 Creating indexes...');
    try {
      await query('CREATE INDEX IF NOT EXISTS idx_submissions_group_id ON submissions(group_id);');
      await query('CREATE INDEX IF NOT EXISTS idx_submissions_task_id ON submissions(task_id);');
      await query('CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);');
      await query('CREATE INDEX IF NOT EXISTS idx_files_submission_id ON files(submission_id);');
      await query('CREATE INDEX IF NOT EXISTS idx_files_file_type ON files(file_type);');
    } catch (error) {
      console.log('⚠️ Some indexes may already exist, continuing...');
    }

    console.log('✅ All tables created successfully!');

  } catch (error) {
    console.error('❌ Failed to create tables:', error);
    throw error;
  }
}

async function insertInitialData() {
  console.log('📊 Inserting initial data...');

  try {
    // 插入組別數據
    console.log('👥 Creating groups...');
    for (let i = 2; i <= 25; i++) {
      try {
        await query(
          'INSERT INTO groups (group_number, group_name) VALUES ($1, $2) ON CONFLICT (group_number) DO NOTHING',
          [i, `第${i}組`]
        );
      } catch (error) {
        // 忽略重複錯誤
      }
    }

    // 插入任務數據
    console.log('📝 Creating tasks...');
    const tasks = [
      {
        key: 'task1',
        title_zh: '大稻埕教學素材收集家',
        title_en: 'Dadaocheng Teaching Material Collector',
        description_zh: '從真實場域中提取教學資源，思考如何將大稻埕的學習素材應用於教學領域。',
        description_en: 'Extract teaching resources from real venues and consider how to apply Dadaocheng learning materials to teaching fields.'
      },
      {
        key: 'task2',
        title_zh: '大稻埕主題地圖規劃師',
        title_en: 'Dadaocheng Themed Map Planner',
        description_zh: '規劃具主題性的導覽路線，發掘大稻埕的特色與趣味。',
        description_en: 'Plan thematic tour routes and discover the characteristics and interests of Dadaocheng.'
      },
      {
        key: 'task3',
        title_zh: '大稻埕前世今生探究者',
        title_en: 'Dadaocheng Past and Present Explorer',
        description_zh: '深入了解地方環境與歷史縱深，探究大稻埕的過去與現在。',
        description_en: 'Deeply understand the local environment and historical depth, exploring the past and present of Dadaocheng.'
      },
      {
        key: 'task4',
        title_zh: '大稻埕YouTuber',
        title_en: 'Dadaocheng YouTuber',
        description_zh: '將戶外探訪內容轉化為具吸引力且能有效傳達資訊的影音介紹。',
        description_en: 'Transform outdoor exploration content into attractive and effective audio-visual introductions.'
      },
      {
        key: 'task5',
        title_zh: '大稻埕自主學習者',
        title_en: 'Dadaocheng Self-directed Learner',
        description_zh: '高度彈性的自主學習任務，依據個人興趣與專業規劃學習活動。',
        description_en: 'Highly flexible self-directed learning tasks, planning learning activities based on personal interests and expertise.'
      }
    ];

    for (const task of tasks) {
      try {
        await query(`
          INSERT INTO tasks (task_key, title_zh, title_en, description_zh, description_en)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (task_key) DO NOTHING
        `, [task.key, task.title_zh, task.title_en, task.description_zh, task.description_en]);
      } catch (error) {
        // 忽略重複錯誤
      }
    }

    // 插入系統設定
    console.log('⚙️ Creating settings...');
    const settings = [
      { key: 'max_file_size', value: '104857600', description: '最大檔案大小限制 (100MB)' },
      { key: 'allowed_file_types', value: 'jpg,jpeg,png,gif,mp4,mov,avi,pdf,doc,docx,ppt,pptx', description: '允許的檔案類型' },
      { key: 'submission_deadline', value: null, description: '提交截止日期' },
      { key: 'site_maintenance', value: 'false', description: '網站維護模式' }
    ];

    for (const setting of settings) {
      try {
        await query(`
          INSERT INTO settings (setting_key, setting_value, description)
          VALUES ($1, $2, $3)
          ON CONFLICT (setting_key) DO NOTHING
        `, [setting.key, setting.value, setting.description]);
      } catch (error) {
        // 忽略重複錯誤
      }
    }

    console.log('✅ Initial data inserted successfully!');

  } catch (error) {
    console.error('❌ Failed to insert initial data:', error);
    throw error;
  }
}

async function createDefaultAdmin() {
  console.log('👤 Creating default admin account...');

  try {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const email = process.env.ADMIN_EMAIL || 'tsehungchen@kcislk.ntpc.edu.tw';
    const password = process.env.ADMIN_PASSWORD || 'dadaocheng2024';

    // 檢查管理員是否已存在
    const existingAdmin = await query(
      'SELECT id FROM admins WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingAdmin.rows.length > 0) {
      console.log('⚠️ Default admin already exists, skipping creation');
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
    throw error;
  }
}

async function main() {
  try {
    await createTables();
    await insertInitialData();
    await createDefaultAdmin();
    console.log('🎉 Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

main();