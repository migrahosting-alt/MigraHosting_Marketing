export function track(event, payload = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload, ts: Date.now() });

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log("[track]", event, payload);
  }
}
