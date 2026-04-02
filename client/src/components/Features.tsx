/*
 * Design: Section with heading + 6 feature cards in 2x3 grid
 * Glass-card styling, green icons, dark background
 * Font: Outfit headings, DM Sans body, JetBrains Mono labels
 */
import { motion } from "framer-motion";
import { Bot, BarChart3, Megaphone, Workflow, Globe, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Lead Response",
    description: "Every lead gets a personalized response in under 5 minutes — via text, email, or chat. No more missed calls or slow follow-ups.",
  },
  {
    icon: BarChart3,
    title: "Smart CRM & Pipeline",
    description: "Track every lead from first touch to closed deal. Automated tagging, scoring, and pipeline management built for contractors.",
  },
  {
    icon: Megaphone,
    title: "Paid Ads That Convert",
    description: "Google & Facebook ad campaigns built specifically for service businesses. We manage everything from creative to conversion tracking.",
  },
  {
    icon: Workflow,
    title: "Full Automation Engine",
    description: "From lead capture to review requests — every step is automated. Follow-ups, reminders, booking confirmations, and more.",
  },
  {
    icon: Globe,
    title: "Website & Funnel Integration",
    description: "We add lead capture forms, chat widgets, and tracking to your existing website. No redesign needed — just more leads.",
  },
  {
    icon: ShieldCheck,
    title: "Reputation Management",
    description: "Automatically request reviews after every completed job. Monitor and respond to reviews from one dashboard.",
  },
];

export default function Features() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card p-7"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${i % 2 === 0 ? 'bg-[#00C896]/10' : 'bg-[#00B4D8]/10'}`}>
                  <Icon className={`w-6 h-6 ${i % 2 === 0 ? 'text-[#00C896]' : 'text-[#00B4D8]'}`} />
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
