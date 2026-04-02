/*
 * Design: Dark section with 4 stat cards in a row
 * Glass-card styling with green accent numbers
 * Font: Outfit for numbers, DM Sans for labels
 */
import { motion } from "framer-motion";
import { Clock, TrendingUp, Users, Zap } from "lucide-react";

const stats = [
  { icon: Clock, value: "< 5 min", label: "Average Lead Response Time", description: "AI responds to every inquiry instantly" },
  { icon: TrendingUp, value: "3.2x", label: "Average ROI Increase", description: "Within the first 90 days" },
  { icon: Users, value: "150+", label: "Contractors Served", description: "Across 20+ service categories" },
  { icon: Zap, value: "24/7", label: "Automation Running", description: "Your system never sleeps" },
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
                <Icon className={`w-6 h-6 mx-auto mb-3 ${i % 2 === 0 ? 'text-[#00C896]' : 'text-[#00B4D8]'}`} />
                <p
                  className="text-3xl md:text-4xl font-bold gradient-text mb-2"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {stat.value}
                </p>
                <p className="text-white font-medium text-sm mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {stat.label}
                </p>
                <p className="text-xs text-[oklch(0.55_0.02_155.83)]">{stat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
