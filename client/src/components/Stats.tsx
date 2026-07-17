/*
 * Design: Dark section with 4 stat cards in a row
 * Glass-card styling with green accent numbers
 * Font: Outfit for numbers, DM Sans for labels
 */
import { motion } from "framer-motion";
import { Clock, PhoneMissed, PhoneOff, Zap } from "lucide-react";

/*
 * Industry stats: Aira missed-call research (2026) — 62% of calls to small
 * businesses go unanswered; 85% of voicemail callers never call back.
 * Product stats (<5 min, 24/7) describe what the system we install does.
 */
const stats = [
  {
    icon: PhoneMissed,
    value: "62%",
    label: "Of Calls Go Unanswered",
    description: "At the average small service business",
  },
  {
    icon: PhoneOff,
    value: "85%",
    label: "Of Missed Callers Never Call Back",
    description: "They hire the next result on Google",
  },
  {
    icon: Clock,
    value: "< 5 min",
    label: "Response Time With Our System",
    description: "Every lead answered — even after hours",
  },
  {
    icon: Zap,
    value: "24/7",
    label: "Automation Running",
    description: "Your system never sleeps",
  },
];

export default function Stats() {
  return (
    <section className="py-20 md:py-28 border-t border-[oklch(0.696_0.17_162.48/8%)]">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="glass-card p-6 text-center"
              >
                <Icon
                  className={`w-6 h-6 mx-auto mb-3 ${i % 2 === 0 ? "text-[#10b981]" : "text-[#06b6d4]"}`}
                />
                <p
                  className="text-3xl md:text-4xl font-bold gradient-text mb-2"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-white font-medium text-sm mb-1"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {stat.label}
                </p>
                <p className="text-xs text-[oklch(0.55_0.02_155.83)]">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
