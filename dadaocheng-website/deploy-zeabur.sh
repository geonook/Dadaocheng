#!/bin/bash

echo "🚀 準備 Zeabur 部署..."

# 1. 建立部署目錄
mkdir -p zeabur-deploy
cd zeabur-deploy

# 2. 複製後端文件
echo "📁 複製後端文件..."
cp -r ../server/* .
cp ../server/.env.production .env

# 3. 確保必要文件存在
echo "📋 檢查必要文件..."
if [ ! -f "package.json" ]; then
    echo "❌ package.json 不存在!"
    exit 1
fi

if [ ! -f "server.js" ]; then
    echo "❌ server.js 不存在!"
    exit 1
fi

if [ ! -f "Dockerfile" ]; then
    echo "❌ Dockerfile 不存在!"
    exit 1
fi

# 4. 安裝依賴
echo "📦 安裝依賴..."
npm install --production

# 5. 建立 .zeabur.yaml 配置
echo "⚙️ 建立 Zeabur 配置..."
cat > .zeabur.yaml << EOF
version: "1"
name: dadaocheng-backend
services:
  backend:
    build:
      dockerfile: Dockerfile
    env:
      NODE_ENV: production
      PORT: 8080
      DATABASE_URL: postgresql://root:QzBbLlfs0u8So5vM36J9h4rxY2DPm71t@tpe1.clusters.zeabur.com:31646/zeabur
      FRONTEND_URL: https://dadaoweb.zeabur.app
      CORS_ORIGIN: https://dadaoweb.zeabur.app
      JWT_SECRET: dadaocheng-super-secure-jwt-secret-2024-kcis
      MAX_FILE_SIZE: 104857600
      UPLOAD_DIR: uploads
      ALLOWED_FILE_TYPES: jpg,jpeg,png,gif,mp4,mov,avi,pdf,doc,docx,ppt,pptx
      ADMIN_USERNAME: admin
      ADMIN_EMAIL: tsehungchen@kcislk.ntpc.edu.tw
      ADMIN_PASSWORD: dadaocheng2024
    ports:
      - "8080:8080"
    volumes:
      - uploads:/app/uploads
EOF

# 6. 建立部署說明
echo "📝 建立部署說明..."
cat > DEPLOY.md << EOF
# Zeabur 部署指南

## 部署步驟

### 方法 1: 使用 Git (推薦)
1. 將此目錄推送到 GitHub 倉庫
2. 在 Zeabur 中連接 GitHub 倉庫
3. 選擇此目錄作為根目錄
4. 部署會自動開始

### 方法 2: 使用 Zeabur CLI
\`\`\`bash
zeabur deploy
\`\`\`

## 環境變數
以下環境變數已在 .zeabur.yaml 中配置：
- NODE_ENV=production
- PORT=8080
- DATABASE_URL=(PostgreSQL 連接字串)
- FRONTEND_URL=https://dadaoweb.zeabur.app
- 其他必要配置...

## 驗證部署
部署完成後測試：
- 健康檢查: https://your-backend-url/health
- API 測試: https://your-backend-url/api/groups/available

## 故障排除
如果遇到問題，檢查：
1. 環境變數是否正確設定
2. 資料庫連接是否正常
3. CORS 設定是否包含前端域名
EOF

echo "✅ Zeabur 部署文件準備完成!"
echo "📁 部署目錄: $(pwd)"
echo ""
echo "下一步:"
echo "1. 將此目錄推送到 GitHub"
echo "2. 在 Zeabur 中連接倉庫並部署"
echo "3. 或使用 'zeabur deploy' 直接部署"