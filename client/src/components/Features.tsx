/*
 * Design: Bento grid showcase — featured wide cell + supporting cells
 * Glass-card styling, brand-accent icons, dark background
 * Font: Outfit headings, DM Sans body, JetBrains Mono labels
 */
import { motion } from "framer-motion";
import {
  Bot,
  BarChart3,
  Megaphone,
  Workflow,
  Globe,
  ShieldCheck,
  Check,
} from "lucide-react";

const featured = {
  icon: Bot,
  title: "AI-Powered Lead Response",
  description:
    "Every lead gets a personalized response in under 5 minutes — via text, email, or chat. No more missed calls or slow follow-ups.",
  points: [
    "Missed-call text-back",
    "24/7 after-hours coverage",
    "Books appointments automatically",
  ],
};

const features = [
  {
    icon: BarChart3,
    title: "Smart CRM & Pipeline",
    description:
      "Track every lead from first touch to closed deal. Automated tagging, scoring, and pipeline management built for contractors.",
  },
  {
    icon: Megaphone,
    title: "Paid Ads That Convert",
    description:
      "Google & Facebook ad campaigns built specifically for service businesses. We manage everything from creative to conversion tracking.",
  },
  {
    icon: Workflow,
    title: "Full Automation Engine",
    description:
      "From lead capture to review requests — every step is automated. Follow-ups, reminders, booking confirmations, and more.",
  },
  {
    icon: Globe,
    title: "Website & Funnel Integration",
    description:
      "We add lead capture forms, chat widgets, and tracking to your existing website. No redesign needed — just more leads.",
  },
  {
    icon: ShieldCheck,
    title: "Reputation Management",
    description:
      "Automatically request reviews after every completed job. Monitor and respond to reviews from one dashboard.",
  },
];

export default function Features() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.35 }}
          className="text-center mb-14"
        >
          <p className="section-label mb-4">// What We Build For You</p>
          <h2
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Everything you need to{" "}
            <span className="gradient-text">dominate your market.</span>
          </h2>
        </motion.div>

        <div className="bento-grid">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.35 }}
            className="glass-card p-7 md:p-9 bento-featured relative overflow-hidden"
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 70% 80% at 85% 15%, rgba(16, 185, 129, 0.08), transparent 60%)",
              }}
              aria-hidden="true"
            />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-[#10b981]/10">
                <featured.icon className="w-6 h-6 text-[#10b981]" />
              </div>
              <h3
                className="text-xl md:text-2xl font-semibold text-white mb-3"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {featured.title}
              </h3>
              <p className="text-[oklch(0.65_0.02_155.83)] text-sm md:text-base leading-relaxed max-w-xl mb-5">
                {featured.description}
              </p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {featured.points.map(point => (
                  <li
                    key={point}
                    className="flex items-center gap-2 text-sm text-white/85"
                  >
                    <Check className="w-4 h-4 text-[#10b981] shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.35, delay: (i + 1) * 0.04 }}
                className="glass-card p-7"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${i % 2 === 0 ? "bg-[#06b6d4]/10" : "bg-[#10b981]/10"}`}
                >
                  <Icon
                    className={`w-6 h-6 ${i % 2 === 0 ? "text-[#06b6d4]" : "text-[#10b981]"}`}
                  />
                </div>
                <h3
                  className="text-lg font-semibold text-white mb-3"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {feature.title}
                </h3>
                <p className="text-[oklch(0.65_0.02_155.83)] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
