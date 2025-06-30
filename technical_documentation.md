# 大稻埕探索任務網站技術文檔

## 項目概述

這是一個為林口康橋國際學校大稻埕教師探索任務開發的完整Web應用系統，包含前端展示網站和後端API服務。

## 系統架構

### 前端 (React)
- **框架**: React 18 + Vite
- **部署地址**: https://mpofrwzl.manus.space
- **源碼路徑**: `/home/ubuntu/dadaocheng-website`

### 後端 (Flask)
- **框架**: Flask + SQLAlchemy
- **部署地址**: https://9yhyi3cqwyd7.manus.space
- **源碼路徑**: `/home/ubuntu/dadaocheng-backend`

## 前端技術棧

### 核心依賴
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "vite": "^6.3.5"
}
```

### 主要組件結構
```
src/
├── components/
│   ├── Navbar.jsx          # 導航欄組件
│   ├── HomePage.jsx        # 首頁組件
│   ├── UploadSection.jsx   # 上傳功能組件
│   ├── TasksSection.jsx    # 任務展示組件
│   ├── Sections.jsx        # 其他頁面組件
│   ├── AdminPanel.jsx      # 管理員面板
│   └── Footer.jsx          # 頁腳組件
├── contexts/
│   └── LanguageContext.jsx # 語言上下文
├── data/
│   └── translations.js     # 翻譯數據
└── assets/                 # 圖片資源
```

### 主要功能
1. **雙語支持**: 使用React Context實現中英文切換
2. **響應式設計**: CSS Grid和Flexbox布局
3. **檔案上傳**: FormData API處理多檔案上傳
4. **狀態管理**: React Hooks管理組件狀態

## 後端技術棧

### 核心依賴
```
Flask==3.1.1
Flask-SQLAlchemy==3.1.1
Flask-CORS==6.0.0
Werkzeug==3.1.3
```

### 項目結構
```
src/
├── main.py                 # 主應用文件
├── models/
│   └── submission.py       # 數據模型
└── routes/
    ├── user.py            # 用戶路由
    └── upload.py          # 上傳路由
```

### API端點

#### 上傳相關
- `POST /api/upload/submit` - 提交任務成果
- `GET /api/upload/submissions` - 獲取所有提交記錄
- `GET /api/upload/download/<file_id>` - 下載檔案

#### 數據模型

**TaskSubmission**
```python
class TaskSubmission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    team_name = db.Column(db.String(100), nullable=False)
    selected_task = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    submission_time = db.Column(db.DateTime, default=datetime.utcnow)
```

**UploadedFile**
```python
class UploadedFile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    submission_id = db.Column(db.Integer, db.ForeignKey('task_submission.id'))
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_size = db.Column(db.Integer, nullable=False)
    file_type = db.Column(db.String(50), nullable=False)
    upload_time = db.Column(db.DateTime, default=datetime.utcnow)
```

## 部署配置

### 前端部署
```bash
# 構建生產版本
pnpm run build

# 部署到Manus平台
service_deploy_frontend --framework react --project_dir /path/to/project
```

### 後端部署
```bash
# 安裝依賴
pip install -r requirements.txt

# 部署到Manus平台
service_deploy_backend --framework flask --project_dir /path/to/project
```

## 環境變量

### 後端環境變量
```
SECRET_KEY=asdf#FGSgvasgf$5$WGT
MAX_CONTENT_LENGTH=52428800  # 50MB
SQLALCHEMY_DATABASE_URI=sqlite:///database/app.db
SQLALCHEMY_TRACK_MODIFICATIONS=False
```

## 安全考量

1. **CORS配置**: 允許跨域請求以支援前後端分離
2. **檔案上傳限制**: 50MB檔案大小限制
3. **檔案類型驗證**: 僅允許特定格式檔案
4. **SQL注入防護**: 使用SQLAlchemy ORM
5. **XSS防護**: React自動轉義用戶輸入

## 性能優化

### 前端優化
1. **代碼分割**: Vite自動進行代碼分割
2. **圖片優化**: 壓縮和適當格式的圖片資源
3. **懶加載**: 組件按需載入
4. **快取策略**: 瀏覽器快取靜態資源

### 後端優化
1. **資料庫索引**: 主鍵和外鍵自動索引
2. **檔案存儲**: 本地檔案系統存儲
3. **請求處理**: Flask內建WSGI服務器

## 監控和日誌

### 錯誤處理
- 前端: try-catch包裝API調用
- 後端: Flask錯誤處理器

### 日誌記錄
- 上傳操作日誌
- 錯誤日誌記錄
- 性能監控

## 維護指南

### 常見維護任務
1. **資料庫備份**: 定期備份SQLite資料庫
2. **檔案清理**: 清理過期的上傳檔案
3. **日誌輪轉**: 管理應用日誌大小
4. **依賴更新**: 定期更新安全補丁

### 故障排除
1. **檢查服務狀態**: 確認前後端服務正常運行
2. **查看錯誤日誌**: 分析錯誤原因
3. **資料庫連接**: 檢查資料庫連接狀態
4. **檔案權限**: 確認檔案上傳目錄權限

## 擴展建議

### 功能擴展
1. **用戶認證**: 添加登入系統
2. **檔案預覽**: 在線預覽上傳檔案
3. **批量操作**: 批量下載和管理
4. **統計報表**: 提交統計和分析

### 技術升級
1. **資料庫**: 升級到PostgreSQL
2. **檔案存儲**: 使用雲端存儲服務
3. **快取**: 添加Redis快取
4. **監控**: 集成APM監控工具

---

*技術文檔版本: v1.0.0*
*最後更新: 2025-06-23*

---

## 計劃中架構升級 (v2.0)

為了提升系統的可擴展性、穩定性並簡化部署流程，我們計劃將專案遷移到一個完全基於雲的無伺服器架構。

### 核心目標
- **去本地化**: 移除對本地檔案系統和本地資料庫的依賴。
- **簡化部署**: 利用 PaaS (平台即服務) 實現自動化部署。
- **提升性能與可靠性**: 採用託管的雲服務。

### 新架構組件

1.  **部署平台 (Deployment Platform)**
    - **服務**: **Zeabur**
    - **說明**: Zeabur 將作為我們的一站式部署平台，用於託管前端和後端服務。它能自動偵測專案類型、處理建構和部署流程。

2.  **資料庫 (Database)**
    - **服務**: **Supabase (PostgreSQL)**
    - **說明**: 我們將使用由 Zeabur 託管的 Supabase 服務，它提供了一個功能齊全的 PostgreSQL 資料庫。這將取代目前的本地 SQLite 資料庫，解決資料持久性和部署時資料遺失的問題。

3.  **檔案儲存 (File Storage)**
    - **服務**: **Supabase Storage**
    - **說明**: Supabase 內建了與 S3 相容的檔案儲存服務。所有使用者上傳的檔案將直接從後端上傳到 Supabase Storage。API 將只在資料庫中儲存檔案的公開 URL，而不是檔案本身。這解決了本地儲存的限制，並減輕了後端伺服器的負載。

### 預期變更

- **後端 (`dadaocheng-backend`)**: 
  - 移除所有本地檔案系統操作 (`os.path`, `file.save`)。
  - 將 SQLAlchemy 的連接字串指向 Supabase PostgreSQL。
  - 引入 `supabase-py` 客戶端來處理檔案上傳邏輯。
  - 移除不再需要的下載端點 (`/api/upload/download/<file_id>`)。

- **前端 (`dadaocheng-website`)**: 
  - 檔案連結將直接指向從 API 獲取的 Supabase Storage URL。

- **環境變數**: 
  - 將引入新的環境變數來儲存 Supabase 的 URL 和金鑰。

## 主題導覽地圖功能 (Thematic Tour Map)

為了豐富網站的互動性和實用性，我們新增了主題式導覽地圖功能。此功能允許使用者根據特定主題（如傳統小吃）探索大稻埕地區的興趣點 (POI)。

### 資料來源
- **服務**: OpenStreetMap (OSM)
- **API**: Overpass API
- **說明**: 我們使用 Overpass API 來查詢 OSM 資料庫中位於大稻埕指定地理範圍內的 POI。這是一個公開且免費的唯讀 API，提供了強大的地理資料查詢功能。

### 資料擷取
- **腳本**: `scripts/fetch_osm_pois.py`
- **說明**: 此 Python 腳本負責向 Overpass API 發送查詢請求，擷取相關的 POI 資料，並將其處理後儲存為 `data/osm_pois.csv` 檔案。此腳本可以重複執行以更新資料。

### 前端實現
- **核心依賴**:
  - `leaflet`: 一個開源的互動式地圖 JavaScript 函式庫。
  - `react-leaflet`: 為 Leaflet 提供了 React 組件的封裝，讓我們可以輕易地在 React 應用中整合地圖。

- **地圖組件**:
  - `src/components/TraditionalFoodTour.jsx`: 這是一個專門為「傳統小吃」主題建立的 React 組件。它會讀取預先定義好的小吃店家清單（包含名稱、經緯度、簡介），並使用 `react-leaflet` 將這些點標記在地圖上，同時繪製出一條建議的遊覽路線。

- **整合方式**:
  - `TraditionalFoodTour` 組件被直接嵌入到 `App.jsx` 中，作為網站主頁的一部分展示給所有使用者。