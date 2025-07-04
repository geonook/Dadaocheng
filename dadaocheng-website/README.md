# 大稻埕探索專案 - 完整後端整合版

🎯 康橋國際學校暑假共學課程三 - 大稻埕探索之旅任務平台

## 🚀 功能特色

### ✅ 完整後端支援
- **真實檔案上傳** - 支援圖片、影片、文件
- **PostgreSQL 資料庫** - 持久化數據存儲
- **25組管理系統** - 完整組別管理
- **成果展示系統** - 多用戶成果共享
- **管理員後台** - 成果審核與管理

### ✅ 前端功能
- **響應式設計** - 完美支援手機/平板/桌面
- **多語言支援** - 中文/英文切換
- **即時狀態更新** - 自動重新載入數據
- **錯誤處理** - 完善的錯誤提示

## 🛠️ 技術架構

### 前端
- **React 19.1.0** - 現代化前端框架
- **Tailwind CSS 4.1.7** - 響應式樣式
- **Vite 6.3.5** - 快速構建工具
- **React Router** - 多頁面路由

### 後端
- **Node.js + Express** - RESTful API 服務
- **PostgreSQL** - 關聯型資料庫
- **Multer + Sharp** - 檔案上傳與圖片處理
- **JWT** - 管理員認證
- **Helmet + CORS** - 安全防護

## 📁 專案結構

```
dadaocheng-website/
├── src/                    # 前端源碼
│   ├── components/         # React 組件
│   ├── contexts/          # 狀態管理
│   ├── pages/             # 頁面組件
│   ├── config/            # API 配置
│   └── data/              # 翻譯文件
├── server/                # 後端源碼
│   ├── routes/            # API 路由
│   ├── config/            # 資料庫配置
│   ├── scripts/           # 資料庫遷移
│   └── uploads/           # 檔案存儲
├── database/              # 資料庫結構
└── zeabur.json           # 部署配置
```

## 🔧 本地開發設定

### 1. 前端設定
```bash
# 安裝依賴
npm install

# 建立環境變數
cp .env.example .env

# 啟動開發服務器
npm run dev
```

### 2. 後端設定
```bash
# 進入後端目錄
cd server

# 安裝依賴
npm install

# 建立環境變數
cp .env.example .env

# 配置資料庫連線 (填入 Zeabur PostgreSQL 連線資訊)
# 編輯 .env 文件

# 執行資料庫遷移
npm run migrate

# 啟動後端服務
npm run dev
```

## 🌐 Zeabur 部署指南

### 1. 建立 PostgreSQL 資料庫

在 Zeabur 控制台：
1. 點擊 "Add Service" → "Database" → "PostgreSQL"
2. 選擇版本：**PostgreSQL 15**
3. 等待部署完成，取得連線資訊

### 2. 部署後端服務

1. 連接 Git 倉庫到 Zeabur
2. 選擇 `server` 目錄作為後端服務
3. 設定環境變數：

```env
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secure-secret-key
FRONTEND_URL=https://your-frontend-domain.zeabur.app
ADMIN_USERNAME=admin
ADMIN_EMAIL=tsehungchen@kcislk.ntpc.edu.tw
ADMIN_PASSWORD=your-admin-password
```

4. 部署完成後執行資料庫遷移：
```bash
npm run migrate
```

### 3. 部署前端服務

1. 在 Zeabur 添加新的服務，選擇根目錄
2. 設定環境變數：

```env
VITE_API_BASE_URL=https://your-backend-domain.zeabur.app
```

3. 部署完成！

## 📊 資料庫結構

### 核心資料表
- **groups** - 組別管理 (2-25組)
- **tasks** - 五大任務定義
- **submissions** - 成果提交記錄
- **files** - 檔案存儲記錄
- **admins** - 管理員帳號

### 特色功能
- **自動統計** - 即時計算上傳進度
- **檔案類型檢查** - 支援多種格式
- **圖片自動處理** - 壓縮與優化
- **審核工作流** - 管理員審核機制

## 🔐 管理員功能

### 預設管理員帳號
- **帳號**：admin
- **信箱**：tsehungchen@kcislk.ntpc.edu.tw
- **密碼**：設定在環境變數中

### 管理功能
- 查看所有提交成果
- 審核/拒絕成果
- 統計資料儀表板
- 檔案管理

## 🎯 API 端點

### 公開端點
- `GET /api/submissions` - 取得所有成果
- `POST /api/submissions` - 提交成果
- `GET /api/groups/available` - 可用組別
- `GET /api/files/:id/download` - 檔案下載

### 管理員端點
- `POST /api/admin/login` - 管理員登入
- `GET /api/admin/submissions` - 管理後台
- `PUT /api/admin/submissions/:id/status` - 更新狀態

## 🚦 使用流程

### 學生端
1. 瀏覽首頁了解任務
2. 選擇組別和任務
3. 上傳成果檔案和 YouTube 連結
4. 查看成果展示頁面

### 管理員端
1. 登入管理後台
2. 審核學生提交的成果
3. 查看統計數據
4. 管理檔案下載

## 🔧 技術特點

### 安全性
- JWT 令牌認證
- 檔案類型驗證
- SQL 注入防護
- CORS 跨域保護

### 效能
- 圖片自動壓縮
- 檔案大小限制 (100MB)
- 連線池管理
- 靜態資源快取

### 可靠性
- 錯誤邊界處理
- 資料庫交易
- 檔案上傳失敗回滾
- 健康檢查端點

## 📝 注意事項

1. **資料庫連線**：確保 Zeabur PostgreSQL 連線資訊正確
2. **檔案存儲**：檔案存儲在服務器本地，重新部署會清除
3. **管理員密碼**：首次部署後請立即修改預設密碼
4. **環境變數**：生產環境請使用強密碼和安全金鑰

## 🆘 故障排除

### 常見問題
- **資料庫連線失敗**：檢查 DATABASE_URL 是否正確
- **檔案上傳失敗**：確認檔案大小和類型限制
- **前端無法連接後端**：檢查 VITE_API_BASE_URL 設定
- **管理員無法登入**：確認管理員帳號是否已創建

### 支援聯絡
- **技術支援**：tsehungchen@kcislk.ntpc.edu.tw
- **分機**：8475

---

🎉 **專案已完成整合真實後端！現在支援完整的檔案上傳和多用戶協作功能。**