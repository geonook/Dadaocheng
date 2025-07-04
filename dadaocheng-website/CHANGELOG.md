# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-01-04

### Added
- **StoryMap Integration**: 完整的 Esri StoryMap 嵌入系統
  - 第1組特殊展示區域，支援響應式 16:9 iframe
  - 專用 StoryMap 頁面 (`/storymap`, `/group1`)
  - 全屏瀏覽功能和使用者指引
  - 金色漸變主題設計
- **完整後端整合**: Flask API 和 PostgreSQL 資料庫
  - 檔案上傳和成果管理系統
  - 25組成果展示和統計功能
  - RESTful API 設計
- **雲端部署支援**: Zeabur 平台部署設定
  - Docker 容器化設定
  - 自動化部署腳本
  - 環境變數管理
- **性能優化**: 
  - 懶載入和交叉觀察器
  - 響應式圖片處理
  - 代碼分割和打包優化
- **多語言支援**: 完整的中英文界面
- **現代化 UI 組件**: 
  - Radix UI 組件庫
  - Tailwind CSS 樣式系統
  - 動畫和互動效果

### Changed
- **專案架構重構**: 從靜態網站升級為全端應用
- **導航系統更新**: 新增 StoryMap 特殊導航項目
- **首頁設計**: 添加醒目的 StoryMap 入口按鈕
- **成果展示頁面**: 重新設計為動態內容管理
- **錯誤處理**: 完善的錯誤邊界和異常處理

### Fixed
- **ResultsDisplay 錯誤**: 修復統計資料屬性名稱不匹配
- **Context 穩定性**: 改進 React Context 的錯誤處理
- **響應式設計**: 修復各種螢幕尺寸的顯示問題
- **路由配置**: 優化 React Router 設定

### Technical Details
- **Frontend**: React 19.1.0, Vite 6.3.5, Tailwind CSS 4.1.7
- **Backend**: Flask 2.3.3, SQLAlchemy 3.0.5, PostgreSQL
- **Deployment**: Zeabur, Docker, Nginx
- **DevOps**: 環境變數管理、自動化部署、健康檢查

## [1.0.0] - 2024-12-XX

### Added
- 初始版本的大稻埕探索網站
- 基本的任務系統和靜態內容
- 傳統美食導覽功能
- POI 分類系統
- GeoJSON 地圖資料

---

## 版本命名規則

- **主版本號 (Major)**: 重大功能變更或不相容更新
- **次版本號 (Minor)**: 新增功能，向後相容
- **修正版本號 (Patch)**: 錯誤修復，向後相容

## 發布說明

本專案採用語義化版本管理，每個版本都包含：
1. 功能更新說明
2. 技術架構變更
3. 錯誤修復記錄
4. 部署和設定指引

更多詳細資訊請參考各版本的 Git 標籤和提交紀錄。