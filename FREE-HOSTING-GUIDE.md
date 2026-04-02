# ModernFlow AI — Free Hosting & GHL Website Builder Guide

This guide covers two paths for hosting your ModernFlow AI website at zero ongoing cost: deploying the React source code to a free hosting platform, and rebuilding the site natively inside GoHighLevel's website builder.

---

## Path 1: Deploy to Free Hosting (Netlify, Vercel, or Cloudflare Pages)

This is the fastest path if you already have the source code working. The site builds into a static folder (`dist/`) that any free hosting platform can serve instantly.

### Step 1: Build the Project

Open a terminal in the project folder and run:

```bash
pnpm install
pnpm build
```

This creates a `dist/public/` folder containing the compiled HTML, CSS, and JavaScript. This is what you'll upload to your hosting platform.

### Step 2: Choose a Hosting Platform

All three options below are completely free for static sites and include a free subdomain (e.g., `modernflowai.netlify.app`). You can also connect a custom domain you already own.

| Platform | Free Tier | Custom Domain | Deploy Method | Best For |
|---|---|---|---|---|
| **Netlify** | Unlimited sites, 100GB bandwidth/mo | Yes (free SSL) | Drag & drop or GitHub | Easiest setup |
| **Vercel** | Unlimited sites, 100GB bandwidth/mo | Yes (free SSL) | GitHub or CLI | Best performance |
| **Cloudflare Pages** | Unlimited sites, unlimited bandwidth | Yes (free SSL) | GitHub or direct upload | Best global speed |

### Deploying to Netlify (Easiest)

1. Sign up at [netlify.com](https://netlify.com) — it's free.
2. From the Netlify dashboard, click **"Add new site"** → **"Deploy manually"**.
3. Drag and drop the entire `dist/public/` folder into the upload area.
4. Netlify assigns a random subdomain like `quirky-einstein-abc123.netlify.app`. You can rename it to `modernflowai.netlify.app` in site settings.
5. To connect a custom domain (e.g., `modernflowai.com`), go to **Domain Management** → **Add custom domain** and follow the DNS instructions.

### Deploying to Vercel

1. Sign up at [vercel.com](https://vercel.com) — it's free.
2. Install the Vercel CLI: `npm install -g vercel`
3. From the project root, run: `vercel --prod`
4. Follow the prompts. Vercel auto-detects the Vite configuration and deploys.
5. Your site is live at `modernflowai.vercel.app` within 30 seconds.

### Deploying to Cloudflare Pages

1. Sign up at [pages.cloudflare.com](https://pages.cloudflare.com) — it's free.
2. Click **"Create a project"** → **"Direct Upload"**.
3. Upload the `dist/public/` folder.
4. Your site is live at `modernflowai.pages.dev`.

---

## Path 2: Rebuild in GoHighLevel Website Builder

If you're already paying for GoHighLevel, you can rebuild the site natively inside GHL's website builder. This gives you the tightest possible integration with your CRM, forms, automations, and chat widget — all in one platform, with no separate hosting needed.

### Why This Makes Sense

GoHighLevel's website builder is drag-and-drop and includes native form capture, funnel pages, appointment booking, and chat widget integration. Since you're already paying for GHL, this approach costs you nothing extra and eliminates the need for a separate hosting platform or contact form backend.

### What You'll Lose vs. the React Version

The GHL builder does not support custom React code or Framer Motion animations. The following features will need to be simplified:

| Feature | React Version | GHL Version |
|---|---|---|
| Live Automation Feed | Animated rotating feed widget | Static graphic or video |
| Scroll animations | Framer Motion fade-ins | GHL's built-in entrance animations |
| Glass-card styling | Full CSS control | GHL's section/card blocks |
| Contact form backend | tRPC → GHL webhook | Native GHL form (direct CRM capture) |
| Calendly popup | JavaScript popup widget | Inline embed or GHL calendar |

### Step-by-Step: Building in GHL

**1. Access the Website Builder**
Log in to GoHighLevel → navigate to **Sites** → **Websites** → **+ New Website**.

**2. Set Up the Design System**
Before building any sections, configure your brand colors and fonts:
- Go to **Theme Settings** in the builder
- Set primary color to `#00C896` (emerald green)
- Set secondary color to `#00B4D8` (teal)
- Set background to `#0D1A14` (dark green-gray)
- Set heading font to **Outfit** (available via Google Fonts integration)
- Set body font to **DM Sans**

**3. Build Each Section**

Use GHL's section blocks to recreate each part of the site. The table below maps each section to the GHL block type to use:

| Section | GHL Block Type | Notes |
|---|---|---|
| Navbar | Navigation block | Add logo image URL, nav links, CTA button |
| Hero | Hero block | Two-column layout: text left, image/video right |
| Stats | Statistics/Counter block | 4 stats with icons |
| Features | Feature Cards block | 2x3 grid with icons and text |
| Services | Tabs block | 3 tabs with text and images |
| How It Works | Steps/Timeline block | 4 numbered steps |
| Testimonials | Testimonials block | 6 cards with photos and quotes |
| Pricing | Pricing Table block | 3 columns, highlight middle |
| FAQ | Accordion block | 8 items |
| About | Two-column block | Text left, image right |
| Contact | Form block | Native GHL form — captures directly to CRM |
| CTA | CTA block | Full-width with button |
| Footer | Footer block | 4 columns + social icons |

**4. Add the Calendly Widget**
GHL doesn't natively support Calendly popups, but you can add it via custom code:
- In the builder, click **Settings** → **Custom Code** → **Header Scripts**
- Paste:
  ```html
  <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
  <script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
  ```
- For each CTA button, click the button → **Link** → **Custom JavaScript** → paste:
  ```javascript
  Calendly.initPopupWidget({url: 'https://calendly.com/ryan-modernflowai/30min'}); return false;
  ```

**5. Set Up the Contact Form**
The biggest advantage of building in GHL is that the contact form captures directly into your CRM with no webhook setup needed:
- Add a **Form block** to the Contact section
- Add fields: First Name, Last Name, Email, Phone, Business Type (dropdown), Message
- Under **Form Settings**, set the **Redirect** to a thank-you page or show a success message
- Under **Notifications**, add your email address to receive a notification for each submission
- The contact is automatically created in your GHL CRM under **Contacts**

**6. Add the GHL Chat Widget**
- Go to **Sites** → **Chat Widget** → **+ New Widget**
- Configure the widget (name, color, greeting message)
- Copy the embed code
- In the website builder → **Settings** → **Custom Code** → **Footer Scripts** → paste the embed code

**7. Publish the Site**
- Click **Publish** in the top-right corner
- GHL assigns a free subdomain like `modernflowai.gohighlevel.com`
- To connect a custom domain: **Sites** → **Domains** → **+ Add Domain** → follow the DNS instructions

---

## Connecting a Custom Domain

If you own a domain (e.g., `modernflowai.com`) and want to use it with either hosting path, the process is the same:

1. Log in to your domain registrar (GoDaddy, Namecheap, Google Domains, etc.)
2. Find the **DNS settings** for your domain
3. Add a **CNAME record** pointing to your hosting platform:
   - Netlify: `[your-site].netlify.app`
   - Vercel: `cname.vercel-dns.com`
   - Cloudflare Pages: `[your-site].pages.dev`
   - GHL: provided in GHL's domain settings
4. Wait 15–60 minutes for DNS to propagate
5. SSL/HTTPS is automatically provisioned by all platforms (free)

---

## Recommended Path Summary

| Your Situation | Recommended Path |
|---|---|
| You want the exact React site with all animations | Deploy to Netlify or Vercel (free) |
| You're already paying for GoHighLevel | Rebuild in GHL website builder |
| You want the easiest setup with no coding | GHL website builder |
| You want the best performance and design | Deploy React to Cloudflare Pages |
| You want to keep everything in one platform | GHL website builder |

The React version on Netlify/Vercel gives you the most polished result with all animations intact. The GHL version gives you the tightest CRM integration with the least technical overhead. Both are free to host.
