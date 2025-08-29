/**
 * Device specifications for wallpaper generation
 * Contains display dimensions and clock safe zones for various mobile devices
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

export interface DeviceSpec {
  width: number;
  height: number;
  clockZone: number; // Pixels from top where clock/status bar is located
  brand: string;
}

export const DEVICE_SPECS: Record<string, DeviceSpec> = {
  // iPhone 16 series - Dynamic Island devices have larger clock
  'iPhone 16 Pro Max': {
    width: 1320,
    height: 2868,
    clockZone: 500,
    brand: 'Apple',
  },
  'iPhone 16 Pro': {
    width: 1206,
    height: 2622,
    clockZone: 480,
    brand: 'Apple',
  },
  'iPhone 16 Plus': {
    width: 1290,
    height: 2796,
    clockZone: 490,
    brand: 'Apple',
  },
  'iPhone 16': { width: 1179, height: 2556, clockZone: 460, brand: 'Apple' },

  // iPhone 15 series - Dynamic Island devices
  'iPhone 15 Pro Max': {
    width: 1290,
    height: 2796,
    clockZone: 490,
    brand: 'Apple',
  },
  'iPhone 15 Pro': {
    width: 1179,
    height: 2556,
    clockZone: 480,
    brand: 'Apple',
  },
  'iPhone 15 Plus': {
    width: 1290,
    height: 2796,
    clockZone: 480,
    brand: 'Apple',
  },
  'iPhone 15': { width: 1179, height: 2556, clockZone: 460, brand: 'Apple' },

  // iPhone 14 series - Pro models have Dynamic Island, regular have notch
  'iPhone 14 Pro Max': {
    width: 1290,
    height: 2796,
    clockZone: 480,
    brand: 'Apple',
  },
  'iPhone 14 Pro': {
    width: 1179,
    height: 2556,
    clockZone: 470,
    brand: 'Apple',
  },
  'iPhone 14 Plus': {
    width: 1290,
    height: 2796,
    clockZone: 440,
    brand: 'Apple',
  },
  'iPhone 14': { width: 1170, height: 2532, clockZone: 440, brand: 'Apple' },

  // iPhone 13 series with notch
  'iPhone 13 Pro Max': {
    width: 1284,
    height: 2778,
    clockZone: 460,
    brand: 'Apple',
  },
  'iPhone 13 Pro': {
    width: 1170,
    height: 2532,
    clockZone: 440,
    brand: 'Apple',
  },
  'iPhone 13': { width: 1170, height: 2532, clockZone: 440, brand: 'Apple' },
  'iPhone 13 mini': {
    width: 1080,
    height: 2340,
    clockZone: 400,
    brand: 'Apple',
  },

  // iPhone SE series (no notch, traditional status bar)
  'iPhone SE (3rd gen)': {
    width: 750,
    height: 1334,
    clockZone: 300,
    brand: 'Apple',
  },
  'iPhone SE (2nd gen)': {
    width: 750,
    height: 1334,
    clockZone: 300,
    brand: 'Apple',
  },

  // Samsung Galaxy S25 / S24 series
  'Galaxy S25 Ultra': {
    width: 1440,
    height: 3120,
    clockZone: 550,
    brand: 'Samsung',
  },
  'Galaxy S25+': {
    width: 1440,
    height: 3120,
    clockZone: 550,
    brand: 'Samsung',
  },
  'Galaxy S25': { width: 1080, height: 2340, clockZone: 500, brand: 'Samsung' },
  'Galaxy S24 Ultra': {
    width: 1440,
    height: 3120,
    clockZone: 550,
    brand: 'Samsung',
  },
  'Galaxy S24+': {
    width: 1440,
    height: 3120,
    clockZone: 550,
    brand: 'Samsung',
  },
  'Galaxy S24': { width: 1080, height: 2340, clockZone: 500, brand: 'Samsung' },
  'Galaxy Note 20': {
    width: 1080,
    height: 2340,
    clockZone: 500,
    brand: 'Samsung',
  },

  // Galaxy Z Flip series (main inner screen resolution)
  'Galaxy Z Flip7': {
    width: 1080,
    height: 2520,
    clockZone: 520,
    brand: 'Samsung',
  },
  'Galaxy Z Flip6': {
    width: 1080,
    height: 2640,
    clockZone: 520,
    brand: 'Samsung',
  },
  'Galaxy Z Flip5': {
    width: 1080,
    height: 2640,
    clockZone: 520,
    brand: 'Samsung',
  },

  // Galaxy Z Fold series (main inner screen resolution)
  'Galaxy Z Fold7': {
    width: 1856,
    height: 2160,
    clockZone: 540,
    brand: 'Samsung',
  },
  'Galaxy Z Fold6': {
    width: 1856,
    height: 2160,
    clockZone: 540,
    brand: 'Samsung',
  },
  'Galaxy Z Fold5': {
    width: 1812,
    height: 2176,
    clockZone: 540,
    brand: 'Samsung',
  },

  // Google Pixel series
  'Pixel 9 Pro XL': {
    width: 1344,
    height: 2992,
    clockZone: 520,
    brand: 'Google',
  },
  'Pixel 9 Pro': {
    width: 1280,
    height: 2856,
    clockZone: 520,
    brand: 'Google',
  },
  'Pixel 9': {
    width: 1080,
    height: 2424,
    clockZone: 500,
    brand: 'Google',
  },
  'Pixel 8 Pro': {
    width: 1344,
    height: 2992,
    clockZone: 520,
    brand: 'Google',
  },
  'Pixel 8': {
    width: 1080,
    height: 2400,
    clockZone: 500,
    brand: 'Google',
  },
  'Pixel 7 Pro': {
    width: 1440,
    height: 3120,
    clockZone: 520,
    brand: 'Google',
  },
  'Pixel 7': {
    width: 1080,
    height: 2400,
    clockZone: 500,
    brand: 'Google',
  },

  // iPad series (portrait orientation)
  'iPad Pro 13-inch (M4)': {
    width: 2064,
    height: 2752,
    clockZone: 400,
    brand: 'Apple',
  },
  'iPad Pro 11-inch (M4)': {
    width: 1668,
    height: 2420,
    clockZone: 380,
    brand: 'Apple',
  },
  'iPad Air 13-inch (M2/M3)': {
    width: 2048,
    height: 2732,
    clockZone: 400,
    brand: 'Apple',
  },
  'iPad Air 11-inch (M2/M3)': {
    width: 1640,
    height: 2360,
    clockZone: 380,
    brand: 'Apple',
  },
  'iPad (10th gen, 10.9-inch)': {
    width: 1640,
    height: 2360,
    clockZone: 380,
    brand: 'Apple',
  },
  'iPad mini (6th gen)': {
    width: 1488,
    height: 2266,
    clockZone: 350,
    brand: 'Apple',
  },

  // Auto-match fallback
  'Auto-match for device': {
    width: 1179,
    height: 2556,
    clockZone: 450,
    brand: 'Auto',
  },
};

// Generate device options list from specs
export const DEVICE_OPTIONS: string[] = [
  'Auto-match for device',

  // iPhone 16 series
  'iPhone 16 Pro Max',
  'iPhone 16 Pro',
  'iPhone 16 Plus',
  'iPhone 16',

  // iPhone 15 series
  'iPhone 15 Pro Max',
  'iPhone 15 Pro',
  'iPhone 15 Plus',
  'iPhone 15',

  // iPhone 14 series
  'iPhone 14 Pro Max',
  'iPhone 14 Pro',
  'iPhone 14 Plus',
  'iPhone 14',

  // iPhone 13 series
  'iPhone 13 Pro Max',
  'iPhone 13 Pro',
  'iPhone 13',
  'iPhone 13 mini',

  // iPhone SE series
  'iPhone SE (3rd gen)',
  'iPhone SE (2nd gen)',

  // Galaxy S25 / S24 series
  'Galaxy S25 Ultra',
  'Galaxy S25+',
  'Galaxy S25',
  'Galaxy S24 Ultra',
  'Galaxy S24+',
  'Galaxy S24',
  'Galaxy Note 20',

  // Galaxy Z Flip series
  'Galaxy Z Flip7',
  'Galaxy Z Flip6',
  'Galaxy Z Flip5',

  // Galaxy Z Fold series
  'Galaxy Z Fold7',
  'Galaxy Z Fold6',
  'Galaxy Z Fold5',

  // Google Pixel series
  'Pixel 9 Pro XL',
  'Pixel 9 Pro',
  'Pixel 9',
  'Pixel 8 Pro',
  'Pixel 8',
  'Pixel 7 Pro',
  'Pixel 7',

  // iPad series
  'iPad Pro 13-inch (M4)',
  'iPad Pro 11-inch (M4)',
  'iPad Air 13-inch (M2/M3)',
  'iPad Air 11-inch (M2/M3)',
  'iPad (10th gen, 10.9-inch)',
  'iPad mini (6th gen)',
];

// Legacy compatibility - extract dimensions only
export const DEVICE_DIMENSIONS: Record<
  string,
  { width: number; height: number }
> = Object.fromEntries(
  Object.entries(DEVICE_SPECS).map(([key, spec]) => [
    key,
    { width: spec.width, height: spec.height },
  ]),
);

// Legacy compatibility - extract clock zones only
export const LOCKSCREEN_CLOCK_ZONES: Record<string, number> =
  Object.fromEntries(
    Object.entries(DEVICE_SPECS).map(([key, spec]) => [key, spec.clockZone]),
  );
