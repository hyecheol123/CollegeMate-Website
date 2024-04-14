/**
 * Helper method to format second to HH:MM format
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

/**
 * Format second to HH:MM format
 * @param {number} second time in second
 * @return {string} time in HH:MM format
 */
function formatSecond(second: number): string {
  return `${Math.floor(second / 60)}:${String(second % 60).padStart(2, '0')}`;
}

export default formatSecond;
