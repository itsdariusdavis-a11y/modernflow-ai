/*
 * Design: Testimonial cards with star ratings
 * Glass-card styling, 3 columns on desktop
 * Green accent stars, avatar initials
 * Font: Outfit headings, DM Sans body
 */
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Mike Thompson",
    role: "Thompson Electric, San Diego",
    quote: "We went from missing 40% of our leads to responding to every single one in under 2 minutes. Our revenue jumped 35% in the first quarter.",
    stars: 5,
    initials: "MT",
  },
  {
    name: "Sarah Chen",
    role: "ClearFlow Plumbing, Austin",
    quote: "The AI assistant handles our after-hours calls perfectly. We're booking jobs at 11PM that we would have completely missed before.",
    stars: 5,
    initials: "SC",
  },
  {
    name: "David Rodriguez",
    role: "Elite HVAC Solutions, Phoenix",
    quote: "ModernFlow built us a system that runs itself. I spend zero time on follow-ups now, and our close rate went from 22% to 41%.",
    stars: 5,
    initials: "DR",
  },
  {
    name: "James Wilson",
    role: "Wilson Roofing, Denver",
    quote: "The paid ads campaign they built generates 30+ qualified leads per week. Best marketing investment we've ever made.",
    stars: 5,
    initials: "JW",
  },
  {
    name: "Lisa Park",
    role: "GreenScape Landscaping, Portland",
    quote: "Our Google reviews went from 47 to 180+ in six months. The automated review requests are a game-changer for our reputation.",
    stars: 5,
    initials: "LP",
  },
  {
    name: "Robert Martinez",
    role: "Martinez General Contracting, LA",
    quote: "I was skeptical about AI, but the results speak for themselves. We've doubled our monthly revenue since implementing ModernFlow's system.",
    stars: 5,
    initials: "RM",
  },
];

export default function Results() {
  return (
    <section id="results" className="py-20 md:py-28 border-t border-[oklch(0.696_0.17_162.48/8%)]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.35 }}
          className="text-center mb-14"
        >
          <p className="section-label mb-4">// Real Results</p>
          <h2
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Contractors love{" "}
            <span className="gradient-text">the results.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="glass-card p-7"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#00C896] text-[#00C896]" />
                ))}
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i % 2 === 0 ? 'bg-[#00C896]/15' : 'bg-[#00B4D8]/15'}`}>
                  <span className={`text-xs font-bold ${i % 2 === 0 ? 'text-[#00C896]' : 'text-[#00B4D8]'}`} style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {t.name}
                  </p>
                  <p className="text-[oklch(0.55_0.02_155.83)] text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
