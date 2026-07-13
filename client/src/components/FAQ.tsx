/*
 * Design: Accordion FAQ with glass-card items
 * Green active state text, smooth open/close animation
 * Font: Outfit headings, DM Sans body
 */
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    q: "I'm not tech-savvy. Will I be able to use this?",
    a: "Absolutely. We handle 100% of the setup, integration, and training. Your system is built to be as simple as checking your phone. If you can send a text message, you can use your new CRM. Plus, we provide ongoing support whenever you need it.",
  },
  {
    q: "How is this different from just buying software myself?",
    a: "Most software gives you a blank canvas and says 'figure it out.' We build you a finished, working system — customized to your specific business, integrated with your existing tools, and optimized to book more jobs. It's the difference between buying a pile of lumber and moving into a finished house.",
  },
  {
    q: "What if it doesn't work for my business?",
    a: "We offer a 30-day money-back guarantee. If you don't see value in the system we build, you get a full refund. We've never had to issue one — but the guarantee is there because we're confident in what we deliver.",
  },
  {
    q: "Do I own my accounts and data?",
    a: "Yes, 100%. Your CRM, your ad accounts, your data — it's all yours. If you ever decide to part ways, everything stays with you. We never hold your business hostage.",
  },
  {
    q: "How long before I start seeing results?",
    a: "Most contractors see their first automated leads within the first week of launch. For paid ads, we typically see meaningful traction within 30–60 days as campaigns optimize. The automation system starts working immediately — every lead gets a response in under 5 minutes, 24/7.",
  },
  {
    q: "What's the minimum commitment?",
    a: "For automation services, there's no long-term contract — just the setup fee and monthly platform fee. For paid ads management, we require a 90-day minimum commitment because ad campaigns need time to optimize and deliver real results.",
  },
  {
    q: "I already have a website. Do I need to change it?",
    a: "No. We integrate with your existing website, not replace it. We add lead capture forms, chat widgets, and tracking — all designed to work with what you already have.",
  },
  {
    q: "What types of contractors do you work with?",
    a: "We specialize in home service contractors — electricians, plumbers, HVAC technicians, general contractors, roofers, landscapers, and similar trades. If you're a service-based business that books jobs, we can help.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      className="py-20 md:py-28 border-t border-[oklch(0.696_0.17_162.48/8%)]"
    >
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
                    className="text-left font-heading font-semibold text-white hover:text-[#10b981] hover:no-underline transition-colors py-5 text-base md:text-lg data-[state=open]:text-[#10b981]"
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

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="text-center mt-12"
          >
            <p className="text-[oklch(0.55_0.02_155.83)] mb-4">
              Still have questions? Let's talk.
            </p>
            <a href="#book" className="cta-button-outline text-base">
              Book a Free Call <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
