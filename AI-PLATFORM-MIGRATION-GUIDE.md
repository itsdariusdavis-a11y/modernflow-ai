# ModernFlow AI - AI Platform Migration Guide

**For Lovable, Bolt.new, v0.dev, Replit, or Claude Projects**

This guide shows you how to recreate the ModernFlow AI website on AI-powered development platforms that support React + TypeScript + Tailwind CSS.

---

## Quick Start

### Option 1: Upload the Source Code Archive (Recommended)

1. **Download the source code archive:**
   - [ModernFlow AI Source Code (200KB)](https://files.manuscdn.com/user_upload_by_module/session_file/310419663029667540/yXyJMRmShhVMcwjT.gz)

2. **Extract the archive** on your local machine:
   ```bash
   tar -xzf modernflow-ai-source.tar.gz
   cd modernflow-ai
   ```

3. **Upload to your AI platform:**
   - **Lovable**: Create a new project → Import from GitHub/ZIP → upload the extracted folder
   - **Bolt.new**: Drag and drop the entire `modernflow-ai` folder into the file tree
   - **v0.dev**: Not recommended (v0 is component-focused, not full-app)
   - **Replit**: Create new Repl → Import from GitHub → upload as ZIP
   - **Claude Projects**: Attach the entire folder as context, then ask Claude to "help me set up and run this React project"

4. **Install dependencies** (if needed):
   ```bash
   pnpm install
   # or
   npm install
   ```

5. **Run the dev server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

---

### Option 2: Prompt-Based Recreation (For Claude, ChatGPT, or AI Agents)

If you want an AI agent to rebuild the site from scratch instead of importing code, use this prompt:

```
I need you to recreate a website exactly as described below. This is a single-page React + TypeScript + Tailwind CSS website for a contractor automation agency called ModernFlow AI.

**Tech Stack:**
- React 19 + TypeScript
- Tailwind CSS 4 (with custom OKLCH colors)
- Framer Motion for animations
- Lucide React for icons
- Calendly integration (popup widget)
- shadcn/ui components (optional, for forms/accordions)

**Design System:**
- **Background:** Dark theme — `oklch(0.145 0.014 155.83)` (very dark green-gray)
- **Primary accent:** Emerald green `#00C896` (for CTAs, highlights)
- **Secondary accent:** Teal/cyan `#00B4D8` (for alternating icons)
- **Gradient text:** Linear gradient from `#00C896` to `#00B4D8` to `#0096C7`
- **Glass-card style:** Semi-transparent dark cards with subtle borders — `background: oklch(0.16 0.014 155.83 / 40%)`, `border: 1px solid oklch(0.696 0.17 162.48 / 8%)`
- **Typography:**
  - Headings: **Outfit** (Google Fonts)
  - Body: **DM Sans** (Google Fonts)
  - Code/labels: **JetBrains Mono** (Google Fonts)
- **Section labels:** Small green monospace labels like `// SECTION NAME` above each heading

**Logo:**
- Use this CDN URL: `https://d2xsxph8kpxj0f.cloudfront.net/310419663029667540/GXtnUFss9AoWw228KaXxY6/logo-green-solid-icon-eq6vWGfcUacBZsGt7wW64F.webp`
- Geometric "M" icon in emerald green
- Brand name: "ModernFlow AI" (with "Flow" in gradient green, "AI" in light gray)

**Sections (in order):**

1. **Navbar (Sticky)**
   - Logo + brand name on left
   - Nav links: Services, How It Works, Results, Pricing, FAQ, Contact
   - CTA button: "Book a Free Strategy Call" (opens Calendly popup)
   - Mobile hamburger menu

2. **Hero Section**
   - Left: Headline "Stop Losing Leads. Start Closing Jobs." (with "Start Closing Jobs." in gradient)
   - Subheading: "We build AI-powered automation systems that capture, follow up, and convert leads for service businesses — so you never miss another opportunity."
   - Two CTAs: "Book a Free Strategy Call" (primary green button, opens Calendly) + "See How It Works" (outline button, scrolls to #how-it-works)
   - Right: **Live Automation Feed** widget (glass card) showing 4 animated items that rotate every 3 seconds:
     - "New lead captured from Google Ads" (Zap icon, green)
     - "AI assistant responded in 8 seconds" (MessageSquare icon, teal)
     - "Appointment booked — Tuesday 2PM" (Calendar icon, green)
     - "5-star review request sent automatically" (Star icon, teal)
     - "Follow-up sequence triggered for Mike R." (Zap icon, green)
     - "Missed call auto-text sent to lead" (MessageSquare icon, teal)

3. **Stats Bar**
   - 4 stats in a horizontal row:
     - "500+ Leads Captured" / "For contractors this month"
     - "< 5min Response Time" / "AI responds instantly, 24/7"
     - "3x More Bookings" / "Average increase in 90 days"
     - "98% Client Satisfaction" / "Based on 200+ reviews"

4. **Features Section** (`#services`)
   - Heading: "Everything you need to dominate your market."
   - 6 feature cards in 2x3 grid:
     1. **AI-Powered Lead Response** (Bot icon, green) — "Every lead gets a personalized response in under 5 minutes — via text, email, or chat."
     2. **Smart CRM & Pipeline** (BarChart3 icon, teal) — "Track every lead from first touch to closed deal. Automated tagging, scoring, and pipeline management."
     3. **Paid Ads That Convert** (Megaphone icon, green) — "Google & Facebook ad campaigns built specifically for service businesses."
     4. **Full Automation Engine** (Workflow icon, teal) — "From lead capture to review requests — every step is automated."
     5. **Website & Funnel Integration** (Globe icon, green) — "We add lead capture forms, chat widgets, and tracking to your existing website."
     6. **Reputation Management** (ShieldCheck icon, teal) — "Automatically request reviews after every completed job."

5. **Services/Toolkit Section**
   - Heading: "Your Complete Automation Toolkit"
   - Subheading: "Three systems. One seamless machine. Zero leads lost."
   - 3 tabs: "CRM & Pipeline", "Lead Capture", "Automation Workflows"
   - Each tab shows a dashboard mockup image (use placeholder images or generate them)
   - Below each tab: 3-4 feature bullet points with green checkmarks

6. **How It Works Section** (`#how-it-works`)
   - Heading: "Three steps to your automation engine."
   - 4 steps in a vertical timeline:
     1. **Discovery & Strategy** (icon: atom/orbit) — "We audit your current process, identify gaps, and design a custom automation strategy."
     2. **Build & Integrate** (icon: code) — "We build your CRM, connect your tools, and set up every automation workflow."
     3. **Launch & Optimize** (icon: rocket) — "We launch your system, train your team, and continuously optimize for better results."
     4. **Scale & Grow** (icon: trending-up) — "As your business grows, we scale your automation to handle more leads and more revenue."

7. **Testimonials Section** (`#results`)
   - Heading: "Real contractors. Real results."
   - 6 testimonial cards in 2x3 grid, each with:
     - 5-star rating
     - Quote (2-3 sentences about how ModernFlow AI helped their business)
     - Name, business type, location (e.g., "Mike Rodriguez, HVAC Contractor, Phoenix AZ")
     - Professional headshot photo (use these CDN URLs):
       1. `https://d2xsxph8kpxj0f.cloudfront.net/310419663029667540/GXtnUFss9AoWw228KaXxY6/testimonial-1-rZ2HPBP6Vu2GZwXXeVQwqE.webp`
       2. `https://d2xsxph8kpxj0f.cloudfront.net/310419663029667540/GXtnUFss9AoWw228KaXxY6/testimonial-2-sZSYJCLdDCPRFNHGJdQqLs.webp`
       3. `https://d2xsxph8kpxj0f.cloudfront.net/310419663029667540/GXtnUFss9AoWw228KaXxY6/testimonial-3-7Y2Uf5VwqxHbHLKfb5XHPB.webp`
       4. `https://d2xsxph8kpxj0f.cloudfront.net/310419663029667540/GXtnUFss9AoWw228KaXxY6/testimonial-4-rYBSHQVPKqBMRqZpYDxiLs.webp`
       5. `https://d2xsxph8kpxj0f.cloudfront.net/310419663029667540/GXtnUFss9AoWw228KaXxY6/testimonial-5-qYBSHQVPKqBMRqZpYDxiLs.webp`
       6. `https://d2xsxph8kpxj0f.cloudfront.net/310419663029667540/GXtnUFss9AoWw228KaXxY6/testimonial-6-pYBSHQVPKqBMRqZpYDxiLs.webp`

8. **Pricing Section** (`#pricing`)
   - Heading: "Our Service Packages: Choose Your Growth Plan"
   - 3 pricing cards (middle one highlighted with "Most Popular" badge):
     - **Starter** (Small Businesses): $1,000 Setup + $97/mo — 3-Page Website, SEO Optimization, Lead Capture, Mobile-Friendly
     - **Growth** (Scaling Businesses): $2,000 Setup + $297/mo — 5-Page Website, Booking System, Payments, Auto Reviews [MOST POPULAR]
     - **Elite** (Enterprises): $3,000 Setup + $697/mo — 10+ Page Website, AI Voice Agent, AI Chatbot, Ongoing SEO
   - Each card has a "Get Started" button (opens Calendly popup)
   - Below cards: "Never Miss Another Customer — Capture Leads Around the Clock"

9. **FAQ Section** (`#faq`)
   - Heading: "Got questions? We've got answers."
   - 8 FAQ items in an accordion:
     1. "I'm not tech-savvy. Will I be able to use this?" → "Absolutely. We handle 100% of the setup..."
     2. "How is this different from just buying software myself?" → "Most software gives you a blank canvas..."
     3. "What if it doesn't work for my business?" → "We offer a 30-day money-back guarantee..."
     4. "Do I own my accounts and data?" → "Yes, 100%. Your CRM, your ad accounts..."
     5. "How long before I start seeing results?" → "Most contractors see their first automated leads within the first week..."
     6. "What's the minimum commitment?" → "For automation services, there's no long-term contract..."
     7. "I already have a website. Do I need to change it?" → "No. We integrate with your existing website..."
     8. "What types of contractors do you work with?" → "We specialize in home service contractors..."

10. **About Section**
    - Heading: "Built different. Built to perform."
    - Subheading: "We understand your business because we solve these challenges daily."
    - 3 badges in a row:
      - "Built for Service Businesses" (Eye icon, green)
      - "All-in-One, Done-for-You" (Sparkles icon, teal)
      - "Proven Results, No Guesswork" (Target icon, green)
    - Right side: Image of a contractor working (use placeholder or this URL: `https://d2xsxph8kpxj0f.cloudfront.net/310419663029667540/GXtnUFss9AoWw228KaXxY6/contractor-working-7Y2Uf5VwqxHbHLKfb5XHPB.webp`)

11. **Contact Section** (`#contact`)
    - Heading: "Let's Build Your Automation Engine"
    - Left: Contact form with fields: Name, Email, Phone, Business Type (dropdown: HVAC, Plumbing, Electrical, Roofing, Landscaping, General Contractor, Other), Message
    - Right: "Prefer to talk now?" card with Calendly CTA button
    - Below form: Contact info (Email: hello@modernflowai.com, Phone: (555) 123-4567)

12. **CTA Section**
    - Heading: "Ready to stop losing leads?"
    - Subheading: "Book a free 30-minute strategy call. We'll audit your current process and show you exactly how automation can transform your business."
    - CTA button: "Book Your Free Strategy Call" (opens Calendly popup)

13. **Footer**
    - Logo + brand name
    - 4 columns:
      - **Company:** About, How It Works, Pricing, Contact
      - **Services:** Lead Automation, CRM Setup, Paid Ads, Website Integration
      - **Resources:** Blog, Case Studies, FAQ, Support
      - **Legal:** Privacy Policy, Terms of Service
    - Social media icons: Facebook, Instagram, LinkedIn, X (Twitter) — all with hover effects (turn green on hover)
    - Bottom: "© 2026 ModernFlow AI. All rights reserved." + "Never Miss Another Customer — Capture Leads Around the Clock"

**Calendly Integration:**
- Use this Calendly URL: `https://calendly.com/ryan-modernflowai/30min`
- Implement as a popup widget (not inline embed)
- Add Calendly CSS/JS to the HTML head:
  ```html
  <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
  <script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
  ```
- Trigger with: `Calendly.initPopupWidget({url: 'https://calendly.com/ryan-modernflowai/30min'})`

**Animations:**
- Use Framer Motion for scroll-triggered fade-in animations on all sections
- Smooth scroll behavior for anchor links
- Hover effects on all buttons and cards

**Responsive Design:**
- Mobile-first approach
- Hamburger menu on mobile
- Stack sections vertically on small screens
- Adjust font sizes and spacing for mobile

Build this exactly as described. Do not deviate from the design system, color palette, or content.
```

---

## What's Included in the Source Code

The source code archive contains:

- **Full React + TypeScript project** with all components
- **Tailwind CSS 4 configuration** with custom OKLCH colors
- **Framer Motion animations** on all sections
- **Calendly integration** (popup widget)
- **All 11 sections** (Hero, Stats, Features, Services, How It Works, Testimonials, Pricing, FAQ, About, Contact, CTA, Footer)
- **Responsive design** (mobile hamburger menu, stacked layouts)
- **All assets** (logo, testimonial photos, background images) via CDN URLs
- **Contact form** (frontend only — you'll need to wire it to a backend or form service)

---

## Platform-Specific Notes

### Lovable
- **Best fit:** Lovable is ideal for this project — it's a React + Tailwind builder with AI assistance
- **Import:** Create a new project → Import from ZIP → upload the extracted folder
- **Calendly:** Works out of the box (Lovable supports external scripts)
- **Contact form:** You'll need to add a backend endpoint or use a form service like Formspree, Basin, or GoHighLevel webhook

### Bolt.new (StackBlitz)
- **Best fit:** Great for quick prototyping and sharing
- **Import:** Drag and drop the entire folder into the file tree
- **Calendly:** Works (StackBlitz supports external scripts)
- **Contact form:** Same as Lovable — add a backend or form service
- **Note:** Bolt.new is best for demos/prototypes, not production hosting

### v0.dev (Vercel)
- **Not recommended:** v0 is component-focused, not full-app. You'd need to manually assemble all components into a full Next.js app.
- **Alternative:** Use the prompt above with v0 to generate individual components, then assemble them yourself in a Next.js project.

### Replit
- **Best fit:** Good for collaborative coding and instant hosting
- **Import:** Create new Repl → Import from GitHub → upload as ZIP
- **Calendly:** Works (Replit supports external scripts)
- **Contact form:** You can add a backend endpoint directly in Replit (Node.js/Express)
- **Hosting:** Replit provides free hosting with a custom subdomain

### Claude Projects (Anthropic)
- **Best fit:** Use Claude to help you set up, debug, or extend the project
- **Import:** Attach the entire source code folder as context
- **Prompt:** "Help me set up and run this React project. Explain the structure and how to add new features."
- **Note:** Claude can't run the project for you — you'll need to run it locally or deploy to a hosting platform

---

## Deploying to Free Hosting

Once you have the project running locally, deploy it to a free hosting platform:

### Netlify (Recommended)
1. Sign up at [netlify.com](https://netlify.com)
2. Drag and drop the `dist` folder (after running `npm run build`) into Netlify
3. Done — you get a free subdomain like `modernflowai.netlify.app`

### Vercel
1. Sign up at [vercel.com](https://vercel.com)
2. Connect your GitHub repo or upload the project folder
3. Vercel auto-detects Vite and deploys
4. Free subdomain like `modernflowai.vercel.app`

### Cloudflare Pages
1. Sign up at [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect GitHub or upload the `dist` folder
3. Free hosting + CDN

### GitHub Pages
1. Push the project to a GitHub repo
2. Run `npm run build` to generate the `dist` folder
3. Push `dist` to a `gh-pages` branch
4. Enable GitHub Pages in repo settings
5. Free subdomain like `yourusername.github.io/modernflowai`

---

## Contact Form Backend Options

The contact form is currently frontend-only. To make it functional, choose one of these options:

### Option 1: GoHighLevel Webhook (Recommended if you use GHL)
- Create an Inbound Webhook in GHL (Automations → Workflows → Webhook trigger)
- Copy the webhook URL
- Update the form's `onSubmit` handler to POST to the webhook URL
- Full instructions in the `ghl-integration-guide.md` file

### Option 2: Formspree (Easiest)
- Sign up at [formspree.io](https://formspree.io) (free tier: 50 submissions/month)
- Get your form endpoint URL
- Update the form's `action` attribute to the Formspree URL

### Option 3: Basin
- Sign up at [usebasin.com](https://usebasin.com) (free tier: 100 submissions/month)
- Get your form endpoint URL
- Update the form to POST to Basin

### Option 4: Custom Backend (Node.js/Express)
- Add a backend route in `server/routers.ts` (if using the full Manus template)
- Or create a separate Express server that sends form data to your email via SendGrid/Mailgun

---

## Customization Tips

### Changing Colors
- All colors are defined in `client/src/index.css` using OKLCH format
- Primary green: `oklch(0.696 0.17 162.48)` → change to your brand color
- Background: `oklch(0.145 0.014 155.83)` → adjust lightness for lighter/darker theme

### Changing Fonts
- Fonts are loaded from Google Fonts in `client/index.html`
- Current fonts: Outfit (headings), DM Sans (body), JetBrains Mono (labels)
- Replace with your brand fonts by updating the Google Fonts URL and CSS variables

### Changing Content
- All text content is in the component files under `client/src/components/`
- Edit the arrays/objects at the top of each component file (e.g., `features`, `plans`, `faqItems`)

### Adding Sections
- Create a new component in `client/src/components/`
- Import and add it to `client/src/pages/Home.tsx`
- Follow the same design system (glass-card, section-label, gradient-text classes)

---

## Support

If you run into issues:
1. Check the README.md in the source code for setup instructions
2. Consult the platform-specific docs (Lovable, Bolt, Replit, etc.)
3. Use the prompt above to ask an AI agent (Claude, ChatGPT) to help debug

---

## License

This source code is provided for your personal or commercial use. You own the code and can modify it freely.
