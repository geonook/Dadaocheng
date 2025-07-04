-- 大稻埕專案資料庫結構設計
-- 適用於 PostgreSQL

-- 創建資料庫 (在 Zeabur 上會自動創建)
-- CREATE DATABASE dadaocheng_project;

-- 組別表
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    group_number INTEGER NOT NULL UNIQUE CHECK (group_number >= 1 AND group_number <= 25),
    group_name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 任務表
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    task_key VARCHAR(50) NOT NULL UNIQUE, -- task1, task2, task3, task4, task5
    title_zh VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_zh TEXT,
    description_en TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 成果提交表
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    youtube_link VARCHAR(500),
    submission_data JSONB, -- 存儲額外的提交數據
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by VARCHAR(255),
    
    -- 確保每組只能提交一次
    UNIQUE(group_id)
);

-- 檔案表
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    submission_id INTEGER REFERENCES submissions(id) ON DELETE CASCADE,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- image, video, document
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 管理員表
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin', -- admin, super_admin
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- 系統設定表
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引優化
CREATE INDEX idx_submissions_group_id ON submissions(group_id);
CREATE INDEX idx_submissions_task_id ON submissions(task_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_files_submission_id ON files(submission_id);
CREATE INDEX idx_files_file_type ON files(file_type);

-- 插入預設組別數據 (2-25組，第1組保留給 StoryMap)
INSERT INTO groups (group_number, group_name) 
SELECT generate_series(2, 25), 
       CONCAT('第', generate_series(2, 25), '組');

-- 插入預設任務數據
INSERT INTO tasks (task_key, title_zh, title_en, description_zh, description_en) VALUES
('task1', '大稻埕教學素材收集家', 'Dadaocheng Teaching Material Collector', 
 '從真實場域中提取教學資源，思考如何將大稻埕的學習素材應用於教學領域。',
 'Extract teaching resources from real venues and consider how to apply Dadaocheng learning materials to teaching fields.'),
('task2', '大稻埕主題地圖規劃師', 'Dadaocheng Themed Map Planner',
 '規劃具主題性的導覽路線，發掘大稻埕的特色與趣味。',
 'Plan thematic tour routes and discover the characteristics and interests of Dadaocheng.'),
('task3', '大稻埕前世今生探究者', 'Dadaocheng Past and Present Explorer',
 '深入了解地方環境與歷史縱深，探究大稻埕的過去與現在。',
 'Deeply understand the local environment and historical depth, exploring the past and present of Dadaocheng.'),
('task4', '大稻埕YouTuber', 'Dadaocheng YouTuber',
 '將戶外探訪內容轉化為具吸引力且能有效傳達資訊的影音介紹。',
 'Transform outdoor exploration content into attractive and effective audio-visual introductions.'),
('task5', '大稻埕自主學習者', 'Dadaocheng Self-directed Learner',
 '高度彈性的自主學習任務，依據個人興趣與專業規劃學習活動。',
 'Highly flexible self-directed learning tasks, planning learning activities based on personal interests and expertise.');

-- 插入預設系統設定
INSERT INTO settings (setting_key, setting_value, description) VALUES
('max_file_size', '104857600', '最大檔案大小限制 (100MB)'),
('allowed_file_types', 'jpg,jpeg,png,gif,mp4,mov,avi,pdf,doc,docx,ppt,pptx', '允許的檔案類型'),
('submission_deadline', NULL, '提交截止日期'),
('site_maintenance', 'false', '網站維護模式');

-- 觸發器：自動更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();