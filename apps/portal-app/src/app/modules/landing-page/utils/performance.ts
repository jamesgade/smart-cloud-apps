// Performance optimization utilities for 10M users
import React, { useState, useEffect, useRef } from 'react';

// Virtual scrolling for large lists
export const useVirtualization = (
  items: any[],
  containerHeight: number,
  itemHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight)
  );

  const startIndex = Math.max(0, visibleStart - overscan);
  const endIndex = Math.min(items.length - 1, visibleEnd + overscan);

  const visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
    ...item,
    index: startIndex + index,
  }));

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop,
  };
};

// Debounce hook for search and API calls
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle hook for scroll events
export const useThrottle = <T>(value: T, delay: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + delay) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [value, delay]);

  return throttledValue;
};

// Image lazy loading hook
export const useLazyImage = (src: string, options?: IntersectionObserverInit) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let observer: IntersectionObserver;

    if (imageRef && imageSrc === '') {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(imageRef);
            }
          });
        },
        options
      );
      observer.observe(imageRef);
    }

    return () => {
      if (observer && imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef, imageSrc, src, options]);

  return [imageSrc, setImageRef] as const;
};

// Memoized component wrapper for performance
export const memoizeComponent = <P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  return React.memo(Component, areEqual);
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderStart = useRef<number>(0);

  useEffect(() => {
    renderStart.current = performance.now();
    
    return () => {
      const renderTime = performance.now() - renderStart.current;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      // }
    };
  });

  const measureAsync = async <T>(operation: () => Promise<T>, operationName: string): Promise<T> => {
    const start = performance.now();
    try {
      const result = await operation();
      const duration = performance.now() - start;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log(`${operationName} took: ${duration.toFixed(2)}ms`);
      // }
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      if (process.env.NODE_ENV === 'development') {
        console.error(`${operationName} failed after: ${duration.toFixed(2)}ms`, error);
      }
      throw error;
    }
  };

  return { measureAsync };
};

// Bundle splitting utilities
export const loadComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> => {
  return React.lazy(importFunc);
};

// Service Worker utilities for caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Preload critical resources
export const preloadResource = (href: string, as: string, type?: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  document.head.appendChild(link);
};

// Image optimization utilities
export const getOptimizedImageUrl = (
  baseUrl: string,
  width?: number,
  height?: number,
  quality: number = 80
): string => {
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', quality.toString());
  
  return `${baseUrl}?${params.toString()}`;
};

// Memory management utilities
export const cleanupMemory = () => {
  if (window.gc) {
    window.gc();
  }
};

// Network status monitoring
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection type if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionType(connection.effectiveType || 'unknown');
      
      const handleConnectionChange = () => {
        setConnectionType(connection.effectiveType || 'unknown');
      };
      
      connection.addEventListener('change', handleConnectionChange);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', handleConnectionChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, connectionType };
};
