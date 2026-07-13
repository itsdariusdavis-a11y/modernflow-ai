/*
 * Design: Testimonial cards with star ratings and real headshot photos
 * Glass-card styling, 3 columns on desktop
 * Green accent stars, circular avatar photos
 * Font: Outfit headings, DM Sans body
 */
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Mike Thompson",
    role: "Owner, Thompson Electric",
    location: "San Diego, CA",
    quote:
      "We went from missing 40% of our leads to responding to every single one in under 2 minutes. Our revenue jumped 35% in the first quarter alone.",
    stars: 5,
    photo:
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663029667540/GXtnUFss9AoWw228KaXxY6/testimonial-1-XGpvVk5WdGkYVwEfa4xnqS.webp",
  },
  {
    name: "Maria Gonzalez",
    role: "Owner, ClearFlow Plumbing",
    location: "Austin, TX",
    quote:
      "The AI assistant handles our after-hours calls perfectly. We're booking jobs at 11PM that we would have completely missed before. Game changer.",
    stars: 5,
    photo:
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663029667540/GXtnUFss9AoWw228KaXxY6/testimonial-2-CiPERiD4q35kYpoBYpciNK.webp",
  },
  {
    name: "David Williams",
    role: "Owner, Elite HVAC Solutions",
    location: "Phoenix, AZ",
    quote:
      "ModernFlow built us a system that runs itself. I spend zero time on follow-ups now, and our close rate went from 22% to 41% in 90 days.",
    stars: 5,
    photo:
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663029667540/GXtnUFss9AoWw228KaXxY6/testimonial-3-LNdUf5zEVaGjtTf2c9hcQW.webp",
  },
  {
    name: "Jennifer Walsh",
    role: "Owner, Walsh Roofing Co.",
    location: "Denver, CO",
    quote:
      "The paid ads campaign they built generates 30+ qualified leads per week. Best marketing investment we've ever made. ROI was positive in week two.",
    stars: 5,
    photo:
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663029667540/GXtnUFss9AoWw228KaXxY6/testimonial-4-GvUkNnscwNaV2tqbPyRA3n.webp",
  },
  {
    name: "Kevin Nguyen",
    role: "Owner, Nguyen Landscaping",
    location: "Portland, OR",
    quote:
      "Our Google reviews went from 47 to 180+ in six months. The automated review requests are a game-changer for our reputation and local SEO.",
    stars: 5,
    photo:
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663029667540/GXtnUFss9AoWw228KaXxY6/testimonial-5-RikxRFDncEjKWDfE3ehhEc.webp",
  },
  {
    name: "Robert Martinez",
    role: "Owner, Martinez General Contracting",
    location: "Los Angeles, CA",
    quote:
      "I was skeptical about AI, but the results speak for themselves. We've doubled our monthly revenue since implementing ModernFlow's system.",
    stars: 5,
    photo:
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663029667540/GXtnUFss9AoWw228KaXxY6/testimonial-6-4PYJmsqb9ywuFKoBfNNirE.webp",
  },
];

export default function Results() {
  return (
    <section
      id="results"
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
          <p className="section-label mb-4">// Real Results</p>
          <h2
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Contractors love <span className="gradient-text">the results.</span>
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
              className="glass-card p-7 flex flex-col"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-[#10b981] text-[#10b981]"
                  />
                ))}
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-6 italic flex-1">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={t.photo}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover object-top ring-2 ring-[#10b981]/20 flex-shrink-0"
                />
                <div>
                  <p
                    className="text-white font-semibold text-sm"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {t.name}
                  </p>
                  <p className="text-[oklch(0.55_0.02_155.83)] text-xs">
                    {t.role}
                  </p>
                  <p className="text-[#10b981]/70 text-xs">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
