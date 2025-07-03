/**
 * useIsMobile Hook
 * - Custom React hook to determine if the current screen width is less than or equal to a given breakpoint
 * - Useful for implementing responsive behavior in components
 * - Automatically updates on window resize
 * @param {number} [breakpoint=480] - The screen width threshold to consider a device "mobile"
 * @returns {boolean} - True if the window width is less than or equal to the breakpoint
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import { useState, useEffect } from 'react';

const useIsMobile = (breakpoint: number = 480): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(
    (): boolean => window.innerWidth <= breakpoint,
  );

  useEffect(() => {
    const handleResize = (): void => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    window.addEventListener('resize', handleResize);

    return (): void => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
