/*
 * Design: Dark transparent navbar with green accent CTA
 * Font: Outfit for brand, DM Sans for nav links
 * Style: Solid bg, sticky top, green border-bottom on scroll
 */
import { useState, useEffect, useRef } from "react";
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
  const scrolledRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolledRef.current) {
        scrolledRef.current = isScrolled;
        setScrolled(isScrolled);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-[border-color,background-color] duration-300"
      style={{
        backgroundColor: scrolled
          ? "oklch(0.145 0.014 155.83 / 95%)"
          : "oklch(0.145 0.014 155.83 / 0%)",
        borderBottom: scrolled
          ? "1px solid oklch(0.696 0.17 162.48 / 12%)"
          : "1px solid transparent",
        willChange: "background-color",
        transform: "translateZ(0)",
      }}
    >
      <div className="container flex items-center justify-between h-[72px]">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5"
        >
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
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[oklch(0.65_0.02_155.83)] hover:text-[#00C896] transition-colors text-sm font-medium"
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
            className="md:hidden border-b border-[oklch(0.696_0.17_162.48/12%)]"
            style={{
              backgroundColor: "oklch(0.145 0.014 155.83 / 98%)",
            }}
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
