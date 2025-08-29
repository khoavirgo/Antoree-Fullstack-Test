declare global {
  interface Window {
    gtag: (
      command: string,
      event: string,
      options?: Record<string, unknown>
    ) => void;
    dataLayer: Record<string, unknown>[];
  }
}
