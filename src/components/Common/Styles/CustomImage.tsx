/**
 * CustomImage Component
 * - A reusable image wrapper using <picture> for modern image formats (AVIF, WebP, PNG fallback)
 * - Simplifies multi-format image rendering with consistent sizing and optional styling
 * - Default width and height set to 24px unless overridden
 * @author Daekyun Kim
 */

// React
import React from 'react';

// Type for CustomImage props
type CustomImageProps = {
  png: string; // fallback PNG image path
  webp: string; // WebP format image path
  avif: string; // AVIF format image path
  alt: string; // alt text for accessibility
  width?: string; // optional width (default : '24px')
  height?: string; // optional height (default: '24px')
  style?: React.CSSProperties; // additional inline styles
};

/**
 * Renders optimized image using the <picture> element with AVIF, WebP, and PNG fallback.
 * @param {CustomImageProps} props - Props for image sources and display configuration
 * @returns {JSX.Element} Responsive and optimized image component
 */
const CustomImage = ({
  png,
  webp,
  avif,
  alt,
  width = '24px',
  height = '24px',
  style = {},
}: CustomImageProps): JSX.Element => (
  <picture>
    <source srcSet={avif} type="image/avif" />
    <source srcSet={webp} type="image/webp" />
    <img src={png} alt={alt} style={{ width, height, ...style }} />
  </picture>
);

export default CustomImage;
