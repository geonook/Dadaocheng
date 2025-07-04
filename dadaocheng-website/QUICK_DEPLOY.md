# ⚡ 快速部署指南

## 🎯 一鍵部署到 Zeabur

### 📂 1. 準備專案
您的專案已經完全準備好部署到 Zeabur！

### 🗄️ 2. 建立資料庫 (已完成)
✅ 您已經建立了 PostgreSQL 資料庫：
```
postgresql://root:QzBbLlfs0u8So5vM36J9h4rxY2DPm71t@tpe1.clusters.zeabur.com:31646/zeabur
```

### 🚀 3. 部署步驟

#### 後端部署
1. 在 Zeabur 添加服務 → Git Repository
2. 選擇 `server` 目錄
3. 設定環境變數：
```env
DATABASE_URL=postgresql://root:QzBbLlfs0u8So5vM36J9h4rxY2DPm71t@tpe1.clusters.zeabur.com:31646/zeabur
JWT_SECRET=dadaocheng-zeabur-jwt-secret-2024
ADMIN_PASSWORD=dadaocheng2024
```
4. 部署完成，記錄後端網址

#### 前端部署  
1. 在 Zeabur 添加服務 → Git Repository
2. 選擇根目錄
3. 設定環境變數：
```env
VITE_API_BASE_URL=https://your-backend-url.zeabur.app
```
4. 部署完成

### 🔗 4. 更新 CORS
在後端環境變數中添加：
```env
FRONTEND_URL=https://your-frontend-url.zeabur.app
```

## ✅ 完成！

🎉 **您的大稻埕探索專案現在已經在 Zeabur 上運行！**

### 📝 預設管理員帳號
- **帳號**: admin
- **信箱**: tsehungchen@kcislk.ntpc.edu.tw  
- **密碼**: dadaocheng2024

### 🌐 測試功能
1. 訪問前端網站
2. 測試檔案上傳
3. 查看成果展示
4. 登入管理後台

---

📞 **需要協助？** 聯絡 tsehungchen@kcislk.ntpc.edu.tw (分機8475)