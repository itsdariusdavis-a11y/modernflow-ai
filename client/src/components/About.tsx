/*
 * Design: Split layout - image left, text right
 * Contractor photo with glass-card overlay badges
 * Font: Outfit headings, DM Sans body
 */
import { motion } from "framer-motion";
import { MapPin, Users, Clock } from "lucide-react";

const CONTRACTOR_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029667540/GXtnUFss9AoWw228KaXxY6/contractor-working-EHYj8tcmvND9cdk39UWPR6.webp";

const badges = [
  { icon: MapPin, text: "Based in San Diego, CA" },
  { icon: Users, text: "150+ contractors served" },
  { icon: Clock, text: "Systems built in 2–3 weeks" },
];

export default function About() {
  return (
    <section className="py-20 md:py-28 border-t border-[oklch(0.696_0.17_162.48/8%)]">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={CONTRACTOR_IMG}
              alt="Contractor working"
              className="rounded-2xl w-full object-cover max-h-[500px]"
            />
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
          >
            <p className="section-label mb-4">// Who We Are</p>
            <h2
              className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              We Are <span className="gradient-text">ModernFlow AI.</span>
            </h2>
            <p className="text-[oklch(0.65_0.02_155.83)] italic mb-6">
              Your Automation Partner.
            </p>
            <div className="space-y-4 text-[oklch(0.65_0.02_155.83)] leading-relaxed">
              <p>
                ModernFlow AI was founded on a simple principle: service
                business owners should focus on their craft, not on chasing
                leads and managing paperwork.
              </p>
              <p>
                Too many potential clients slip through the cracks due to missed
                calls, slow follow-up, and a lack of a centralized system. We've
                seen it happen to hundreds of contractors — good businesses
                losing revenue because they can't respond fast enough.
              </p>
              <p>
                We solve this by implementing powerful, AI-driven automation
                that handles the entire client lifecycle — from first contact to
                the final review request. Our platform acts as the central brain
                for your business, ensuring every lead is captured, nurtured,
                and converted.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              {badges.map(badge => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.text}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[oklch(0.18_0.014_155.83/80%)] border border-[oklch(0.696_0.17_162.48/12%)]"
                  >
                    <Icon className="w-4 h-4 text-[#10b981]" />
                    <span className="text-white/80 text-sm">{badge.text}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
