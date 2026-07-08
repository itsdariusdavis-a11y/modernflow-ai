/*
 * Design: Standalone sales page for "The AI Agency Launch Kit" digital product
 * Reuses the site's brand system: glass-card, gradient-text, section-label,
 * cta-button / cta-button-outline utility classes (see index.css)
 * Font: Outfit headings, DM Sans body, JetBrains Mono section labels
 */
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Check,
  ClipboardList,
  Mail,
  Repeat,
  Sparkles,
  LayoutDashboard,
  Clapperboard,
} from "lucide-react";
import { Link } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// TODO: replace with live Lemon Squeezy checkout URLs (see products/agency-launch-kit/LAUNCH-CHECKLIST.md)
const CHECKOUT_URLS = {
  playbook: "#",
  toolkit: "#",
  agencyInABox: "#",
};

const whatsInside = [
  {
    icon: ClipboardList,
    title: "Agency Operating Playbook",
    description:
      "10 step-by-step SOPs covering lead gen, cold outreach, CRM onboarding, booking, meeting intel, content, comms, and weekly reporting.",
  },
  {
    icon: Mail,
    title: "Cold Email Machine",
    description:
      "4 importable n8n workflows: Apollo lead sourcing, AI-personalized outreach drip, AI reply scoring + auto-response, and Calendly booking alerts.",
  },
  {
    icon: Repeat,
    title: "Client Follow-Up System",
    description:
      "Done-for-you ServiceTitan post-job SMS + email follow-up workflows with opt-out compliance and a 10-minute-per-client cloning SOP.",
  },
  {
    icon: Sparkles,
    title: "Operator Prompt Pack",
    description:
      "8 battle-tested prompt templates: proposals, prospect qualification, morning brief, weekly review, GHL build prompts, and more.",
  },
  {
    icon: LayoutDashboard,
    title: "Agency Command Center",
    description:
      "A zero-dependency web app with an MRR dashboard, 30-day sprint checklist, pipeline tracker, and built-in sales scripts.",
  },
  {
    icon: Clapperboard,
    title: "Creative Engine",
    description:
      "The UGC production system and a 40-template static ad generator with a brand-research prompt pipeline.",
  },
];

const whoItsFor = [
  "Freelancers productizing into an agency.",
  "Agency owners adding an AI automation service line.",
  "Operators who want proven systems instead of a $2,000 course.",
];

type Tier = {
  name: string;
  price: string;
  subtitle: string;
  badge?: string;
  popular: boolean;
  features: string[];
  checkoutUrl: string;
};

const tiers: Tier[] = [
  {
    name: "The Playbook",
    price: "$97",
    subtitle: "For validating the model",
    popular: false,
    features: [
      "10 SOPs",
      "Full business plan + 30-day launch plan",
      "8 operator prompt templates",
      "Cold email scripts + objection handling",
    ],
    checkoutUrl: CHECKOUT_URLS.playbook,
  },
  {
    name: "The Automation Toolkit",
    price: "$297",
    subtitle: "Everything in Playbook, plus:",
    badge: "Most popular",
    popular: true,
    features: [
      "6 importable n8n workflows",
      "Setup runbooks",
      "GoHighLevel integration guide",
      "Client onboarding + client-guide templates",
    ],
    checkoutUrl: CHECKOUT_URLS.toolkit,
  },
  {
    name: "Agency-in-a-Box",
    price: "$497",
    subtitle: "Everything in Toolkit, plus:",
    popular: false,
    features: [
      "The Command Center app",
      "The UGC Creative Engine system (8 docs)",
      "The Static Ad Generator (40 templates + brand research pipeline)",
      "Commercial use license for client work",
    ],
    checkoutUrl: CHECKOUT_URLS.agencyInABox,
  },
];

const faqItems = [
  {
    q: "Do I need to know how to code?",
    a: "No — workflows import into n8n; docs are plain English.",
  },
  {
    q: "What tools do I need?",
    a: "n8n, plus free/cheap accounts on Apollo, Gmail, and optionally GoHighLevel, Twilio, ServiceTitan depending on which systems you deploy — the guides list exact requirements.",
  },
  {
    q: "Is this a course?",
    a: "No — it's the actual working system: files, workflows, and SOPs, not videos.",
  },
  {
    q: "Refunds?",
    a: "14-day money-back guarantee, no questions asked.",
  },
];

function BuyButton({ tier }: { tier: Tier }) {
  const comingSoon = tier.checkoutUrl === "#";
  const baseClass = tier.popular
    ? "cta-button justify-center"
    : "cta-button-outline justify-center";

  if (comingSoon) {
    return (
      <span
        aria-disabled="true"
        className={`${baseClass} opacity-50 pointer-events-none select-none`}
      >
        Coming soon
      </span>
    );
  }

  return (
    <a
      href={tier.checkoutUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={baseClass}
    >
      Get {tier.name} <ArrowRight className="w-4 h-4" />
    </a>
  );
}

export default function Toolkit() {
  return (
    <div className="min-h-screen bg-[oklch(0.145_0.014_155.83)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[oklch(0.696_0.17_162.48/12%)] bg-[oklch(0.145_0.014_155.83/95%)]">
        <div className="container flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-center gap-2.5">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029667540/GXtnUFss9AoWw228KaXxY6/logo-green-solid-icon-eq6vWGfcUacBZsGt7wW64F.webp"
              alt="ModernFlow AI"
              className="h-9 w-9"
            />
            <span
              className="font-heading text-xl font-bold text-white tracking-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Modern<span className="gradient-text">Flow</span>{" "}
              <span className="text-white/70 font-light">AI</span>
            </span>
          </Link>

          <a href="#pricing" className="cta-button text-sm !py-2.5 !px-5">
            Get the Kit <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="container relative z-10 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="section-label mb-6"
          >
            // THE AI AGENCY LAUNCH KIT
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-6"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Start your{" "}
            <span className="gradient-text">AI automation agency</span> with the
            systems ours actually runs on.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-lg md:text-xl text-[oklch(0.65_0.02_155.83)] max-w-2xl mb-8 leading-relaxed"
          >
            Every SOP, automation workflow, prompt template, and sales asset we
            use to sell and deliver AI automation to service businesses —
            packaged so you can launch without building from scratch.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a href="#pricing" className="cta-button">
              Get the Kit <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#whats-inside" className="cta-button-outline">
              See what's inside <ChevronRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* What's inside */}
      <section
        id="whats-inside"
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
            <p className="section-label mb-4">// What's Inside</p>
            <h2
              className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Everything we use to{" "}
              <span className="gradient-text">run this agency.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whatsInside.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  className="glass-card p-7"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                      i % 2 === 0 ? "bg-[#00C896]/10" : "bg-[#00B4D8]/10"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        i % 2 === 0 ? "text-[#00C896]" : "text-[#00B4D8]"
                      }`}
                    />
                  </div>
                  <h3
                    className="text-lg font-semibold text-white mb-3"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[oklch(0.65_0.02_155.83)] text-sm leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-20 md:py-28 border-t border-[oklch(0.696_0.17_162.48/8%)]">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.35 }}
            className="text-center mb-12"
          >
            <p className="section-label mb-4">// Who It's For</p>
            <h2
              className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Built for people who'd rather{" "}
              <span className="gradient-text">ship than start from zero.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="glass-card p-7"
          >
            <ul className="space-y-4">
              {whoItsFor.map(point => (
                <li key={point} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00C896] shrink-0 mt-0.5" />
                  <span className="text-white/80">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
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
            <p className="section-label mb-4">// Get The Kit</p>
            <h2
              className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Pick your <span className="gradient-text">starting point.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className={`glass-card p-7 relative flex flex-col ${
                  tier.popular
                    ? "border-[oklch(0.696_0.17_162.48/40%)] shadow-[0_0_40px_oklch(0.696_0.17_162.48/10%)]"
                    : ""
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className="bg-gradient-to-r from-[#00C896] to-[#00B4D8] text-[oklch(0.145_0.014_155.83)] text-xs font-bold px-4 py-1.5 rounded-full"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3
                    className="text-xl font-bold text-white mb-1"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {tier.name}
                  </h3>
                  <p className="text-[oklch(0.55_0.02_155.83)] text-sm">
                    {tier.subtitle}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-3xl font-bold gradient-text"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {tier.price}
                    </span>
                    <span className="text-[oklch(0.55_0.02_155.83)] text-sm">
                      one-time
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map(feature => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                    >
                      <Check className="w-4 h-4 text-[#00C896] shrink-0 mt-0.5" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <BuyButton tier={tier} />
              </motion.div>
            ))}
          </div>

          <p className="text-center text-[oklch(0.55_0.02_155.83)] text-sm mt-10 max-w-2xl mx-auto">
            One-time payment. Instant download. Use it for your own agency and
            your clients — resale of the kit itself isn't permitted.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 border-t border-[oklch(0.696_0.17_162.48/8%)]">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.35 }}
              className="text-center mb-14"
            >
              <p className="section-label mb-4">// Common Questions</p>
              <h2
                className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Got questions?{" "}
                <span className="gradient-text">We've got answers.</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              <Accordion type="single" collapsible className="space-y-3">
                {faqItems.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="glass-card px-6 py-1 border-none data-[state=open]:border-[oklch(0.696_0.17_162.48/20%)]"
                  >
                    <AccordionTrigger
                      className="text-left font-heading font-semibold text-white hover:text-[#00C896] hover:no-underline transition-colors py-5 text-base md:text-lg data-[state=open]:text-[#00C896]"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-[oklch(0.65_0.02_155.83)] leading-relaxed pb-5 text-base">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-16 border-t border-[oklch(0.696_0.17_162.48/8%)]">
        <div className="container text-center max-w-2xl mx-auto">
          <h2
            className="font-heading text-2xl sm:text-3xl font-bold leading-tight mb-4"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Ready to <span className="gradient-text">launch your agency?</span>
          </h2>
          <a
            href="#pricing"
            className="cta-button justify-center inline-flex mb-6"
          >
            Get the Kit <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-[oklch(0.55_0.02_155.83)] text-sm">
            Want it done for you instead?{" "}
            <Link href="/" className="text-[#00C896] hover:underline">
              That's our agency.
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
