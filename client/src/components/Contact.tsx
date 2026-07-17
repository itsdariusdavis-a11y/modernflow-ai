/*
 * Design: Contact form section with glass-card styling
 * Left: Form fields (name, email, phone, business type, message)
 * Right: Quick info + Calendly CTA
 * Font: Outfit headings, DM Sans body
 * Brand: Dark bg, green accents, gradient-text
 * Backend: tRPC mutation → GoHighLevel Inbound Webhook
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, CheckCircle, Loader2 } from "lucide-react";
import { useCalendly } from "@/hooks/useCalendly";
import { CONTACT_EMAIL } from "@/config";
import { trpc } from "@/lib/trpc";

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
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submitMutation = trpc.contact.submit.useMutation();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Valid email is required";
    if (!form.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    submitMutation.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      businessType: form.businessType || undefined,
      message: form.message,
    });
  };

  const inputClass = (field: string) =>
    `w-full bg-[oklch(0.18_0.014_155.83)] border rounded-lg px-4 py-3 text-white placeholder:text-[oklch(0.45_0.02_155.83)] text-sm focus:outline-none transition-colors ${
      errors[field]
        ? "border-red-500/60 focus:border-red-500"
        : "border-[oklch(0.696_0.17_162.48/15%)] focus:border-[#10b981]/50"
    }`;

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
            Have questions? <span className="gradient-text">Let's talk.</span>
          </h2>
          <p className="text-[oklch(0.65_0.02_155.83)] mt-4 max-w-xl mx-auto">
            Fill out the form below and we'll get back to you within one
            business day. Or skip the wait and book a call directly.
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
            {submitMutation.isSuccess ? (
              <div className="glass-card p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
                <CheckCircle className="w-14 h-14 text-[#10b981] mb-5" />
                <h3
                  className="text-2xl font-bold text-white mb-3"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Message Received!
                </h3>
                <p className="text-[oklch(0.65_0.02_155.83)] mb-6">
                  Thanks for reaching out. We'll be in touch within one business
                  day. Want to talk sooner?
                </p>
                <button onClick={openCalendly} className="cta-button">
                  Book a Free Strategy Call <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass-card p-8 space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-medium text-white/80 mb-2"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Full Name <span className="text-[#10b981]">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      className={inputClass("name")}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-medium text-white/80 mb-2"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Email Address <span className="text-[#10b981]">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      className={inputClass("email")}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-sm font-medium text-white/80 mb-2"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="(555) 000-0000"
                      className={inputClass("phone")}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-businessType"
                      className="block text-sm font-medium text-white/80 mb-2"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Business Type
                    </label>
                    <select
                      id="contact-businessType"
                      name="businessType"
                      value={form.businessType}
                      onChange={handleChange}
                      className={`${inputClass("businessType")} appearance-none`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <option
                        value=""
                        className="bg-[oklch(0.18_0.014_155.83)]"
                      >
                        Select type...
                      </option>
                      {businessTypes.map(t => (
                        <option
                          key={t}
                          value={t}
                          className="bg-[oklch(0.18_0.014_155.83)]"
                        >
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-medium text-white/80 mb-2"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Tell us about your business{" "}
                    <span className="text-[#10b981]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="What's your biggest challenge right now? How many leads do you get per month?"
                    className={`${inputClass("message")} resize-none`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                  {errors.message && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                {submitMutation.isError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                    <p className="text-red-400 text-sm">
                      Something went wrong. Please try again or book a call
                      directly.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="cta-button w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <ArrowRight className="w-4 h-4" />
                    </>
                  )}
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
              <div className="w-10 h-10 rounded-lg bg-[#10b981]/15 flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-[#10b981]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3
                className="text-lg font-bold text-white mb-2"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Prefer to talk now?
              </h3>
              <p className="text-[oklch(0.65_0.02_155.83)] text-sm mb-5 leading-relaxed">
                Skip the form and book a free 30-minute strategy call directly
                on our calendar. We'll walk through your business and show you
                exactly what's possible.
              </p>
              <button
                onClick={openCalendly}
                className="cta-button w-full justify-center text-sm"
              >
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
                <div className="w-8 h-8 rounded-lg bg-[#10b981]/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#10b981]" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">Email</p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-[oklch(0.65_0.02_155.83)] text-sm hover:text-[#10b981] transition-colors"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#06b6d4]/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#06b6d4]" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">
                    Service Area
                  </p>
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
