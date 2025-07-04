# Zeabur 後端部署指南

## 目前狀況
- 前端已部署：https://dadaoweb.zeabur.app/
- 後端需要重新部署：https://dadaoweb-backend.zeabur.app/ (目前是錯誤的應用)

## 重新部署後端到 Zeabur

### 1. 準備部署檔案
確保以下檔案在 `server/` 目錄中：
- `server.js` (主要伺服器檔案)
- `package.json` (依賴配置)
- `Dockerfile` (容器配置)
- `config/database.js` (資料庫配置)
- `routes/` (API 路由檔案)
- `scripts/` (資料庫初始化腳本)

### 2. 環境變數設定
在 Zeabur 後端專案中設定以下環境變數：

```bash
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://root:QzBbLlfs0u8So5vM36J9h4rxY2DPm71t@tpe1.clusters.zeabur.com:31646/zeabur
CORS_ORIGIN=https://dadaoweb.zeabur.app
```

### 3. 部署步驟

#### 方法 1: 使用 GitHub (推薦)
1. 將 `server/` 目錄推送到 GitHub 倉庫
2. 在 Zeabur 中連接 GitHub 倉庫
3. 選擇 `server/` 目錄作為根目錄
4. 設定環境變數
5. 部署

#### 方法 2: 使用 CLI 部署
```bash
# 在 server/ 目錄中
cd server/
npm install
zeabur deploy
```

### 4. 部署後確認
部署完成後，測試以下端點：

```bash
# 健康檢查
curl https://dadaoweb-backend.zeabur.app/health

# 可用組別
curl https://dadaoweb-backend.zeabur.app/api/groups/available

# 應該返回 JSON 格式的組別數據
```

### 5. 前端配置更新
前端已配置為使用 `https://dadaoweb-backend.zeabur.app` 作為生產環境 API 端點。

### 6. 資料庫初始化
後端會在啟動時自動運行 `npm run build:migrate` 來初始化資料庫表格。

## 故障排除

### 如果 API 端點返回 HTML 而不是 JSON
- 確認部署的是正確的應用程式
- 檢查 Zeabur 專案設定中的根目錄是否指向 `server/`
- 確認 `package.json` 中的 `main` 字段是 `server.js`

### 如果資料庫連接失敗
- 確認 `DATABASE_URL` 環境變數設定正確
- 檢查資料庫認證資訊
- 確認資料庫服務正在運行

### 如果 CORS 錯誤
- 確認 `CORS_ORIGIN` 環境變數設定為 `https://dadaoweb.zeabur.app`
- 檢查前端域名是否正確

## 本地測試
在重新部署前，可以本地測試：

```bash
cd server/
npm install
npm start
# 伺服器應該在 http://localhost:5001 運行
```

測試 API：
```bash
curl http://localhost:5001/api/groups/available
```

應該返回組別列表的 JSON 數據。