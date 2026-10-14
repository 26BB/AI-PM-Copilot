import React, { useState, useEffect, ReactNode } from 'react';

/** Standard device viewport breakpoint categories */
export type DeviceBreakpoint = 'mobile' | 'tablet' | 'desktop';

/**
 * Determines the device breakpoint category based on screen or container width in pixels.
 *
 * @param width - Viewport or container width in pixels
 * @returns DeviceBreakpoint ('mobile' for < 768px, 'tablet' for 768px-1023px, 'desktop' for >= 1024px)
 */
export function getBreakpoint(width: number): DeviceBreakpoint {
  if (width < 768) {
    return 'mobile';
  }
  if (width < 1024) {
    return 'tablet';
  }
  return 'desktop';
}

/**
 * Checks whether a given width corresponds to a mobile device layout.
 *
 * @param width - Viewport width in pixels
 * @returns Boolean indicating if width is strictly less than 768px
 */
export function isMobileWidth(width: number): boolean {
  return width < 768;
}

/**
 * Computes appropriate responsive inner padding based on viewport width.
 *
 * @param width - Viewport or container width in pixels
 * @returns CSS padding string (e.g., '12px 16px' for mobile, '24px 32px' for desktop)
 */
export function getResponsivePadding(width: number): string {
  const breakpoint = getBreakpoint(width);
  switch (breakpoint) {
    case 'mobile':
      return '12px 16px';
    case 'tablet':
      return '20px 24px';
    case 'desktop':
      return '24px 32px';
  }
}

export interface ResponsiveContainerProps {
  /** React child elements wrapped by the container */
  children: ReactNode;
  /** Maximum container width constraint (default: '800px') */
  maxWidth?: string;
  /** Custom CSS class names */
  className?: string;
  /** Optional fixed width override, useful for SSR or test environments */
  customWidth?: number;
}

/**
 * Responsive layout container wrapper that automatically detects mobile vs desktop viewports
 * and applies responsive margins, padding, and layout constraints.
 *
 * @param props - ResponsiveContainerProps configuring layout children and width limits
 * @returns React JSX element rendering responsive layout wrapper
 */
export function ResponsiveContainer({
  children,
  maxWidth = '800px',
  className = '',
  customWidth,
}: ResponsiveContainerProps): React.JSX.Element {
  const [viewportWidth, setViewportWidth] = useState<number>(() => {
    if (typeof customWidth === 'number') {
      return customWidth;
    }
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1024;
  });

  useEffect(() => {
    if (typeof customWidth === 'number') {
      setViewportWidth(customWidth);
      return;
    }

    const handleResize = (): void => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [customWidth]);

  const activeBreakpoint = getBreakpoint(viewportWidth);
  const isMobile = isMobileWidth(viewportWidth);
  const padding = getResponsivePadding(viewportWidth);

  return (
    <div
      className={`responsive-container ${className}`.trim()}
      data-breakpoint={activeBreakpoint}
      data-is-mobile={isMobile}
      style={{
        maxWidth,
        width: '100%',
        margin: '0 auto',
        padding,
        boxSizing: 'border-box',
        transition: 'padding 0.2s ease-in-out',
      }}
    >
      {children}
    </div>
  );
}
