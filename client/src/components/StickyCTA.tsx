/*
 * Design: Floating sticky CTA bar — mobile only, appears after scrolling past the hero
 * Glass background, brand CTA button, safe-area aware
 * Font: Outfit for button text
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCalendly } from "@/hooks/useCalendly";

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const { openCalendly } = useCalendly();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.9);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3"
          style={{
            background:
              "linear-gradient(to top, oklch(0.145 0.014 155.83 / 96%) 60%, oklch(0.145 0.014 155.83 / 0%))",
          }}
        >
          <button
            onClick={openCalendly}
            className="cta-button w-full justify-center text-sm !py-3.5"
          >
            Book a Free Strategy Call <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
