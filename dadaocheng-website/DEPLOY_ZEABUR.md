# 🚀 Zeabur 部署指南

## 📋 部署前準備

### 1. 確保專案結構正確
```
dadaocheng-website/
├── src/                    # 前端源碼
├── server/                 # 後端源碼
├── database/              # 資料庫結構
├── .zeabur.yaml          # Zeabur 配置
├── Dockerfile            # 前端容器
├── server/Dockerfile     # 後端容器
└── DEPLOY_ZEABUR.md     # 本部署指南
```

### 2. 推送程式碼到 Git 倉庫
```bash
git add .
git commit -m "feat: 完整後端整合，準備 Zeabur 部署"
git push origin main
```

## 🗄️ 步驟一：建立 PostgreSQL 資料庫

1. 登入 [Zeabur Dashboard](https://zeabur.com)
2. 點擊 "New Project" 創建新專案
3. 點擊 "Add Service" → "Database" → "PostgreSQL"
4. 選擇版本：**PostgreSQL 15**
5. 等待部署完成

### 📝 記錄資料庫連線資訊
部署完成後，記錄以下資訊：
- **Connection String**: `postgresql://username:password@host:port/database`
- **Host**: `xxxxxx.zeabur.com`
- **Port**: `5432`
- **Database**: `zeabur`
- **Username**: `root`
- **Password**: `xxxxxxxxxx`

## ⚙️ 步驟二：部署後端服務

### 1. 添加後端服務
1. 在同一專案中點擊 "Add Service"
2. 選擇 "Git Repository"
3. 連接您的 Git 倉庫
4. 選擇 **`server`** 目錄作為 Root Directory

### 2. 設定環境變數
在後端服務的 "Variables" 頁面添加：

```env
# 必要環境變數
DATABASE_URL=postgresql://root:QzBbLlfs0u8So5vM36J9h4rxY2DPm71t@tpe1.clusters.zeabur.com:31646/zeabur
NODE_ENV=production
PORT=5000
JWT_SECRET=dadaocheng-super-secure-jwt-secret-2024-kcis-production
ADMIN_PASSWORD=YourSecurePassword123!

# 可選環境變數
MAX_FILE_SIZE=104857600
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,mp4,mov,avi,pdf,doc,docx,ppt,pptx
ADMIN_USERNAME=admin
ADMIN_EMAIL=tsehungchen@kcislk.ntpc.edu.tw
```

### 3. 部署設定
- **Framework**: Node.js
- **Build Command**: `npm install --production`
- **Start Command**: `npm start`
- **Root Directory**: `server`

### 4. 等待部署完成
部署完成後會得到後端 URL，例如：
`https://dadaocheng-backend-xxxx.zeabur.app`

## 🌐 步驟三：部署前端服務

### 1. 添加前端服務
1. 在同一專案中再次點擊 "Add Service"
2. 選擇 "Git Repository"
3. 選擇同一個倉庫
4. 選擇 **根目錄** 作為 Root Directory

### 2. 設定環境變數
在前端服務的 "Variables" 頁面添加：

```env
# 前端環境變數
VITE_API_BASE_URL=https://dadaocheng-backend-xxxx.zeabur.app
VITE_APP_TITLE=大稻埕探索專案
VITE_APP_VERSION=1.0.0
```

### 3. 部署設定
- **Framework**: Static (Vite)
- **Build Command**: `npm install && npm run build`
- **Output Directory**: `dist`
- **Root Directory**: `/` (根目錄)

### 4. 更新後端 CORS 設定
前端部署完成後，更新後端環境變數：

```env
FRONTEND_URL=https://dadaocheng-frontend-xxxx.zeabur.app
```

## 🔗 步驟四：綁定自定義域名（可選）

### 1. 後端域名
- 進入後端服務設定
- 點擊 "Domains"
- 添加自定義域名，例如：`api.dadaocheng.com`

### 2. 前端域名  
- 進入前端服務設定
- 點擊 "Domains"
- 添加自定義域名，例如：`dadaocheng.com`

### 3. DNS 設定
在您的域名提供商設定 CNAME 記錄：
```
api.dadaocheng.com → dadaocheng-backend-xxxx.zeabur.app
dadaocheng.com → dadaocheng-frontend-xxxx.zeabur.app
```

## 🎯 步驟五：初始化資料庫

部署完成後，資料庫會自動初始化（透過 postinstall 腳本）。

### 預設管理員帳號
- **帳號**: admin
- **信箱**: tsehungchen@kcislk.ntpc.edu.tw
- **密碼**: 您在環境變數中設定的 `ADMIN_PASSWORD`

## ✅ 步驟六：測試部署

### 1. 健康檢查
訪問後端健康檢查端點：
```
https://your-backend-domain.zeabur.app/health
```

應該返回：
```json
{
  "status": "OK",
  "database": "Connected",
  "timestamp": "2025-07-03T00:00:00.000Z"
}
```

### 2. 前端測試
1. 訪問前端網址
2. 測試頁面導航
3. 嘗試上傳檔案
4. 查看成果展示

### 3. API 測試
測試主要 API 端點：
- `GET /api/groups/available` - 可用組別
- `GET /api/submissions` - 成果列表
- `GET /api/tasks` - 任務列表

## 🛠️ 環境變數清單

### 後端必要變數
| 變數名 | 說明 | 範例值 |
|--------|------|--------|
| `DATABASE_URL` | PostgreSQL 連線字串 | `postgresql://...` |
| `JWT_SECRET` | JWT 加密密鑰 | `your-secret-key` |
| `ADMIN_PASSWORD` | 管理員密碼 | `SecurePass123!` |
| `FRONTEND_URL` | 前端網址 (CORS) | `https://...zeabur.app` |

### 前端必要變數
| 變數名 | 說明 | 範例值 |
|--------|------|--------|
| `VITE_API_BASE_URL` | 後端 API 網址 | `https://...zeabur.app` |

## 🔧 故障排除

### 常見問題

#### 1. 資料庫連線失敗
**問題**: `Failed to connect to database`
**解決**: 檢查 `DATABASE_URL` 是否正確

#### 2. CORS 錯誤
**問題**: 前端無法連接後端
**解決**: 確認後端 `FRONTEND_URL` 設定正確

#### 3. 檔案上傳失敗
**問題**: 檔案上傳超時
**解決**: 檢查檔案大小是否超過 100MB 限制

#### 4. 管理員無法登入
**問題**: 密碼錯誤
**解決**: 檢查 `ADMIN_PASSWORD` 環境變數

### 日誌查看
在 Zeabur Dashboard 中：
1. 進入對應服務
2. 點擊 "Logs" 標籤
3. 查看即時日誌輸出

### 重新部署
如果需要重新部署：
1. 推送新的程式碼到 Git
2. Zeabur 會自動觸發重新部署
3. 或手動點擊 "Deploy" 按鈕

## 📊 效能優化建議

### 1. 資料庫
- 定期清理過期的提交記錄
- 監控連線池使用情況
- 考慮增加索引優化查詢

### 2. 檔案存儲
- 考慮使用 CDN 加速檔案下載
- 定期清理無用檔案
- 監控磁碟使用量

### 3. 前端
- 啟用 Gzip 壓縮
- 使用瀏覽器快取
- 考慮 Service Worker 離線支援

## 🔐 安全建議

### 1. 密碼安全
- 使用強密碼
- 定期更換 JWT_SECRET
- 定期更換管理員密碼

### 2. 網路安全
- 啟用 HTTPS
- 設定合適的 CORS 策略
- 監控異常請求

### 3. 檔案安全
- 限制檔案類型
- 掃描上傳檔案
- 設定檔案大小限制

## 📞 技術支援

如有問題，請聯絡：
- **技術支援**: tsehungchen@kcislk.ntpc.edu.tw
- **分機**: 8475

---

🎉 **部署完成後，您將擁有一個完全運作的大稻埕探索專案平台！**