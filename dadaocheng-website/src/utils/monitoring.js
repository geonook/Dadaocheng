/**
 * SuperClaude 企業級監控系統
 * 錯誤追蹤、性能監控、用戶行為分析
 */

// 錯誤收集器
class ErrorCollector {
  constructor() {
    this.errors = [];
    this.maxErrors = 100;
    this.init();
  }

  init() {
    // 全局錯誤捕獲
    window.addEventListener('error', (event) => {
      this.collect({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    });

    // Promise 錯誤捕獲
    window.addEventListener('unhandledrejection', (event) => {
      this.collect({
        type: 'promise',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    });

    // 資源載入錯誤
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.collect({
          type: 'resource',
          message: `Failed to load ${event.target.tagName}: ${event.target.src || event.target.href}`,
          element: event.target.tagName,
          source: event.target.src || event.target.href,
          timestamp: Date.now(),
          url: window.location.href
        });
      }
    }, true);
  }

  collect(error) {
    // 添加環境信息
    const enrichedError = {
      ...error,
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
      buildVersion: import.meta.env.VITE_BUILD_VERSION || 'unknown',
      environment: import.meta.env.MODE,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connection: this.getConnectionInfo()
    };

    this.errors.push(enrichedError);

    // 保持錯誤數量限制
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // 實時上報關鍵錯誤
    if (this.isCriticalError(error)) {
      this.reportImmediately(enrichedError);
    }

    console.error('🚨 Error Collected:', enrichedError);
  }

  isCriticalError(error) {
    const criticalPatterns = [
      /chunk.*failed/i,
      /loading.*failed/i,
      /network.*error/i,
      /out of memory/i
    ];
    
    return criticalPatterns.some(pattern => 
      pattern.test(error.message || '')
    );
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('dadaocheng-session-id');
    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36);
      sessionStorage.setItem('dadaocheng-session-id', sessionId);
    }
    return sessionId;
  }

  getUserId() {
    return localStorage.getItem('dadaocheng-user-id') || 'anonymous';
  }

  getConnectionInfo() {
    if ('connection' in navigator) {
      const conn = navigator.connection;
      return {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
        saveData: conn.saveData
      };
    }
    return null;
  }

  async reportImmediately(error) {
    try {
      // 這裡可以整合真實的錯誤報告服務
      // 例如 Sentry, LogRocket, 或自建服務
      console.log('📡 Reporting critical error:', error);
      
      // 示例：發送到後端
      if (import.meta.env.PROD) {
        fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(error)
        }).catch(console.warn);
      }
    } catch (reportError) {
      console.warn('Failed to report error:', reportError);
    }
  }

  getErrors() {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
  }
}

// 性能監控器
class PerformanceMonitor {
  constructor() {
    this.metrics = [];
    this.observers = [];
    this.init();
  }

  init() {
    // Core Web Vitals 監控
    this.observeWebVitals();
    
    // 自定義性能指標
    this.observeCustomMetrics();
    
    // 資源性能監控
    this.observeResourceTiming();
  }

  observeWebVitals() {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.recordMetric('LCP', entry.startTime, {
          element: entry.element?.tagName,
          url: entry.url
        });
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.recordMetric('FID', entry.processingStart - entry.startTime, {
          eventType: entry.name
        });
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      let clsValue = 0;
      list.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      if (clsValue > 0) {
        this.recordMetric('CLS', clsValue);
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }

  observeCustomMetrics() {
    // 頁面載入性能
    window.addEventListener('load', () => {
      const timing = performance.getEntriesByType('navigation')[0];
      
      this.recordMetric('DOM_CONTENT_LOADED', timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart);
      this.recordMetric('LOAD_COMPLETE', timing.loadEventEnd - timing.loadEventStart);
      this.recordMetric('TOTAL_LOAD_TIME', timing.loadEventEnd - timing.fetchStart);
    });

    // React 渲染性能
    if (window.React && window.React.Profiler) {
      this.setupReactProfiler();
    }
  }

  observeResourceTiming() {
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 1000) { // 超過1秒的資源
          this.recordMetric('SLOW_RESOURCE', entry.duration, {
            name: entry.name,
            type: entry.initiatorType,
            size: entry.transferSize
          });
        }
      });
    }).observe({ entryTypes: ['resource'] });
  }

  setupReactProfiler() {
    // React Profiler 整合
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      const originalOnCommit = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot;
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot = (id, root, priorityLevel) => {
        const fiberRoot = root.current;
        if (fiberRoot.actualDuration > 16) { // 超過一幀
          this.recordMetric('REACT_SLOW_RENDER', fiberRoot.actualDuration, {
            componentName: fiberRoot.elementType?.name || 'Unknown'
          });
        }
        if (originalOnCommit) originalOnCommit(id, root, priorityLevel);
      };
    }
  }

  recordMetric(name, value, metadata = {}) {
    const metric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connection: this.getConnectionInfo(),
      ...metadata
    };

    this.metrics.push(metric);

    // 性能預算檢查
    this.checkPerformanceBudget(name, value);

    console.log(`📊 Performance Metric: ${name} = ${value}ms`, metric);
  }

  checkPerformanceBudget(metricName, value) {
    const budgets = {
      'LCP': 2500,
      'FID': 100,
      'CLS': 0.1,
      'TOTAL_LOAD_TIME': 3000,
      'DOM_CONTENT_LOADED': 1500
    };

    const budget = budgets[metricName];
    if (budget && value > budget) {
      console.warn(`💥 Performance Budget Exceeded: ${metricName} (${value} > ${budget})`);
      
      // 可以觸發警報或自動優化
      this.triggerPerformanceAlert(metricName, value, budget);
    }
  }

  triggerPerformanceAlert(metricName, actualValue, budgetValue) {
    // 發送性能警報
    const alert = {
      type: 'performance_budget_exceeded',
      metric: metricName,
      actual: actualValue,
      budget: budgetValue,
      timestamp: Date.now(),
      url: window.location.href
    };

    // 可以發送到監控服務
    console.error('🚨 Performance Alert:', alert);
  }

  getConnectionInfo() {
    if ('connection' in navigator) {
      const conn = navigator.connection;
      return {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt
      };
    }
    return null;
  }

  getMetrics() {
    return [...this.metrics];
  }

  clearMetrics() {
    this.metrics = [];
  }
}

// 用戶行為分析
class UserBehaviorTracker {
  constructor() {
    this.events = [];
    this.sessionStart = Date.now();
    this.init();
  }

  init() {
    this.trackPageViews();
    this.trackClicks();
    this.trackScrolling();
    this.trackTimeOnPage();
  }

  trackPageViews() {
    this.track('page_view', {
      url: window.location.href,
      referrer: document.referrer,
      timestamp: Date.now()
    });

    // 單頁應用路由變化
    let lastUrl = window.location.href;
    new MutationObserver(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        this.track('route_change', {
          from: lastUrl,
          to: currentUrl,
          timestamp: Date.now()
        });
        lastUrl = currentUrl;
      }
    }).observe(document, { subtree: true, childList: true });
  }

  trackClicks() {
    document.addEventListener('click', (event) => {
      const element = event.target;
      const elementInfo = {
        tagName: element.tagName,
        className: element.className,
        id: element.id,
        text: element.textContent?.slice(0, 50),
        href: element.href
      };

      this.track('click', {
        element: elementInfo,
        position: { x: event.clientX, y: event.clientY },
        timestamp: Date.now()
      });
    });
  }

  trackScrolling() {
    let maxScroll = 0;
    
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // 記錄滾動里程碑
        if (maxScroll % 25 === 0) {
          this.track('scroll_milestone', {
            percent: maxScroll,
            timestamp: Date.now()
          });
        }
      }
    });
  }

  trackTimeOnPage() {
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Date.now() - this.sessionStart;
      this.track('session_end', {
        duration: timeOnPage,
        timestamp: Date.now()
      });
    });
  }

  track(eventName, data) {
    const event = {
      name: eventName,
      data,
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.events.push(event);
    console.log(`📈 User Event: ${eventName}`, event);
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('dadaocheng-session-id');
    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36);
      sessionStorage.setItem('dadaocheng-session-id', sessionId);
    }
    return sessionId;
  }

  getUserId() {
    return localStorage.getItem('dadaocheng-user-id') || 'anonymous';
  }

  getEvents() {
    return [...this.events];
  }
}

// 統一監控系統
class MonitoringSystem {
  constructor() {
    this.errorCollector = new ErrorCollector();
    this.performanceMonitor = new PerformanceMonitor();
    this.behaviorTracker = new UserBehaviorTracker();
    
    console.log('🎯 SuperClaude Monitoring System Initialized');
  }

  generateReport() {
    return {
      errors: this.errorCollector.getErrors(),
      performance: this.performanceMonitor.getMetrics(),
      behavior: this.behaviorTracker.getEvents(),
      timestamp: Date.now(),
      url: window.location.href
    };
  }

  exportReport() {
    const report = this.generateReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monitoring-report-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }
}

// 全局實例
export const monitoring = new MonitoringSystem();

// 開發者工具
if (import.meta.env.DEV) {
  window.__DADAOCHENG_MONITORING__ = monitoring;
  console.log('🛠️ Monitoring tools available at window.__DADAOCHENG_MONITORING__');
}