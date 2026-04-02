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
    subtitle: "Small Businesses",
    setupFee: "$1,000",
    monthlyFee: "$97/mo",
    popular: false,
    features: [
      "3-Page Website",
      "SEO Optimization",
      "Lead Capture",
      "Mobile-Friendly",
    ],
    cta: "Get Started",
    href: "#book",
  },
  {
    name: "Growth",
    subtitle: "Scaling Businesses",
    setupFee: "$2,000",
    monthlyFee: "$297/mo",
    popular: true,
    features: [
      "5-Page Website",
      "Booking System",
      "Payments",
      "Auto Reviews",
    ],
    cta: "Get Started",
    href: "#book",
  },
  {
    name: "Elite",
    subtitle: "Enterprises",
    setupFee: "$3,000",
    monthlyFee: "$697/mo",
    popular: false,
    features: [
      "10+ Page Website",
      "AI Voice Agent",
      "AI Chatbot",
      "Ongoing SEO",
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
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.35 }}
          className="text-center mb-14"
        >
          <p className="section-label mb-4">// Our Service Packages</p>
          <h2
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Choose Your{" "}
            <span className="gradient-text">Growth Plan.</span>
          </h2>
          <p className="text-[oklch(0.65_0.02_155.83)] mt-4 max-w-2xl mx-auto">
            Never Miss Another Customer — Capture Leads Around the Clock. Every plan includes a one-time setup fee and a monthly platform fee.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className={`glass-card p-7 relative flex flex-col ${
                plan.popular
                  ? "border-[oklch(0.696_0.17_162.48/40%)] shadow-[0_0_40px_oklch(0.696_0.17_162.48/10%)]"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#00C896] to-[#00B4D8] text-[oklch(0.145_0.014_155.83)] text-xs font-bold px-4 py-1.5 rounded-full" style={{ fontFamily: "'Outfit', sans-serif" }}>
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
                  <span className="text-[oklch(0.55_0.02_155.83)] text-sm">Setup</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {plan.monthlyFee}
                  </span>
                  <span className="text-[oklch(0.55_0.02_155.83)] text-sm">per month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-[#00C896] shrink-0 mt-0.5" />
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
