export function trackEvent(name: string, props: Record<string, any> = {}) {
  try {
    // gtag (Google Analytics / GA4)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', name, props);
      return;
    }
    // fallback: POST to a custom analytics endpoint
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: name, props }),
    }).catch(() => {});
  } catch {
    // ignore errors in tracking
  }
}
