import React, { useState, memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ResponsiveImage = memo(({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy',
  sizes,
  placeholder = true,
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500 p-4">
          <div className="text-sm">圖片載入失敗</div>
          <div className="text-xs">Image failed to load</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && placeholder && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        sizes={sizes}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
});

ResponsiveImage.displayName = 'ResponsiveImage';

export default ResponsiveImage;