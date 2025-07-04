# Zeabur 後端 Dockerfile
FROM node:18-alpine

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm install --production

# 複製應用程式碼
COPY . .

# 創建上傳目錄
RUN mkdir -p uploads/images uploads/videos uploads/documents

# 設定權限
RUN chmod -R 755 uploads

# 暴露端口
EXPOSE 5000

# 健康檢查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:' + (process.env.PORT || 5000) + '/health').then(() => process.exit(0)).catch(() => process.exit(1))"

# 啟動應用
CMD ["npm", "start"]