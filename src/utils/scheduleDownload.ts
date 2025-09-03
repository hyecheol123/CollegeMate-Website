/**
 * Utility function to download schedule as wallpaper image
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

interface DownloadScheduleOptions {
  schedulerRef: React.RefObject<HTMLDivElement>;
  selectedSize?: {
    width: number;
    height: number;
  };
  selectedDevice?: string;
}

// Constants for wallpaper generation
const WALLPAPER_CONFIG = {
  canvas: {
    scale: 2, // Higher quality rendering
    backgroundColor: '#ffffff',
  },
};

import { LOCKSCREEN_CLOCK_ZONES } from '../data/deviceSpecs';

// Triggers the download of the canvas as an image
const triggerDownload = (canvas: HTMLCanvasElement, fileName: string): void => {
  try {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Download failed:', error);
    alert('Download failed. Please try again.');
  }
};

// Captures the scheduler element as canvas with mobile simulation
const captureSchedule = async (
  schedulerRef: React.RefObject<HTMLDivElement>,
  targetSize?: { width: number; height: number },
  device?: string,
): Promise<HTMLCanvasElement> => {
  const html2canvas = await import('html2canvas');
  const element = schedulerRef.current!;

  // If targetSize is provided with valid dimensions, capture for mobile wallpaper
  if (targetSize && targetSize.width > 0 && targetSize.height > 0) {
    // Calculate aspect ratio and determine mobile-friendly base size
    const aspectRatio = targetSize.width / targetSize.height;

    // Base mobile dimensions that will look good on screen
    let baseMobileWidth: number;
    let baseMobileHeight: number;

    if (aspectRatio > 1) {
      // Landscape orientation (wider than tall)
      baseMobileWidth = 600;
      baseMobileHeight = Math.round(600 / aspectRatio);
    } else {
      // Portrait orientation (taller than wide)
      // Adjust base width based on aspect ratio for better fit
      if (aspectRatio < 0.6) {
        baseMobileWidth = 400; // Narrow screens (most iPhones)
      } else if (aspectRatio < 0.8) {
        baseMobileWidth = 500; // Wider screens (iPad)
      } else {
        baseMobileWidth = 550; // Even wider screens
      }
      baseMobileHeight = Math.round(baseMobileWidth / aspectRatio);
    }

    // Calculate the scale factor for final output
    const scaleFactorX = targetSize.width / baseMobileWidth;
    const scaleFactorY = targetSize.height / baseMobileHeight;
    const scaleFactor = Math.max(scaleFactorX, scaleFactorY);

    // Store original styles
    const originalStyles = {
      width: element.style.width,
      height: element.style.height,
      maxWidth: element.style.maxWidth,
      maxHeight: element.style.maxHeight,
      minWidth: element.style.minWidth,
      overflow: element.style.overflow,
    };

    // Store original window.innerWidth
    const originalInnerWidth = window.innerWidth;

    try {
      // Calculate content width (reduce by 10% for margins)
      const paddingPerSide = Math.floor(baseMobileWidth * 0.05);
      const contentWidth = baseMobileWidth - paddingPerSide * 2;

      // Set container to reduced width for natural margins
      element.style.width = `${contentWidth}px`;
      // Don't force height - let it be natural to avoid empty space
      element.style.height = 'auto';
      element.style.maxWidth = `${contentWidth}px`;
      // Set max-height but allow shorter content
      element.style.maxHeight = `${baseMobileHeight}px`;
      element.style.minWidth = `${contentWidth}px`;
      element.style.overflow = 'hidden';

      // Mock window.innerWidth to content width for proper responsive behavior
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: contentWidth,
      });

      // Trigger resize event for mobile layout
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);

      // Wait for layout to stabilize
      await new Promise((resolve) => setTimeout(resolve, 300));

      // First capture WITHOUT scaling to check actual height
      const testCanvas = await html2canvas.default(element, {
        backgroundColor: WALLPAPER_CONFIG.canvas.backgroundColor,
        scale: 1, // No scaling for test
        useCORS: true,
        allowTaint: true,
        width: contentWidth,
        logging: false,
      });

      // Get clock safe zone for this device
      const clockZoneHeight = device
        ? LOCKSCREEN_CLOCK_ZONES[device] || 450
        : 450;

      // Calculate available height considering clock zone
      // Scale the clock zone proportionally to base dimensions
      const scaledClockZone =
        (clockZoneHeight / targetSize.height) * baseMobileHeight;
      const topPaddingBase = 40; // Extra padding below clock (20px more)
      const bottomPaddingBase = 60; // Extra bottom padding (20px more)
      const maxTableHeight =
        baseMobileHeight - scaledClockZone - topPaddingBase - bottomPaddingBase;

      // If table is too tall, use maximum available space approach
      if (testCanvas.height > maxTableHeight) {
        // Calculate how much we need to scale down the entire table
        const scaleRatio = maxTableHeight / testCanvas.height;

        // Apply CSS transform scale to entire element
        const scaleValue = Math.min(scaleRatio * 0.95, 1); // 0.95 for safety margin
        element.style.transform = `scale(${scaleValue})`;
        element.style.transformOrigin = 'top left';

        // Wait for transform to apply
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Now capture with proper scaling
      const tempCanvas = await html2canvas.default(element, {
        backgroundColor: WALLPAPER_CONFIG.canvas.backgroundColor,
        scale: scaleFactor,
        useCORS: true,
        allowTaint: true,
        width: contentWidth,
        logging: false,
      });

      // Create final canvas with correct aspect ratio
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = baseMobileWidth * scaleFactor;
      finalCanvas.height = baseMobileHeight * scaleFactor;

      const ctx = finalCanvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');

      // Fill background
      ctx.fillStyle = WALLPAPER_CONFIG.canvas.backgroundColor;
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

      // Calculate positioning considering clock zone and centering scaled content
      const clockZoneScaled =
        (clockZoneHeight / targetSize.height) * finalCanvas.height;

      // Check if content fits within canvas
      const availableSpace = finalCanvas.height - clockZoneScaled;

      // Calculate actual scaled width for proper centering
      // Check if scaling was applied by looking for transform in the element
      const wasScaled = element.style.transform.includes('scale');
      let actualContentWidth = tempCanvas.width;

      if (wasScaled) {
        // Extract scale value from transform
        const scaleMatch = element.style.transform.match(/scale\(([^)]+)\)/);
        if (scaleMatch) {
          const scaleValue = parseFloat(scaleMatch[1]);
          actualContentWidth = tempCanvas.width * scaleValue;
        }
      }

      // Center based on actual scaled width
      const xOffset = (finalCanvas.width - actualContentWidth) / 2;

      // If content is still too tall, position it right after clock zone
      // Otherwise center it in available space
      let yOffset;
      if (tempCanvas.height > availableSpace * 0.9) {
        // Too tall, position right after clock with minimal padding
        yOffset = clockZoneScaled + 20 * scaleFactor;
      } else {
        // Fits well, center it
        const topMargin =
          clockZoneScaled + (availableSpace - tempCanvas.height) / 2;
        const minTopPadding = clockZoneScaled + 40 * scaleFactor;
        yOffset = Math.max(minTopPadding, topMargin);
      }

      // Draw the captured content centered
      ctx.drawImage(tempCanvas, xOffset, yOffset);

      return finalCanvas;
    } finally {
      // Restore original element styles
      element.style.width = originalStyles.width;
      element.style.height = originalStyles.height;
      element.style.maxWidth = originalStyles.maxWidth;
      element.style.maxHeight = originalStyles.maxHeight;
      element.style.minWidth = originalStyles.minWidth;
      element.style.overflow = originalStyles.overflow;
      element.style.transform = ''; // Reset transform
      element.style.transformOrigin = '';

      // Restore original window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: originalInnerWidth,
      });

      // Trigger resize to restore original layout
      const restoreEvent = new Event('resize');
      window.dispatchEvent(restoreEvent);

      // Brief wait for restoration
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  // Normal capture without size override - ensure clean desktop layout
  // Store original values for all potentially affected properties
  const originalStyles = {
    width: element.style.width,
    height: element.style.height,
    maxWidth: element.style.maxWidth,
    maxHeight: element.style.maxHeight,
    minWidth: element.style.minWidth,
    overflow: element.style.overflow,
    transform: element.style.transform,
    transformOrigin: element.style.transformOrigin,
  };

  // Store original window.innerWidth before any modifications (unused but kept for clarity)
  // const originalInnerWidth = window.innerWidth;

  try {
    // Force complete reset to clean desktop layout
    element.style.cssText = ''; // Clear ALL inline styles

    // Get the ACTUAL current window size (not the mocked one)
    const actualWindowWidth =
      document.documentElement.clientWidth ||
      document.body.clientWidth ||
      window.outerWidth;

    // Reset window.innerWidth to actual current size
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).innerWidth; // Delete the property first
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: actualWindowWidth,
    });

    // Force MANY resize events with different timings to ensure React hooks respond
    for (let i = 0; i < 5; i++) {
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Additional forced reflow
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    element.offsetHeight;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    element.offsetWidth;

    return html2canvas.default(element, {
      backgroundColor: WALLPAPER_CONFIG.canvas.backgroundColor,
      scale: WALLPAPER_CONFIG.canvas.scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
    });
  } finally {
    // Restore only non-empty original styles
    if (originalStyles.width) element.style.width = originalStyles.width;
    if (originalStyles.height) element.style.height = originalStyles.height;
    if (originalStyles.maxWidth)
      element.style.maxWidth = originalStyles.maxWidth;
    if (originalStyles.maxHeight)
      element.style.maxHeight = originalStyles.maxHeight;
    if (originalStyles.minWidth)
      element.style.minWidth = originalStyles.minWidth;
    if (originalStyles.overflow)
      element.style.overflow = originalStyles.overflow;
    if (originalStyles.transform)
      element.style.transform = originalStyles.transform;
    if (originalStyles.transformOrigin)
      element.style.transformOrigin = originalStyles.transformOrigin;
  }
};

/**
 * Main export function to download schedule as wallpaper
 * @param {object} options - Download options
 * @param {object} options.schedulerRef - Reference to scheduler element
 * @param {object} options.selectedSize - Selected image size
 * @param {string} options.selectedDevice - Selected device type for wallpaper generation
 * @returns {Promise<void>}
 */
export const downloadScheduleAsWallpaper = async ({
  schedulerRef,
  selectedSize,
  selectedDevice,
}: DownloadScheduleOptions): Promise<void> => {
  if (!schedulerRef.current) {
    console.error('Scheduler reference is null');
    return;
  }

  try {
    if (selectedSize && selectedSize.width > 0 && selectedSize.height > 0) {
      // Capture with mobile simulation
      const canvas = await captureSchedule(
        schedulerRef,
        selectedSize,
        selectedDevice,
      );
      triggerDownload(canvas, 'schedule_wallpaper.png');
    } else {
      // Normal capture for general download
      const originalCanvas = await captureSchedule(schedulerRef);

      // Add simple padding
      const avgDimension = (originalCanvas.width + originalCanvas.height) / 2;
      const paddingPixels = avgDimension * 0.05;

      const totalWidth = originalCanvas.width + paddingPixels * 2;
      const totalHeight = originalCanvas.height + paddingPixels * 2;

      const paddedCanvas = document.createElement('canvas');
      paddedCanvas.width = totalWidth;
      paddedCanvas.height = totalHeight;

      const ctx = paddedCanvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');

      ctx.fillStyle = WALLPAPER_CONFIG.canvas.backgroundColor;
      ctx.fillRect(0, 0, totalWidth, totalHeight);

      ctx.drawImage(originalCanvas, paddingPixels, paddingPixels);

      triggerDownload(paddedCanvas, 'schedule.png');
    }
  } catch (error) {
    console.error('Failed to download schedule:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};
