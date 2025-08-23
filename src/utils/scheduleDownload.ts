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
  padding: {
    left: 0.06, // 6%
    right: 0.06, // 6%
    bottom: 0.035, // 3.5%
    minTop: 0.1, // Minimum 10% top padding
  },
  deviceRatio: 2.1654135338, // Fixed aspect ratio for phone wallpaper
  canvas: {
    scale: 2, // Higher quality rendering
    backgroundColor: '#ffffff',
  },
  text: {
    font: 'bold 52px Roboto, sans-serif',
    color: '#B20000', // red.main color
    offsetY: 30, // Distance above schedule
  },
};

// Creates a canvas with padding for wallpaper
const createPaddedCanvas = (
  originalCanvas: HTMLCanvasElement,
  paddingTop: number,
): HTMLCanvasElement => {
  const { padding } = WALLPAPER_CONFIG;
  const contentWidth = originalCanvas.width;
  const contentHeight = originalCanvas.height;

  // Calculate total dimensions with padding
  const totalWidth = contentWidth / (1 - padding.left - padding.right);
  const totalHeight = contentHeight / (1 - paddingTop - padding.bottom);

  // Create new canvas
  const paddedCanvas = document.createElement('canvas');
  paddedCanvas.width = totalWidth;
  paddedCanvas.height = totalHeight;

  return paddedCanvas;
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

// Captures the scheduler element as canvas
const captureSchedule = async (
  schedulerRef: React.RefObject<HTMLDivElement>,
): Promise<HTMLCanvasElement> => {
  const html2canvas = await import('html2canvas');

  return html2canvas.default(schedulerRef.current!, {
    backgroundColor: WALLPAPER_CONFIG.canvas.backgroundColor,
    scale: WALLPAPER_CONFIG.canvas.scale,
    useCORS: true,
    allowTaint: true,
  });
};

// Renders the schedule on canvas and triggers download
const renderAndDownload = async (
  paddedCanvas: HTMLCanvasElement,
  originalCanvas: HTMLCanvasElement,
  x: number,
  y: number,
  fileName: string,
): Promise<void> => {
  const ctx = paddedCanvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Fill background
  ctx.fillStyle = WALLPAPER_CONFIG.canvas.backgroundColor;
  ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);

  // Draw the original schedule
  ctx.drawImage(
    originalCanvas,
    x,
    y,
    originalCanvas.width,
    originalCanvas.height,
  );

  // Trigger download
  triggerDownload(paddedCanvas, fileName);
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
  if (!schedulerRef.current) return;

  try {
    // Capture the schedule as canvas
    const originalCanvas = await captureSchedule(schedulerRef);

    // Use custom device ratio if selectedSize is provided
    if (selectedSize && selectedSize.width > 0 && selectedSize.height > 0) {
      // Calculate custom device ratio from selectedSize
      const customDeviceRatio = selectedSize.height / selectedSize.width;

      // Calculate dimensions with custom device ratio
      const contentWidth = originalCanvas.width;
      const contentHeight = originalCanvas.height;

      // Calculate padding with custom device ratio
      const calculatedPaddingTop =
        0.9 - (contentHeight * 0.88) / (contentWidth * customDeviceRatio);
      const paddingTop = Math.max(
        WALLPAPER_CONFIG.padding.minTop,
        calculatedPaddingTop,
      );

      // Create padded canvas
      const paddedCanvas = createPaddedCanvas(originalCanvas, paddingTop);
      const x = paddedCanvas.width * WALLPAPER_CONFIG.padding.left;
      const y = paddedCanvas.height * paddingTop;

      // Render and download
      await renderAndDownload(
        paddedCanvas,
        originalCanvas,
        x,
        y,
        'schedule_wallpaper.png',
      );
    } else {
      // Simple padding for general download (uniform padding based on average dimension)
      const avgDimension = (originalCanvas.width + originalCanvas.height) / 2;
      const paddingPixels = avgDimension * 0.05; // 5% of average dimension

      // Create canvas with uniform pixel padding
      const totalWidth = originalCanvas.width + paddingPixels * 2;
      const totalHeight = originalCanvas.height + paddingPixels * 2;

      const paddedCanvas = document.createElement('canvas');
      paddedCanvas.width = totalWidth;
      paddedCanvas.height = totalHeight;

      // Calculate content position (centered with uniform padding)
      const x = paddingPixels;
      const y = paddingPixels;

      // Render and download
      await renderAndDownload(
        paddedCanvas,
        originalCanvas,
        x,
        y,
        'schedule.png',
      );
    }
  } catch (error) {
    console.error('Failed to download schedule:', error);
    throw error;
  }
};
