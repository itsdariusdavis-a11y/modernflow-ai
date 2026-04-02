/*
 * Design: Dark transparent navbar with green accent CTA
 * Font: Outfit for brand, DM Sans for nav links
 * Style: Backdrop blur, sticky top, green border-bottom on scroll
 */
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Results", href: "#results" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[oklch(0.145_0.014_155.83/85%)] backdrop-blur-xl border-b border-[oklch(0.696_0.17_162.48/12%)]"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-[72px]">
        {/* Logo */}
        <a
          href="#"
          className="font-heading text-xl font-bold text-white tracking-tight"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Modern<span className="gradient-text">Flow</span>{" "}
          <span className="text-white font-light">AI</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[oklch(0.65_0.02_155.83)] hover:text-white transition-colors text-sm font-medium"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <a
          href="#book"
          className="hidden md:inline-flex cta-button text-sm !py-2.5 !px-5"
        >
          Book a Free Strategy Call <ArrowRight className="w-4 h-4" />
        </a>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[oklch(0.145_0.014_155.83/95%)] backdrop-blur-xl border-b border-[oklch(0.696_0.17_162.48/12%)]"
          >
            <div className="container py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[oklch(0.65_0.02_155.83)] hover:text-white transition-colors text-base font-medium py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#book"
                className="cta-button text-sm justify-center mt-2"
                onClick={() => setMobileOpen(false)}
              >
                Book a Free Strategy Call <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
