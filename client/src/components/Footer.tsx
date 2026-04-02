/*
 * Design: Dark footer with 4 columns
 * Logo, services, company, legal links
 * Font: Outfit headings, DM Sans body
 */

const footerLinks = {
  services: [
    { label: "CRM & Pipeline", href: "#services" },
    { label: "AI Assistants", href: "#services" },
    { label: "Paid Ads Management", href: "#services" },
    { label: "Automation Engine", href: "#services" },
  ],
  company: [
    { label: "About Us", href: "#about" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="py-16 border-t border-[oklch(0.696_0.17_162.48/8%)]">
      <div className="container">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <a
              href="#"
              className="flex items-center gap-2.5 mb-4"
            >
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029667540/GXtnUFss9AoWw228KaXxY6/logo-v2-AUfha38so65wrTLhTbAgFp.webp"
                alt="ModernFlow AI"
                className="h-8 w-8"
              />
              <span
                className="font-heading text-xl font-bold text-white tracking-tight"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Modern<span className="gradient-text">Flow</span>{" "}
                <span className="text-white/70 font-light">AI</span>
              </span>
            </a>
            <p className="text-[oklch(0.55_0.02_155.83)] text-sm leading-relaxed">
              AI-powered automation systems for service businesses. Capture more leads,
              close more jobs, grow faster.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4
              className="text-white font-semibold mb-4 text-sm"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Services
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[oklch(0.55_0.02_155.83)] hover:text-[#00C896] transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4
              className="text-white font-semibold mb-4 text-sm"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[oklch(0.55_0.02_155.83)] hover:text-[#00C896] transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              className="text-white font-semibold mb-4 text-sm"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Legal
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[oklch(0.55_0.02_155.83)] hover:text-[#00C896] transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[oklch(0.696_0.17_162.48/8%)] text-center">
          <p className="text-[oklch(0.45_0.02_155.83)] text-sm">
            &copy; {new Date().getFullYear()} ModernFlow AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
