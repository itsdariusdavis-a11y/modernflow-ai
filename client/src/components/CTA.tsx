/*
 * Design: Full-width CTA section with gradient background
 * Centered text with prominent CTA button
 * Font: Outfit headings, DM Sans body
 */
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCalendly } from "@/hooks/useCalendly";

export default function CTA() {
  const { openCalendly } = useCalendly();
  return (
    <section
      id="book"
      className="py-20 md:py-28 relative overflow-hidden"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00C896]/5 via-[#00A67E]/10 to-[#00B4D8]/5" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.35 }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="section-label mb-4">// Let's Build Your System</p>
          <h2
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Ready to stop losing leads and{" "}
            <span className="gradient-text">start growing?</span>
          </h2>
          <p className="text-[oklch(0.65_0.02_155.83)] text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Book a free strategy call and we'll show you exactly how we can automate
            your lead capture, follow-up, and conversion — tailored to your business.
          </p>
          <button onClick={openCalendly} className="cta-button text-lg !py-4 !px-8">
            Book My Free Strategy Call <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-[oklch(0.55_0.02_155.83)] text-sm mt-6">
            No commitment required. 100% free. Let's just talk.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
