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
}

// Constants for wallpaper generation
const WALLPAPER_CONFIG = {
  canvas: {
    scale: 2, // Higher quality rendering
    backgroundColor: '#ffffff',
  },
};

// Triggers the download of the canvas as an image
const triggerDownload = (canvas: HTMLCanvasElement, fileName: string): void => {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Captures the scheduler element as canvas with mobile simulation
const captureSchedule = async (
  schedulerRef: React.RefObject<HTMLDivElement>,
  targetSize?: { width: number; height: number },
): Promise<HTMLCanvasElement> => {
  const html2canvas = await import('html2canvas');
  const element = schedulerRef.current!;

  // If targetSize is provided, capture for mobile wallpaper
  if (targetSize) {
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
      let paddingPerSide = Math.floor(baseMobileWidth * 0.05);
      let contentWidth = baseMobileWidth - paddingPerSide * 2;

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
      });

      // Check if table height exceeds available space
      const maxTableHeight = baseMobileHeight - 60; // 60px total vertical padding

      // If table is too tall, use maximum available space approach
      if (testCanvas.height > maxTableHeight) {
        console.log('Table too tall, switching to max space utilization');

        // Calculate maximum usable dimensions with minimal padding
        const maxUsableWidth = baseMobileWidth - 40; // 20px padding each side
        const maxUsableHeight = baseMobileHeight - 60; // 40px bottom + 20px top minimum

        // Find the optimal width that keeps table within height bounds
        // Start with max width and work down if needed
        let optimalWidth = maxUsableWidth;

        // Estimate height reduction ratio based on width change
        // Wider table = shorter height (roughly proportional)
        const widthRatio = maxUsableWidth / contentWidth;
        const estimatedNewHeight = testCanvas.height / widthRatio;

        if (estimatedNewHeight > maxUsableHeight) {
          // Still too tall even at max width, need to scale down
          const requiredHeightRatio = maxUsableHeight / testCanvas.height;
          optimalWidth = Math.floor(
            contentWidth * Math.sqrt(requiredHeightRatio) * 0.95,
          );
        }

        // Update element width to optimal
        element.style.width = `${optimalWidth}px`;
        element.style.maxWidth = `${optimalWidth}px`;
        element.style.minWidth = `${optimalWidth}px`;

        // Update window.innerWidth
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: optimalWidth,
        });

        // Trigger resize and wait
        const resizeEvent2 = new Event('resize');
        window.dispatchEvent(resizeEvent2);
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Update contentWidth and paddingPerSide for final capture
        contentWidth = optimalWidth;
        paddingPerSide = (baseMobileWidth - optimalWidth) / 2;
      }

      // Now capture with proper scaling
      const tempCanvas = await html2canvas.default(element, {
        backgroundColor: WALLPAPER_CONFIG.canvas.backgroundColor,
        scale: scaleFactor,
        useCORS: true,
        allowTaint: true,
        width: contentWidth,
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

      // Calculate vertical positioning - fixed bottom padding, rest on top
      const xOffset = paddingPerSide * scaleFactor;
      const bottomPadding = 40 * scaleFactor; // Fixed 20px bottom padding
      const yOffset = finalCanvas.height - tempCanvas.height - bottomPadding;

      // Draw the captured content with padding
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

  // Normal capture without size override
  return html2canvas.default(element, {
    backgroundColor: WALLPAPER_CONFIG.canvas.backgroundColor,
    scale: WALLPAPER_CONFIG.canvas.scale,
    useCORS: true,
    allowTaint: true,
  });
};

/**
 * Main export function to download schedule as wallpaper
 * @param {object} options - Download options
 * @param {object} options.schedulerRef - Reference to scheduler element
 * @param {object} options.selectedSize - Selected image size
 * @returns {Promise<void>}
 */
export const downloadScheduleAsWallpaper = async ({
  schedulerRef,
  selectedSize,
}: DownloadScheduleOptions): Promise<void> => {
  if (!schedulerRef.current) {
    console.error('Scheduler reference is null');
    return;
  }

  console.log('Starting download with selectedSize:', selectedSize);

  try {
    if (selectedSize && selectedSize.width > 0 && selectedSize.height > 0) {
      // Capture with mobile simulation
      const canvas = await captureSchedule(schedulerRef, selectedSize);
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
