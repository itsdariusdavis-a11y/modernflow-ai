/*
 * Design: Full-width hero on layered brand-glow background (no remote image — fast LCP)
 * Left: Headline + subtext + CTAs + trust strip
 * Right: Live automation feed widget (animated)
 * Font: Outfit headings, DM Sans body
 */
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Zap,
  MessageSquare,
  Calendar,
  Star,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useCalendly } from "@/hooks/useCalendly";

const feedItems = [
  {
    icon: Zap,
    text: "New lead captured from Google Ads",
    time: "Just now",
    color: "text-[#10b981]",
  },
  {
    icon: MessageSquare,
    text: "AI assistant responded in 8 seconds",
    time: "2m ago",
    color: "text-[#06b6d4]",
  },
  {
    icon: Calendar,
    text: "Appointment booked — Tuesday 2PM",
    time: "5m ago",
    color: "text-[#10b981]",
  },
  {
    icon: Star,
    text: "5-star review request sent automatically",
    time: "12m ago",
    color: "text-[#06b6d4]",
  },
  {
    icon: Zap,
    text: "Follow-up sequence triggered for Mike R.",
    time: "18m ago",
    color: "text-[#10b981]",
  },
  {
    icon: MessageSquare,
    text: "Missed call auto-text sent to lead",
    time: "25m ago",
    color: "text-[#06b6d4]",
  },
];

function LiveFeed() {
  const [visibleItems, setVisibleItems] = useState(feedItems.slice(0, 4));
  const [currentIndex, setCurrentIndex] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const next = (prev + 1) % feedItems.length;
        setVisibleItems(items => {
          const newItem = feedItems[next];
          return [newItem, ...items.slice(0, 3)];
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card p-6 w-full max-w-md"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
        <span className="section-label !text-xs">Live Automation Feed</span>
      </div>
      <div className="space-y-3">
        {visibleItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={`${item.text}-${i}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-3 p-3 rounded-lg bg-[oklch(0.145_0.014_155.83/60%)] ${
                i === 0 ? "border border-[oklch(0.696_0.17_162.48/20%)]" : ""
              }`}
            >
              <Icon className={`w-4 h-4 mt-0.5 ${item.color} shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/90 leading-snug">
                  {item.text}
                </p>
                <p className="text-xs text-[oklch(0.55_0.02_155.83)] mt-1">
                  {item.time}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const { openCalendly } = useCalendly();
  return (
    <section className="relative min-h-screen flex items-center pt-[72px] overflow-hidden hero-glow">
      <div className="absolute inset-0 hero-grid-overlay" aria-hidden="true" />

      <div className="container relative z-10 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="section-label mb-6"
            >
              // Automation Beyond Limits
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Stop Losing Leads.{" "}
              <span className="gradient-text">Start Closing Jobs.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-lg md:text-xl text-[oklch(0.65_0.02_155.83)] max-w-xl mb-8 leading-relaxed"
            >
              We build AI-powered automation systems that capture, follow up,
              and convert leads for service businesses — so you never miss
              another opportunity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button onClick={openCalendly} className="cta-button">
                Book a Free Strategy Call <ArrowRight className="w-5 h-5" />
              </button>
              <a href="#how-it-works" className="cta-button-outline">
                See How It Works <ChevronRight className="w-5 h-5" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-10"
            >
              <p className="text-sm text-[oklch(0.65_0.02_155.83)]">
                <span className="text-white font-semibold">&lt; 5 min</span>{" "}
                response to every lead, 24/7
              </p>
              <span
                className="hidden sm:block w-px h-4 bg-white/15"
                aria-hidden="true"
              />
              <p className="text-sm text-[oklch(0.65_0.02_155.83)]">
                <span className="text-white font-semibold">Founder-built</span>{" "}
                — every system delivered personally
              </p>
              <span
                className="hidden sm:block w-px h-4 bg-white/15"
                aria-hidden="true"
              />
              <p className="text-sm text-[oklch(0.65_0.02_155.83)]">
                <span className="text-white font-semibold">30-day</span>{" "}
                money-back guarantee
              </p>
            </motion.div>
          </div>

          {/* Right: Live Feed */}
          <div className="flex justify-center lg:justify-end">
            <LiveFeed />
          </div>
        </div>
      </div>
    </section>
  );
}
