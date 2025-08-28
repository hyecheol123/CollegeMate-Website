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

// Lockscreen clock safe zones (in pixels from top)
const LOCKSCREEN_CLOCK_ZONES: Record<string, number> = {
  // iPhone 16 series - Dynamic Island devices have larger clock
  'iPhone 16 Pro Max': 500,
  'iPhone 16 Pro': 480,
  'iPhone 16 Plus': 490,
  'iPhone 16': 460,

  // Older iPhones with notch
  'iPhone 13': 440,
  'iPhone mini': 400,

  // Samsung Galaxy - varies by model
  'Galaxy S25 Ultra': 550,
  'Galaxy S25+': 550,
  'Galaxy S25': 500,
  'Galaxy S24 Ultra': 550,
  'Galaxy S24+': 550,
  'Galaxy S24': 500,
  'Galaxy Note 20': 500,

  // Galaxy Z Flip series
  'Galaxy Z Flip7': 520,
  'Galaxy Z Flip6': 520,
  'Galaxy Z Flip5': 520,

  // iPad - smaller clock relative to screen
  'iPad Pro 13-inch (M4)': 400,
  'iPad Pro 11-inch (M4)': 380,
  'iPad Air 13-inch (M2/M3)': 400,
  'iPad Air 11-inch (M2/M3)': 380,
  'iPad (10th gen, 10.9-inch)': 380,
  'iPad mini (6th gen)': 350,

  // Default fallback
  'Auto-match for device': 450,
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
  device?: string,
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
      const bottomPaddingBase = 80; // Extra bottom padding (20px more)
      const maxTableHeight =
        baseMobileHeight - scaledClockZone - topPaddingBase - bottomPaddingBase;

      // If table is too tall, use maximum available space approach
      if (testCanvas.height > maxTableHeight) {
        console.log('Table too tall, need to reduce width to fit');
        console.log(
          `Current height: ${testCanvas.height}, Max allowed: ${maxTableHeight}`,
        );

        // Calculate how much we need to scale down the entire table
        const scaleRatio = maxTableHeight / testCanvas.height;
        console.log(`Need to scale table by ${scaleRatio} to fit`);

        // Apply CSS transform scale to entire element
        const scaleValue = Math.min(scaleRatio * 0.95, 1); // 0.95 for safety margin
        element.style.transform = `scale(${scaleValue})`;
        element.style.transformOrigin = 'top left';

        // Keep original width but scale the entire element
        console.log(`Scaling entire table by ${scaleValue}`);

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

      // Debug logging
      console.log(
        'Final canvas dimensions:',
        finalCanvas.width,
        'x',
        finalCanvas.height,
      );
      console.log('Clock zone height:', clockZoneScaled);
      console.log(
        'Content dimensions:',
        tempCanvas.width,
        'x',
        tempCanvas.height,
      );

      // Check if content fits within canvas
      const availableSpace = finalCanvas.height - clockZoneScaled;
      console.log('Available space below clock:', availableSpace);
      console.log('Content + clock will end at:', clockZoneScaled + tempCanvas.height);

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
          console.log(`Content was scaled by ${scaleValue}, actual width: ${actualContentWidth}`);
        }
      }
      
      // Center based on actual scaled width
      const xOffset = (finalCanvas.width - actualContentWidth) / 2;

      // If content is still too tall, position it right after clock zone
      // Otherwise center it in available space
      let yOffset;
      if (tempCanvas.height > availableSpace * 0.9) {
        // Too tall, position right after clock with extra padding (20px more)
        yOffset = clockZoneScaled + 40 * scaleFactor;
        console.log('Content too tall, positioning at top with extra padding');
      } else {
        // Fits well, center it with extra padding
        const topMargin = clockZoneScaled + (availableSpace - tempCanvas.height) / 2;
        const minTopPadding = clockZoneScaled + 60 * scaleFactor; // 20px more
        yOffset = Math.max(minTopPadding, topMargin);
        console.log('Content fits, centering with extra padding');
      }

      console.log('Final positioning at:', xOffset, yOffset);
      console.log('Content will end at:', yOffset + tempCanvas.height);
      console.log('Bottom margin:', finalCanvas.height - (yOffset + tempCanvas.height));

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
 * @param options.selectedDevice
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

  console.log(
    'Starting download with selectedSize:',
    selectedSize,
    'device:',
    selectedDevice,
  );

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
