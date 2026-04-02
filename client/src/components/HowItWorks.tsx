/*
 * Design: 4-step process with numbered cards
 * Vertical timeline on mobile, horizontal on desktop
 * Green accent numbers, glass-card steps
 * Font: Outfit headings, DM Sans body
 */
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Free Strategy Call",
    description: "We learn about your business, your goals, and where leads are falling through the cracks. No pressure, no pitch — just a conversation.",
  },
  {
    number: "02",
    title: "Custom System Build",
    description: "We design and build your complete automation system — CRM, AI assistants, follow-up sequences, and integrations. Everything tailored to your business.",
  },
  {
    number: "03",
    title: "Launch & Optimize",
    description: "We launch your system, train your team, and monitor performance. We optimize continuously to ensure maximum lead conversion.",
  },
  {
    number: "04",
    title: "Scale & Grow",
    description: "With your system running 24/7, you focus on what you do best — delivering great service. We handle the rest and help you scale.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 border-t border-[oklch(0.696_0.17_162.48/8%)]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.35 }}
          className="text-center mb-14"
        >
          <p className="section-label mb-4">// The Process</p>
          <h2
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            How it <span className="gradient-text">works.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="glass-card p-7 relative"
            >
              <span
                className="text-5xl font-bold gradient-text opacity-30 absolute top-4 right-6"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {step.number}
              </span>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-5 ${i % 2 === 0 ? 'bg-[#00C896]/10' : 'bg-[#00B4D8]/10'}`}>
                <span className={`font-bold text-sm ${i % 2 === 0 ? 'text-[#00C896]' : 'text-[#00B4D8]'}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {step.number}
                </span>
              </div>
              <h3
                className="text-lg font-semibold text-white mb-3"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {step.title}
              </h3>
              <p className="text-[oklch(0.65_0.02_155.83)] text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="text-center mt-12"
        >
          <a href="#book" className="cta-button">
            Book Your Free Strategy Call <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
