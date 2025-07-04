# 🚀 Zeabur 後端部署完整指南

## 📁 準備完成的文件
我已經為您準備好所有必要的部署文件：

### 部署目錄：`zeabur-deploy/`
```
zeabur-deploy/
├── .env                    # 生產環境變數
├── .zeabur.yaml           # Zeabur 配置文件
├── Dockerfile             # Docker 容器配置
├── DEPLOY.md             # 詳細部署說明
├── server.js             # 主要伺服器文件
├── package.json          # 依賴配置
├── config/               # 資料庫配置
├── routes/               # API 路由
├── scripts/              # 資料庫初始化腳本
└── uploads/              # 檔案上傳目錄
```

## 🎯 部署選項

### 選項 1：GitHub + Zeabur (推薦)

#### 步驟 1：推送到 GitHub
```bash
cd zeabur-deploy/

# 設定 GitHub 倉庫 (請替換為您的倉庫 URL)
git remote add origin https://github.com/YOUR_USERNAME/dadaocheng-backend.git
git branch -M main
git push -u origin main
```

#### 步驟 2：在 Zeabur 中部署
1. 訪問 [Zeabur Dashboard](https://dash.zeabur.com/)
2. 點擊 "New Project"
3. 選擇 "Deploy from GitHub"
4. 選擇您剛推送的倉庫
5. Zeabur 會自動檢測到 `.zeabur.yaml` 配置
6. 點擊 "Deploy"

### 選項 2：Zeabur CLI 直接部署

#### 安裝 Zeabur CLI
```bash
npm install -g @zeabur/cli
```

#### 直接部署
```bash
cd zeabur-deploy/
zeabur auth login
zeabur deploy
```

## ⚙️ 環境變數配置
所有必要的環境變數已在 `.zeabur.yaml` 中預先配置：

```yaml
env:
  NODE_ENV: production
  PORT: 8080
  DATABASE_URL: postgresql://root:QzBbLlfs0u8So5vM36J9h4rxY2DPm71t@tpe1.clusters.zeabur.com:31646/zeabur
  FRONTEND_URL: https://dadaoweb.zeabur.app
  CORS_ORIGIN: https://dadaoweb.zeabur.app
  JWT_SECRET: dadaocheng-super-secure-jwt-secret-2024-kcis
  # ... 其他配置
```

## 🧪 部署後驗證

### 1. 健康檢查
```bash
curl https://dadaoweb-backend.zeabur.app/health
```

應該返回：
```json
{
  "status": "OK",
  "timestamp": "2025-07-03T...",
  "database": "Connected",
  "uptime": 123.456,
  "version": "v18.x.x"
}
```

### 2. API 測試
```bash
curl https://dadaoweb-backend.zeabur.app/api/groups/available
```

應該返回組別列表：
```json
{
  "success": true,
  "data": [
    {"value": 2, "label": {"zh": "第2組", "en": "Group 2"}},
    {"value": 3, "label": {"zh": "第3組", "en": "Group 3"}},
    // ... 更多組別
  ],
  "count": 24
}
```

### 3. 前端測試
- 訪問 https://dadaoweb.zeabur.app/
- 測試組別下拉選單是否正常選擇
- 嘗試上傳成果功能

## 🔧 故障排除

### 如果 API 返回 HTML 而不是 JSON
- 確認部署的是 `zeabur-deploy/` 目錄
- 檢查 Zeabur 專案設定中的根目錄
- 確認 `package.json` 中的 `main` 字段是 `server.js`

### 如果資料庫連接失敗
- 檢查 `DATABASE_URL` 環境變數
- 確認資料庫服務正在運行
- 查看 Zeabur 日誌中的錯誤訊息

### 如果 CORS 錯誤
- 確認 `FRONTEND_URL` 和 `CORS_ORIGIN` 設定正確
- 檢查前端域名是否與配置一致

## 📋 部署檢查清單

- [ ] 所有文件已複製到 `zeabur-deploy/` 目錄
- [ ] Git 倉庫已初始化並推送到 GitHub
- [ ] Zeabur 專案已創建並連接到 GitHub
- [ ] 環境變數已正確配置
- [ ] 部署成功完成
- [ ] 健康檢查端點正常回應
- [ ] API 端點返回正確的 JSON 數據
- [ ] 前端可以正常連接到後端
- [ ] 組別下拉選單功能正常
- [ ] 檔案上傳功能正常

## 🆘 如需協助
如果遇到任何問題，請：
1. 檢查 Zeabur 部署日誌
2. 驗證環境變數設定
3. 測試本地部署是否正常
4. 確認資料庫連接

部署成功後，您的後端 API 應該在 `https://dadaoweb-backend.zeabur.app` 上正常運行！