# ModernFlow AI Website

> AI-powered automation platform for service businesses and contractors.

**Live Site:** Hosted on Manus  
**Stack:** React 19 + TypeScript + Tailwind CSS 4 + Framer Motion + Express + tRPC + MySQL

---

## What This Is

A full-stack marketing website for ModernFlow AI — a done-for-you AI automation agency targeting service businesses (contractors, plumbers, HVAC, electricians, etc.). The site includes 13 sections, Calendly booking integration, GoHighLevel CRM webhook, and a contact form backend.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS 4, Framer Motion animations |
| Backend | Express 4, tRPC 11 |
| Database | MySQL / TiDB (via Drizzle ORM) |
| Auth | Manus OAuth (can be replaced with any OAuth provider) |
| Booking | Calendly popup widget |
| CRM | GoHighLevel Inbound Webhook |

---

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Emerald Green | `#10b981` | Primary brand, icons, accents |
| Teal | `#14b8a6` | Gradient midpoint |
| Cyan/Blue | `#06b6d4` | Gradient end, highlights |
| Dark Background | `#0a0f0d` | Page background |
| Card Background | `rgba(255,255,255,0.04)` | Glass cards |

**Gradient text:** `linear-gradient(135deg, #10b981, #14b8a6, #06b6d4)`

---

## Fonts

- **Outfit** — headings and display text
- **DM Sans** — body text
- **JetBrains Mono** — code labels (`// SECTION NAME`)

---

## Site Sections (in order)

1. **Navbar** — sticky, logo + nav links + "Book a Call" CTA
2. **Hero** — headline, subtext, dual CTAs, live automation feed widget
3. **Stats** — 4 key metrics (500+ clients, 98% retention, $2.4M revenue, 24/7 uptime)
4. **Features** — 6 cards: "Why ModernFlow AI"
5. **Services** — tabbed toolkit: CRM, Booking System, Review Automation
6. **How It Works** — 4-step process
7. **Results** — 6 testimonials with headshot photos
8. **Pricing** — 3 tiers: Starter ($1k+$97/mo), Growth ($2k+$297/mo), Elite ($3k+$697/mo)
9. **FAQ** — 8 accordion items
10. **About** — company mission + stats
11. **CTA** — full-width booking CTA
12. **Contact** — form with GHL webhook + Calendly card
13. **Footer** — 4-column with social icons

---

## Key Files

```
client/src/components/     ← All 13 page sections
client/src/index.css       ← Brand colors, glass-card, gradient-text
client/src/hooks/useCalendly.ts  ← Calendly popup hook
server/routers.ts          ← tRPC procedures incl. contact form → GHL
```

---

## Environment Variables

```env
# Required for contact form → GoHighLevel
GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/YOUR_WEBHOOK_ID

# Auto-injected by Manus (replace if hosting elsewhere)
DATABASE_URL=
JWT_SECRET=
```

---

## Calendly Integration

All "Book a Free Strategy Call" buttons use:
```
https://calendly.com/ryan-modernflowai/30min
```
The `useCalendly` hook opens the popup widget via `window.Calendly.initPopupWidget()`.

---

## GoHighLevel Webhook

Contact form submissions POST to `GHL_WEBHOOK_URL` with:
```json
{
  "firstName": "...",
  "lastName": "...",
  "email": "...",
  "phone": "...",
  "businessType": "...",
  "message": "..."
}
```

See `GHL-INTEGRATION-GUIDE.md` for full setup instructions.

---

## Running Locally

```bash
pnpm install
pnpm db:push      # Set up database
pnpm dev          # Start dev server at localhost:3000
```

---

## Deploying to Lovable / Bolt.new / v0

1. Import this GitHub repo directly in the AI builder
2. Set the environment variables listed above
3. The AI builder will handle the rest — the codebase is standard React + Express

See `AI-PLATFORM-MIGRATION-GUIDE.md` for detailed platform-specific instructions.

---

## Deploying to Netlify / Vercel (Free)

See `FREE-HOSTING-GUIDE.md` for step-by-step instructions.

---

## UGC Engine (Service Line)

Operating system for ModernFlow's AI-generated UGC video service — Claude as Creative Director + Higgsfield MCP for production, sold as monthly creative packs to local service businesses and Shopify DTC brands.

See [`ugc-agency/README.md`](ugc-agency/README.md) for the full 4-stage workflow, prompts, pricing, and compliance rules.

---

## Logo

The geometric "M" logo is the ModernFlow AI brand mark. Available in:
- Dark background with emerald green solid fill (current)
- Dark background with neon green glow outline

---

*Built with Manus AI — https://manus.im*
