import ReactGA from "react-ga4";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "";

export const initGA = () => {
  if (GA_MEASUREMENT_ID) {
    ReactGA.initialize(GA_MEASUREMENT_ID);
  }
};

export const trackEvent = (name: string, params?: Record<string, any>) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", name, params);
  }
};
