import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// SuperClaude 監控系統初始化
import { monitoring } from './utils/monitoring.js'
import { initPerformanceMonitoring } from './utils/performance.js'

// 啟動監控
initPerformanceMonitoring()

// React 18 並發模式優化
const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
