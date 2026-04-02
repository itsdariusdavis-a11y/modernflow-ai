/*
 * Design: Contact form section with glass-card styling
 * Left: Form fields (name, email, phone, business type, message)
 * Right: Quick info + Calendly CTA
 * Font: Outfit headings, DM Sans body
 * Brand: Dark bg, green accents, gradient-text
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { useCalendly } from "@/hooks/useCalendly";

const businessTypes = [
  "HVAC",
  "Plumbing",
  "Electrical",
  "Roofing",
  "Landscaping",
  "General Contracting",
  "Cleaning Services",
  "Other",
];

export default function Contact() {
  const { openCalendly } = useCalendly();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production this would POST to a backend or form service
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
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
          <p className="section-label mb-4">// Get In Touch</p>
          <h2
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Have questions?{" "}
            <span className="gradient-text">Let's talk.</span>
          </h2>
          <p className="text-[oklch(0.65_0.02_155.83)] mt-4 max-w-xl mx-auto">
            Fill out the form below and we'll get back to you within one business day.
            Or skip the wait and book a call directly.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <div className="glass-card p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
                <CheckCircle className="w-14 h-14 text-[#00C896] mb-5" />
                <h3
                  className="text-2xl font-bold text-white mb-3"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Message Received!
                </h3>
                <p className="text-[oklch(0.65_0.02_155.83)] mb-6">
                  Thanks for reaching out. We'll be in touch within one business day.
                  Want to talk sooner?
                </p>
                <button onClick={openCalendly} className="cta-button">
                  Book a Free Strategy Call <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      className="block text-sm font-medium text-white/80 mb-2"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Full Name <span className="text-[#00C896]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      className="w-full bg-[oklch(0.18_0.014_155.83)] border border-[oklch(0.696_0.17_162.48/15%)] rounded-lg px-4 py-3 text-white placeholder:text-[oklch(0.45_0.02_155.83)] text-sm focus:outline-none focus:border-[#00C896]/50 transition-colors"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-white/80 mb-2"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Email Address <span className="text-[#00C896]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      className="w-full bg-[oklch(0.18_0.014_155.83)] border border-[oklch(0.696_0.17_162.48/15%)] rounded-lg px-4 py-3 text-white placeholder:text-[oklch(0.45_0.02_155.83)] text-sm focus:outline-none focus:border-[#00C896]/50 transition-colors"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      className="block text-sm font-medium text-white/80 mb-2"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="(555) 000-0000"
                      className="w-full bg-[oklch(0.18_0.014_155.83)] border border-[oklch(0.696_0.17_162.48/15%)] rounded-lg px-4 py-3 text-white placeholder:text-[oklch(0.45_0.02_155.83)] text-sm focus:outline-none focus:border-[#00C896]/50 transition-colors"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-white/80 mb-2"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Business Type
                    </label>
                    <select
                      name="businessType"
                      value={form.businessType}
                      onChange={handleChange}
                      className="w-full bg-[oklch(0.18_0.014_155.83)] border border-[oklch(0.696_0.17_162.48/15%)] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00C896]/50 transition-colors appearance-none"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <option value="" className="bg-[oklch(0.18_0.014_155.83)]">Select type...</option>
                      {businessTypes.map((t) => (
                        <option key={t} value={t} className="bg-[oklch(0.18_0.014_155.83)]">{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-white/80 mb-2"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Tell us about your business <span className="text-[#00C896]">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="What's your biggest challenge right now? How many leads do you get per month?"
                    className="w-full bg-[oklch(0.18_0.014_155.83)] border border-[oklch(0.696_0.17_162.48/15%)] rounded-lg px-4 py-3 text-white placeholder:text-[oklch(0.45_0.02_155.83)] text-sm focus:outline-none focus:border-[#00C896]/50 transition-colors resize-none"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>

                <button type="submit" className="cta-button w-full justify-center">
                  Send Message <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>

          {/* Right: Info + Calendly CTA */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Calendly CTA card */}
            <div className="glass-card p-7 border-[oklch(0.696_0.17_162.48/30%)]">
              <div className="w-10 h-10 rounded-lg bg-[#00C896]/15 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#00C896]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3
                className="text-lg font-bold text-white mb-2"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Prefer to talk now?
              </h3>
              <p className="text-[oklch(0.65_0.02_155.83)] text-sm mb-5 leading-relaxed">
                Skip the form and book a free 30-minute strategy call directly on our calendar.
                We'll walk through your business and show you exactly what's possible.
              </p>
              <button onClick={openCalendly} className="cta-button w-full justify-center text-sm">
                Book a Free Strategy Call <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Contact info */}
            <div className="glass-card p-7 space-y-5">
              <h3
                className="text-base font-bold text-white mb-1"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Contact Info
              </h3>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00C896]/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#00C896]" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">Email</p>
                  <a
                    href="mailto:ryan@modernflowai.com"
                    className="text-[oklch(0.65_0.02_155.83)] text-sm hover:text-[#00C896] transition-colors"
                  >
                    ryan@modernflowai.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00B4D8]/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#00B4D8]" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">Phone</p>
                  <a
                    href="tel:+1-800-000-0000"
                    className="text-[oklch(0.65_0.02_155.83)] text-sm hover:text-[#00C896] transition-colors"
                  >
                    Available on strategy call
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00C896]/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#00C896]" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">Service Area</p>
                  <p className="text-[oklch(0.65_0.02_155.83)] text-sm">
                    Serving businesses nationwide
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
