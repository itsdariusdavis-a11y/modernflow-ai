/*
 * Design: Honest results section — what the system measures + founding-client offer
 * Replaces placeholder testimonials: every number here is either an industry
 * stat (cited) or a capability of the system we install. Real case studies
 * slot in as founding clients go live.
 * Font: Outfit headings, DM Sans body, JetBrains Mono labels
 */
import { motion } from "framer-motion";
import { PhoneCall, MessageSquare, Star, ArrowRight } from "lucide-react";
import { useCalendly } from "@/hooks/useCalendly";

const reportMetrics = [
  {
    icon: PhoneCall,
    title: "Calls captured",
    description:
      "Every missed call gets an instant text-back. You see exactly how many would-be voicemails became conversations instead.",
  },
  {
    icon: MessageSquare,
    title: "Leads responded to in under 5 minutes",
    description:
      "Speed-to-lead is the whole game — most businesses take hours. Your report shows response time on every single inquiry.",
  },
  {
    icon: Star,
    title: "Reviews gained",
    description:
      "Automated review requests after every completed job. Watch your Google rating and review count climb month over month.",
  },
];

export default function Results() {
  const { openCalendly } = useCalendly();
  return (
    <section
      id="results"
      className="py-20 md:py-28 border-t border-[oklch(0.696_0.17_162.48/8%)]"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.35 }}
          className="text-center mb-14"
        >
          <p className="section-label mb-4">// Measurable Results</p>
          <h2
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            You'll see the numbers{" "}
            <span className="gradient-text">every month.</span>
          </h2>
          <p className="text-[oklch(0.65_0.02_155.83)] mt-4 max-w-2xl mx-auto">
            No vague promises. Every client gets a monthly report with three
            numbers that either justify what you pay us — or don't. That's the
            deal.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {reportMetrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="glass-card p-7"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${i % 2 === 0 ? "bg-[#10b981]/10" : "bg-[#06b6d4]/10"}`}
                >
                  <Icon
                    className={`w-6 h-6 ${i % 2 === 0 ? "text-[#10b981]" : "text-[#06b6d4]"}`}
                  />
                </div>
                <h3
                  className="text-lg font-semibold text-white mb-3"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {metric.title}
                </h3>
                <p className="text-[oklch(0.65_0.02_155.83)] text-sm leading-relaxed">
                  {metric.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="glass-card p-8 md:p-10 text-center max-w-3xl mx-auto relative overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(16, 185, 129, 0.07), transparent 65%)",
            }}
            aria-hidden="true"
          />
          <div className="relative">
            <p className="section-label mb-4">// Founding Clients</p>
            <h3
              className="text-2xl md:text-3xl font-bold text-white mb-4"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Be one of our first ten —{" "}
              <span className="gradient-text">and pay like it.</span>
            </h3>
            <p className="text-[oklch(0.65_0.02_155.83)] leading-relaxed max-w-xl mx-auto mb-7">
              We're a new agency earning our case studies right now, and we're
              pricing like it: founding clients get the full Growth system with
              the setup fee waived, in exchange for letting us publish your
              before-and-after numbers. When the spots are gone, so is the
              pricing.
            </p>
            <button onClick={openCalendly} className="cta-button">
              Claim a Founding Spot <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
