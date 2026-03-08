/**
 * Analytics Utility
 * 
 * Provides runtime conditional loading of analytics scripts to avoid build warnings
 * when environment variables are not set, while still allowing analytics to be
 * enabled when properly configured.
 */

import { env } from './env';

/**
 * Analytics script interface
 */
interface AnalyticsScript {
  src: string;
  'data-website-id': string;
  defer: boolean;
}

/**
 * Load analytics script dynamically when enabled
 */
export function loadAnalytics(): void {
  if (!env.ENABLE_ANALYTICS) {
    return;
  }

  const endpoint = env.ANALYTICS_ENDPOINT;
  const websiteId = env.ANALYTICS_WEBSITE_ID;

  if (!endpoint || !websiteId) {
    console.warn('[Analytics] Analytics enabled but endpoint or website ID not configured');
    return;
  }

  // Check if script is already loaded
  const existingScript = document.querySelector(`script[src*="${endpoint}"]`);
  if (existingScript) {
    return;
  }

  // Create and append analytics script
  const script = document.createElement('script');
  script.src = `${endpoint}/umami`;
  script.setAttribute('data-website-id', websiteId);
  script.defer = true;

  // Add error handling
  script.onerror = () => {
    console.error('[Analytics] Failed to load analytics script');
  };

  script.onload = () => {
    console.info('[Analytics] Analytics script loaded successfully');
  };

  document.head.appendChild(script);
}

/**
 * Initialize analytics if enabled
 * This should be called early in the application lifecycle
 */
export function initializeAnalytics(): void {
  if (env.ENABLE_ANALYTICS) {
    // Load analytics after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadAnalytics);
    } else {
      loadAnalytics();
    }
  }
}
