/*
 * Business contact configuration — single source of truth.
 * Override per-deploy with Vite env vars so booking/contact identity
 * is not hardcoded to any one person (VITE_CALENDLY_URL, VITE_CONTACT_EMAIL).
 */
export const CALENDLY_URL =
  import.meta.env.VITE_CALENDLY_URL ||
  "https://calendly.com/ryan-modernflowai/30min";

export const CONTACT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL || "ryan@modernflowai.com";
