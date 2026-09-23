export { redactValue, redactHome, escapeHtml } from '../scripts/lib.mjs';

// mirror of app.js sanitizeUrl for testing the same rules
export function sanitizeProbe(href) {
  try {
    const u = new URL(href, 'http://localhost');
    if (!['http:', 'https:', 'mailto:'].includes(u.protocol)) return null;
    return u.href;
  } catch { return null; }
}
