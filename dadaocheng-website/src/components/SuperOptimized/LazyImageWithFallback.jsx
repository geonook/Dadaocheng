/**
 * SuperClaude 極致圖片優化組件
 * 支援 WebP、響應式、懶加載、漸進式增強
 */
import React, { useState, useRef, useEffect, memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LazyImageWithFallback = memo(({
  src,
  webpSrc,
  alt,
  className = '',
  sizes = '100vw',
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [priority, isInView]);

  // 預加載關鍵圖片
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = webpSrc || src;
      document.head.appendChild(link);
      
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [priority, src, webpSrc]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  // 生成響應式圖片 srcSet
  const generateSrcSet = (baseSrc) => {
    if (!baseSrc) return '';
    
    const ext = baseSrc.split('.').pop();
    const baseName = baseSrc.replace(`.${ext}`, '');
    
    return [
      `${baseName}_400w.${ext} 400w`,
      `${baseName}_800w.${ext} 800w`,
      `${baseName}_1200w.${ext} 1200w`,
      `${baseName}_1600w.${ext} 1600w`
    ].join(', ');
  };

  // 錯誤狀態
  if (hasError) {
    return (
      <div 
        ref={imgRef}
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="text-center text-gray-500 p-4">
          <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <div className="text-xs">圖片載入失敗</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* 加載骨架 */}
      {!isLoaded && placeholder === 'blur' && (
        <div className="absolute inset-0">
          {blurDataURL ? (
            <img
              src={blurDataURL}
              alt=""
              className="w-full h-full object-cover filter blur-sm scale-105"
              aria-hidden="true"
            />
          ) : (
            <Skeleton className="w-full h-full" />
          )}
        </div>
      )}

      {/* 主圖片 */}
      {isInView && (
        <picture>
          {/* WebP 支援 */}
          {webpSrc && (
            <source
              srcSet={generateSrcSet(webpSrc)}
              sizes={sizes}
              type="image/webp"
            />
          )}
          
          {/* 備用格式 */}
          <img
            src={src}
            srcSet={generateSrcSet(src)}
            sizes={sizes}
            alt={alt}
            className={`
              w-full h-full object-cover transition-opacity duration-700
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            {...props}
          />
        </picture>
      )}
    </div>
  );
});

LazyImageWithFallback.displayName = 'LazyImageWithFallback';

export default LazyImageWithFallback;