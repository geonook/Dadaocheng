/**
 * SuperClaude 高性能 Vite 配置
 * Bundle 分割、樹搖、壓縮優化
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { visualizer } from 'rollup-plugin-visualizer'
import { splitVendorChunkPlugin } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react({
      // React Fast Refresh 優化
      fastRefresh: true
    }),
    
    tailwindcss(),
    
    // Bundle 分析器
    process.env.ANALYZE && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  build: {
    // 目標瀏覽器
    target: 'es2020',
    
    // 最小化配置
    minify: 'esbuild',
    
    // 源碼映射 (僅開發環境)
    sourcemap: process.env.NODE_ENV !== 'production',
    
    // Chunk 大小警告限制
    chunkSizeWarningLimit: 600,
    
    rollupOptions: {
      output: {
        // 智能分包策略
        manualChunks(id) {
          // React 核心庫
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          
          // Radix UI 組件
          if (id.includes('@radix-ui')) {
            return 'ui-vendor';
          }
          
          // 圖標和動畫
          if (id.includes('lucide-react') || id.includes('framer-motion')) {
            return 'animation-vendor';
          }
          
          // 地圖相關 (較大的庫)
          if (id.includes('leaflet')) {
            return 'map-vendor';
          }
          
          // 其他 node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        
        // 文件命名規則
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? 
            chunkInfo.facadeModuleId.split('/').pop().replace(/\.[^.]*$/, '') : 
            'chunk';
          return `assets/${facadeModuleId}-[hash].js`;
        },
        
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash].${ext}`;
          }
          
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].${ext}`;
          }
          
          return `assets/[name]-[hash].${ext}`;
        }
      },
      
      // 外部依賴 (如果需要 CDN)
      external: process.env.USE_CDN ? [
        // 'react',
        // 'react-dom'
      ] : []
    },
    
    // CSS 代碼分割
    cssCodeSplit: true,
    
    // 實驗性功能
    reportCompressedSize: true,
    
    // esbuild 配置
    esbuild: {
      // 移除調試代碼
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
      
      // 法律注釋處理
      legalComments: 'none'
    }
  },
  
  // 優化依賴處理
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog'
    ],
    exclude: [
      // 排除較大的可選依賴
      'leaflet',
      'react-leaflet'
    ]
  },
  
  // 服務器配置
  server: {
    port: 3000,
    open: true,
    cors: true,
    
    // HMR 優化
    hmr: {
      overlay: true
    }
  },
  
  // 預覽服務器配置
  preview: {
    port: 4173,
    open: true
  },
  
  // 實驗性功能
  experimental: {
    // 渲染內建 URL
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `/${filename}` };
      } else {
        return { relative: true };
      }
    }
  },
  
  // 環境變量配置
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __VERSION__: JSON.stringify(process.env.npm_package_version)
  }
});