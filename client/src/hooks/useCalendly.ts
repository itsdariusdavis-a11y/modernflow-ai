// Hook to open Calendly popup widget
const CALENDLY_URL = "https://calendly.com/ryan-modernflowai/30min";

export function useCalendly() {
  const openCalendly = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    // Use Calendly popup widget if available, otherwise open in new tab
    if (typeof window !== "undefined" && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
    }
  };

  return { openCalendly };
}
