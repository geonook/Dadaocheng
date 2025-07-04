/**
 * SuperClaude Performance Monitoring System
 * 企業級性能監控與優化工具
 */

// Web Vitals 監控
export const initPerformanceMonitoring = () => {
  if (typeof window === 'undefined') return;

  // 性能觀察器
  const performanceObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      // 記錄關鍵性能指標
      console.group('🚀 Performance Metrics');
      console.log(`${entry.name}: ${entry.duration.toFixed(2)}ms`);
      console.groupEnd();
    });
  });

  performanceObserver.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });

  // 檢測緩慢操作
  const longTaskObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.duration > 50) {
        console.warn('⚠️ Long Task Detected:', entry.duration.toFixed(2) + 'ms');
      }
    });
  });

  if ('PerformanceObserver' in window) {
    longTaskObserver.observe({ entryTypes: ['longtask'] });
  }
};

// 組件渲染性能監控
export const withPerformanceTracking = (WrappedComponent, componentName) => {
  return function PerformanceWrapper(props) {
    const startTime = performance.now();
    
    React.useEffect(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16.67) { // 超過一幀的時間
        console.warn(`🐌 Slow Render: ${componentName} took ${renderTime.toFixed(2)}ms`);
      }
    });

    return React.createElement(WrappedComponent, props);
  };
};

// 內存洩漏檢測
export const memoryLeakDetector = {
  init() {
    let lastUsedJSHeapSize = 0;
    
    setInterval(() => {
      if (performance.memory) {
        const currentMemory = performance.memory.usedJSHeapSize;
        const memoryIncrease = currentMemory - lastUsedJSHeapSize;
        
        if (memoryIncrease > 1048576) { // 1MB增長
          console.warn('🧠 Memory Leak Warning:', {
            current: (currentMemory / 1048576).toFixed(2) + 'MB',
            increase: (memoryIncrease / 1048576).toFixed(2) + 'MB'
          });
        }
        
        lastUsedJSHeapSize = currentMemory;
      }
    }, 30000); // 每30秒檢查一次
  }
};

// 網路效能監控
export const networkMonitor = {
  init() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      console.log('📶 Network Info:', {
        type: connection.effectiveType,
        downlink: connection.downlink + ' Mbps',
        rtt: connection.rtt + 'ms'
      });
      
      // 監聽網路變化
      connection.addEventListener('change', () => {
        console.log('📶 Network Changed:', connection.effectiveType);
      });
    }
  }
};

// 性能預算檢查
export const performanceBudget = {
  limits: {
    fcp: 1500,  // First Contentful Paint
    lcp: 2500,  // Largest Contentful Paint
    fid: 100,   // First Input Delay
    cls: 0.1,   // Cumulative Layout Shift
    bundleSize: 500000 // 500KB
  },
  
  check(metric, value) {
    const limit = this.limits[metric];
    if (value > limit) {
      console.error(`💥 Performance Budget Exceeded: ${metric} (${value} > ${limit})`);
      return false;
    }
    console.log(`✅ Performance Budget OK: ${metric} (${value} <= ${limit})`);
    return true;
  }
};