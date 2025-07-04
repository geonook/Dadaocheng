# 前端 Dockerfile (靜態文件服務)
FROM node:18-alpine as builder

# 設定工作目錄
WORKDIR /app

# 複製 package.json
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製源碼
COPY . .

# 構建前端
RUN npm run build

# 生產階段 - 使用 nginx 服務靜態文件
FROM nginx:alpine

# 複製構建結果到 nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 複製 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"]