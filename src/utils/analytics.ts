/**
 * Google Analytics configuration and utility functions
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js',
      targetId: string,
      config?: Record<string, unknown>,
    ) => void;
    dataLayer?: unknown[];
  }
}

export const GA_TRACKING_ID = 'G-CC3F685LYS';

/**
 * Initialize Google Analytics
 */
export const initGA = (): void => {
  if (typeof window === 'undefined') return;

  // Load gtag script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script1);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(): void {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };

  window.gtag('js', new Date() as unknown as string);
  window.gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

/**
 * Track page views
 * @param {string} path - The page path to track
 * @param {string} [title] - Optional page title
 */
export const trackPageView = (path: string, title?: string): void => {
  if (!window.gtag) return;

  window.gtag('config', GA_TRACKING_ID, {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
};

/**
 * Track custom events
 * @param {string} action - The event action
 * @param {string} category - The event category
 * @param {string} [label] - Optional event label
 * @param {number} [value] - Optional event value
 */
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
): void => {
  if (!window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

/**
 * Track specific CollegeMate events
 */
export const trackCollegeMateEvent = {
  scheduleEdit: (): void => {
    trackEvent('schedule_edit', 'engagement', 'edit_mode_entered');
  },

  classAdd: (classType: 'scheduled' | 'online'): void => {
    trackEvent('class_add', 'engagement', classType);
  },

  classRemove: (classType: 'scheduled' | 'online'): void => {
    trackEvent('class_remove', 'engagement', classType);
  },

  scheduleDownload: (downloadType: 'image' | 'wallpaper'): void => {
    trackEvent('schedule_download', 'engagement', downloadType);
  },

  termChange: (termCode: string): void => {
    trackEvent('term_change', 'engagement', termCode);
  },

  tourComplete: (): void => {
    trackEvent('tour_complete', 'engagement', 'guided_tour');
  },

  tourSkip: (): void => {
    trackEvent('tour_skip', 'engagement', 'guided_tour');
  },
};
