import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './config/database.js';

// 路由引入
import submissionRoutes from './routes/submissions.js';
import fileRoutes from './routes/files.js';
import groupRoutes from './routes/groups.js';
import taskRoutes from './routes/tasks.js';
import adminRoutes from './routes/admin.js';

// 環境變數配置
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// 中間件配置
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
}));

app.use(compression());

// CORS 配置
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:5173',
    process.env.FRONTEND_URL,
    /\.zeabur\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 請求日誌
app.use(morgan('combined'));

// 請求限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100, // 限制每個 IP 15分鐘內最多 100 個請求
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// 上傳限制 (更嚴格)
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 上傳更嚴格限制
  message: 'Too many upload requests, please try again later.'
});
app.use('/api/submissions', uploadLimiter);

// JSON 解析
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 靜態檔案服務
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API 路由
app.use('/api/submissions', submissionRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

// 健康檢查端點
app.get('/health', async (req, res) => {
  try {
    const dbHealthy = await testConnection();
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: dbHealthy ? 'Connected' : 'Disconnected',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// 根路由
app.get('/', (req, res) => {
  res.json({
    message: '🎯 大稻埕探索專案 API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      submissions: '/api/submissions',
      files: '/api/files',
      groups: '/api/groups',
      tasks: '/api/tasks',
      admin: '/api/admin'
    },
    documentation: 'https://github.com/your-repo/api-docs'
  });
});

// 404 處理
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist on this server.`,
    availableRoutes: [
      'GET /health',
      'GET /api/submissions',
      'POST /api/submissions',
      'GET /api/groups',
      'GET /api/tasks'
    ]
  });
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  
  // Multer 錯誤 (檔案上傳)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'File too large',
      message: 'File size exceeds the maximum limit of 100MB'
    });
  }
  
  // 資料庫錯誤
  if (err.code && err.code.startsWith('23')) {
    return res.status(400).json({
      error: 'Database constraint violation',
      message: 'The data violates database constraints'
    });
  }
  
  // JWT 錯誤
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      message: 'The provided token is invalid'
    });
  }
  
  // 通用錯誤
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 啟動伺服器
const startServer = async () => {
  try {
    // 測試資料庫連線
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Exiting...');
      process.exit(1);
    }
    
    // 啟動伺服器
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`
🚀 大稻埕探索專案後端服務已啟動!
📍 伺服器地址: http://localhost:${PORT}
📍 API 端點: http://localhost:${PORT}/api
📍 健康檢查: http://localhost:${PORT}/health
🗄️  資料庫: PostgreSQL (${process.env.NODE_ENV})
⏰ 啟動時間: ${new Date().toLocaleString('zh-TW')}
      `);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// 優雅關閉
process.on('SIGTERM', () => {
  console.log('👋 Received SIGTERM. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 Received SIGINT. Shutting down gracefully...');
  process.exit(0);
});

// 啟動
startServer();