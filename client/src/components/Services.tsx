/*
 * Design: Tabbed section showing 4 service areas with dashboard mockup images
 * Glass-card tabs, green active state, image on right
 * Font: Outfit headings, DM Sans body
 */
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { BarChart3, Bot, Megaphone, Workflow, Check } from "lucide-react";

const DASHBOARD_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029667540/GXtnUFss9AoWw228KaXxY6/dashboard-mockup-GXmLPAhW7o5GHbUhMkHGKZ.webp";
const AUTOMATION_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029667540/GXtnUFss9AoWw228KaXxY6/automation-flow-9dsxuiFhZbd325dkof37Tk.webp";

const services = [
  {
    id: "crm",
    icon: BarChart3,
    title: "CRM & Pipeline",
    subtitle: "Your command center for leads",
    description:
      "A fully customized CRM built for contractors. Track every lead, manage your pipeline, and never let a deal slip through the cracks.",
    features: [
      "Automated lead capture & tagging",
      "Visual deal pipeline",
      "Contact history & notes",
      "Mobile-friendly dashboard",
    ],
    image: DASHBOARD_IMG,
  },
  {
    id: "ai",
    icon: Bot,
    title: "AI Assistants",
    subtitle: "24/7 intelligent follow-up",
    description:
      "AI-powered assistants that respond to leads instantly via text, email, and webchat. They qualify leads, answer questions, and book appointments — all without you lifting a finger.",
    features: [
      "Sub-5-minute response time",
      "Natural language conversations",
      "Automatic appointment booking",
      "Multi-channel (SMS, email, chat)",
    ],
    image: AUTOMATION_IMG,
  },
  {
    id: "ads",
    icon: Megaphone,
    title: "Paid Ads Management",
    subtitle: "Leads on demand",
    description:
      "We build and manage high-converting Google and Facebook ad campaigns designed specifically for service businesses. From creative to conversion tracking — we handle it all.",
    features: [
      "Google Local Service Ads",
      "Facebook & Instagram campaigns",
      "Landing page optimization",
      "Monthly performance reports",
    ],
    image: DASHBOARD_IMG,
  },
  {
    id: "automation",
    icon: Workflow,
    title: "Automation Engine",
    subtitle: "Set it and forget it",
    description:
      "From the moment a lead comes in to the final review request — every step is automated. Follow-ups, reminders, booking confirmations, and review requests all run on autopilot.",
    features: [
      "Lead nurture sequences",
      "Appointment reminders",
      "Post-job review requests",
      "Re-engagement campaigns",
    ],
    image: AUTOMATION_IMG,
  },
];

export default function Services() {
  const [activeTab, setActiveTab] = useState(0);
  const active = services[activeTab];

  return (
    <section
      id="services"
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
          <p className="section-label mb-4">// Our Toolkit</p>
          <h2
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Your complete <span className="gradient-text">growth system.</span>
          </h2>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === i
                    ? "bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-[oklch(0.145_0.014_155.83)]"
                    : "glass-card text-[oklch(0.65_0.02_155.83)] hover:text-white"
                }`}
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                <Icon className="w-4 h-4" />
                {service.title}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-2 gap-10 items-center"
          >
            {/* Left: Text */}
            <div>
              <p className="section-label mb-3">// {active.subtitle}</p>
              <h3
                className="text-2xl md:text-3xl font-bold text-white mb-4"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {active.title}
              </h3>
              <p className="text-[oklch(0.65_0.02_155.83)] leading-relaxed mb-6">
                {active.description}
              </p>
              <ul className="space-y-3">
                {active.features.map(feature => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-white/90 text-sm"
                  >
                    <Check className="w-4 h-4 text-[#10b981] shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Image */}
            <div className="glass-card p-3 overflow-hidden">
              <img
                src={active.image}
                alt={active.title}
                className="w-full rounded-lg"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
