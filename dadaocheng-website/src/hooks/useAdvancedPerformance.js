/**
 * SuperClaude 高級性能優化 Hooks
 * 包含防抖、節流、虛擬化、預載入等優化策略
 */
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// 智能防抖 Hook
export const useSmartDebounce = (value, delay = 300, immediate = false) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (immediate && !timeoutRef.current) {
      setDebouncedValue(value);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [value, delay, immediate]);

  return debouncedValue;
};

// 自適應節流 Hook
export const useAdaptiveThrottle = (callback, limit = 16) => {
  const lastRun = useRef(Date.now());
  const timeoutId = useRef(null);

  return useCallback((...args) => {
    const now = Date.now();
    
    if (now - lastRun.current >= limit) {
      callback(...args);
      lastRun.current = now;
    } else {
      clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(() => {
        callback(...args);
        lastRun.current = Date.now();
      }, limit - (now - lastRun.current));
    }
  }, [callback, limit]);
};

// 虛擬化滾動 Hook
export const useVirtualization = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex),
      offsetY: startIndex * itemHeight,
      totalHeight: items.length * itemHeight
    };
  }, [items, itemHeight, containerHeight, scrollTop]);

  const handleScroll = useAdaptiveThrottle((e) => {
    setScrollTop(e.target.scrollTop);
  }, 16);

  return { visibleItems, handleScroll };
};

// 預載入管理 Hook
export const usePreloader = (resources = []) => {
  const [loadedResources, setLoadedResources] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const preloadResource = useCallback((url, type = 'image') => {
    return new Promise((resolve, reject) => {
      if (type === 'image') {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
      } else if (type === 'script') {
        const script = document.createElement('script');
        script.onload = () => resolve(url);
        script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
        script.src = url;
        document.head.appendChild(script);
      }
    });
  }, []);

  const preloadAll = useCallback(async () => {
    setIsLoading(true);
    setErrors([]);

    const promises = resources.map(async (resource) => {
      try {
        await preloadResource(resource.url, resource.type);
        setLoadedResources(prev => new Set([...prev, resource.url]));
        return resource.url;
      } catch (error) {
        setErrors(prev => [...prev, error.message]);
        throw error;
      }
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      console.warn('Some resources failed to preload:', error);
    } finally {
      setIsLoading(false);
    }
  }, [resources, preloadResource]);

  useEffect(() => {
    if (resources.length > 0) {
      preloadAll();
    }
  }, [resources, preloadAll]);

  return {
    loadedResources,
    isLoading,
    errors,
    preloadResource,
    isResourceLoaded: (url) => loadedResources.has(url)
  };
};

// 智能緩存 Hook
export const useSmartCache = (key, fetcher, options = {}) => {
  const {
    ttl = 5 * 60 * 1000, // 5分鐘
    maxSize = 100,
    staleWhileRevalidate = true
  } = options;

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const cacheRef = useRef(new Map());

  const getCacheKey = useCallback((k) => 
    typeof k === 'object' ? JSON.stringify(k) : String(k)
  , []);

  const getCachedData = useCallback((cacheKey) => {
    const cached = cacheRef.current.get(cacheKey);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > ttl;
    
    if (isExpired && !staleWhileRevalidate) {
      cacheRef.current.delete(cacheKey);
      return null;
    }

    return { data: cached.data, isStale: isExpired };
  }, [ttl, staleWhileRevalidate]);

  const setCachedData = useCallback((cacheKey, newData) => {
    // 實現 LRU 策略
    if (cacheRef.current.size >= maxSize) {
      const firstKey = cacheRef.current.keys().next().value;
      cacheRef.current.delete(firstKey);
    }

    cacheRef.current.set(cacheKey, {
      data: newData,
      timestamp: Date.now()
    });
  }, [maxSize]);

  const fetchData = useCallback(async (forceRefresh = false) => {
    const cacheKey = getCacheKey(key);
    const cached = getCachedData(cacheKey);

    if (cached && !forceRefresh) {
      setData(cached.data);
      if (cached.isStale && staleWhileRevalidate) {
        // 背景重新驗證
        try {
          const freshData = await fetcher(key);
          setCachedData(cacheKey, freshData);
          setData(freshData);
        } catch (err) {
          console.warn('Background revalidation failed:', err);
        }
      }
      return cached.data;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher(key);
      setCachedData(cacheKey, result);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [key, fetcher, getCacheKey, getCachedData, setCachedData, staleWhileRevalidate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: () => fetchData(true),
    clearCache: () => cacheRef.current.clear()
  };
};

// 性能監控 Hook
export const usePerformanceMonitor = (componentName) => {
  const renderCount = useRef(0);
  const renderTimes = useRef([]);

  useEffect(() => {
    renderCount.current += 1;
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      renderTimes.current.push(renderTime);

      // 保留最近 10 次的渲染時間
      if (renderTimes.current.length > 10) {
        renderTimes.current.shift();
      }

      const avgRenderTime = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;

      if (avgRenderTime > 16.67) { // 超過 60fps
        console.warn(
          `🐌 ${componentName} slow render: ${renderTime.toFixed(2)}ms (avg: ${avgRenderTime.toFixed(2)}ms, count: ${renderCount.current})`
        );
      }
    };
  });

  return {
    renderCount: renderCount.current,
    avgRenderTime: renderTimes.current.length > 0 
      ? renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length 
      : 0
  };
};