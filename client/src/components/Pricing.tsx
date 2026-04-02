/*
 * Design: 3 pricing cards, middle one highlighted
 * Glass-card styling with green border on popular plan
 * Font: Outfit headings, DM Sans body
 */
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter",
    subtitle: "For contractors just getting started",
    setupFee: "$997",
    monthlyFee: "$297/mo",
    popular: false,
    features: [
      "Custom CRM setup & configuration",
      "AI lead response (SMS & email)",
      "Basic automation sequences",
      "Google review automation",
      "Mobile app access",
      "Email support",
    ],
    cta: "Get Started",
    href: "#book",
  },
  {
    name: "Growth",
    subtitle: "Our most popular package",
    setupFee: "$1,997",
    monthlyFee: "$497/mo",
    popular: true,
    features: [
      "Everything in Starter, plus:",
      "Advanced AI assistant (multi-channel)",
      "Full automation engine",
      "Website chat widget",
      "Appointment booking integration",
      "Reputation management dashboard",
      "Priority support",
      "Monthly strategy calls",
    ],
    cta: "Get Started",
    href: "#book",
  },
  {
    name: "Scale",
    subtitle: "For established businesses ready to dominate",
    setupFee: "Custom",
    monthlyFee: "Custom",
    popular: false,
    features: [
      "Everything in Growth, plus:",
      "Paid ads management (Google & Meta)",
      "Custom landing pages & funnels",
      "Advanced reporting & analytics",
      "Multi-location support",
      "Dedicated account manager",
      "Weekly strategy calls",
    ],
    cta: "Contact Us",
    href: "#book",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28 border-t border-[oklch(0.696_0.17_162.48/8%)]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="section-label mb-4">// Investment</p>
          <h2
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Simple, transparent{" "}
            <span className="gradient-text">pricing.</span>
          </h2>
          <p className="text-[oklch(0.65_0.02_155.83)] mt-4 max-w-2xl mx-auto">
            Every plan includes a one-time setup fee and a monthly platform fee. No hidden costs, no long-term contracts on automation services.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`glass-card p-7 relative flex flex-col ${
                plan.popular
                  ? "border-[oklch(0.696_0.17_162.48/40%)] shadow-[0_0_40px_oklch(0.696_0.17_162.48/10%)]"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[oklch(0.696_0.17_162.48)] text-[oklch(0.145_0.014_155.83)] text-xs font-bold px-4 py-1.5 rounded-full" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className="text-xl font-bold text-white mb-1"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {plan.name}
                </h3>
                <p className="text-[oklch(0.55_0.02_155.83)] text-sm">{plan.subtitle}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span
                    className="text-3xl font-bold gradient-text"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {plan.setupFee}
                  </span>
                  <span className="text-[oklch(0.55_0.02_155.83)] text-sm">setup</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {plan.monthlyFee}
                  </span>
                  <span className="text-[oklch(0.55_0.02_155.83)] text-sm">platform fee</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-[oklch(0.696_0.17_162.48)] shrink-0 mt-0.5" />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.href}
                className={plan.popular ? "cta-button justify-center" : "cta-button-outline justify-center"}
              >
                {plan.cta} <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
