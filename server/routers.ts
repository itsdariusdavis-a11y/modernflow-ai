import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { z } from "zod";

// GoHighLevel Inbound Webhook URL
// Replace this with your actual GHL Inbound Webhook URL from your GHL Workflow
const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL || "";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required"),
          email: z.string().email("Valid email is required"),
          phone: z.string().optional(),
          businessType: z.string().optional(),
          message: z.string().min(1, "Message is required"),
        })
      )
      .mutation(async ({ input }) => {
        // 1. Forward to GoHighLevel Inbound Webhook (if configured)
        if (GHL_WEBHOOK_URL) {
          try {
            const ghlPayload = {
              firstName: input.name.split(" ")[0] ?? input.name,
              lastName: input.name.split(" ").slice(1).join(" ") || "",
              email: input.email,
              phone: input.phone ?? "",
              source: "ModernFlow AI Website",
              tags: ["website-contact-form"],
              customFields: {
                businessType: input.businessType ?? "",
                message: input.message,
              },
            };

            const ghlRes = await fetch(GHL_WEBHOOK_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(ghlPayload),
            });

            if (!ghlRes.ok) {
              console.error("[GHL Webhook] Failed:", ghlRes.status, await ghlRes.text());
            } else {
              console.log("[GHL Webhook] Contact submitted successfully");
            }
          } catch (err) {
            console.error("[GHL Webhook] Error:", err);
            // Don't throw — still notify owner and return success to user
          }
        } else {
          console.warn("[GHL Webhook] GHL_WEBHOOK_URL not configured — skipping GHL submission");
        }

        // 2. Notify the site owner via Manus notification
        try {
          await notifyOwner({
            title: `New Contact Form Submission — ${input.name}`,
            content: `**Name:** ${input.name}\n**Email:** ${input.email}\n**Phone:** ${input.phone || "Not provided"}\n**Business Type:** ${input.businessType || "Not specified"}\n\n**Message:**\n${input.message}`,
          });
        } catch (err) {
          console.error("[Notify Owner] Error:", err);
        }

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
