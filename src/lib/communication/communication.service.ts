// ═══════════════════════════════════════════════════════════════
//  Communication Service — Orchestrator
//
//  Single entry point for all outbound communication. Callers
//  dispatch high-level events; this service decides which
//  channels (email, SMS, notification) to fire.
//
//  Usage:
//    import { comms } from "@/lib/communication/communication.service";
//    await comms.onLeadCaptured({ ... });
// ═══════════════════════════════════════════════════════════════

import type {
  LeadCapturedEvent,
  QuoteSelectedEvent,
  FollowUpEvent,
} from "./types";
import { getEmailProvider } from "./providers/email.provider";
import { getSmsProvider } from "./providers/sms.provider";
import { getNotificationProvider } from "./providers/notification.provider";
import { buildQuoteConfirmationEmail } from "./templates/quote-confirmation";
import { buildFollowUpEmail } from "./templates/follow-up";

// ── Helpers ──────────────────────────────────────────────────

/** Escape user-provided strings before interpolating into HTML */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Format a 10-digit phone string to E.164 (Canada: +1) */
function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

const POLICY_LABELS: Record<string, string> = {
  term: "Term Life",
  whole: "Whole Life",
  mortgage: "Mortgage",
  critical: "Critical Illness",
};

// ── Service class ────────────────────────────────────────────

class CommunicationService {
  // ────────────────────────────────────────────────────────────
  //  Event: Lead captured (user clicked "Get My Quotes")
  //  → Email: quote confirmation
  //  → SMS:   short acknowledgement
  //  → Admin: new lead notification
  // ────────────────────────────────────────────────────────────
  async onLeadCaptured(event: LeadCapturedEvent): Promise<void> {
    const results = await Promise.allSettled([
      this.sendQuoteConfirmationEmail(event),
      this.sendLeadAcknowledgementSms(event),
      this.notifyAdminNewLead(event),
    ]);

    for (const r of results) {
      if (r.status === "rejected") {
        console.error("[CommunicationService] Channel failed:", r.reason);
      }
    }
  }

  // ────────────────────────────────────────────────────────────
  //  Event: User selected a specific plan ("Get Quote" on card)
  //  → Email: plan confirmation with details
  //  → Admin: notification with plan info
  // ────────────────────────────────────────────────────────────
  async onQuoteSelected(event: QuoteSelectedEvent): Promise<void> {
    const email = getEmailProvider();
    const notification = getNotificationProvider();

    const firstName = escapeHtml(event.fullName.split(" ")[0] || event.fullName);
    const policyLabel = POLICY_LABELS[event.policyType] ?? event.policyType;
    const safeBrand = escapeHtml(event.planBrand);
    const safeProduct = escapeHtml(event.planProduct);

    const results = await Promise.allSettled([
      email.send({
        to: event.email,
        // Subject is plain text — use raw brand, not HTML-escaped
        subject: `Your ${event.planBrand} plan selection — PolicyScanner`,
        html: `
          <h2>Hi ${firstName},</h2>
          <p>You selected <strong>${safeBrand} ${safeProduct}</strong>.</p>
          <p><strong>$${event.priceMonthly.toFixed(2)}/month</strong> &middot; ${policyLabel}</p>
          <p>A licensed advisor will contact you within 1 business day to finalize your application.</p>
          <p style="color:#888;font-size:13px">— PolicyScanner.ca</p>
        `.trim(),
      }),
      notification.send({
        type: "quote_completed",
        title: `${event.fullName} selected ${event.planBrand}`,
        body: `${event.planProduct} — $${event.priceMonthly.toFixed(2)}/mo, ${policyLabel}`,
        leadId: event.leadId,
        sessionId: event.sessionId,
      }),
    ]);

    for (const r of results) {
      if (r.status === "rejected") {
        console.error("[CommunicationService] Channel failed:", r.reason);
      }
    }
  }

  // ────────────────────────────────────────────────────────────
  //  Event: Follow-up due (triggered by cron / admin action)
  //  → Email: follow-up reminder
  //  → Admin: notification
  // ────────────────────────────────────────────────────────────
  async onFollowUpDue(event: FollowUpEvent): Promise<void> {
    const email = getEmailProvider();
    const notification = getNotificationProvider();

    const { subject, html } = buildFollowUpEmail(event);

    const results = await Promise.allSettled([
      email.send({ to: event.email, subject, html }),
      notification.send({
        type: "follow_up_due",
        title: `Follow-up: ${event.fullName}`,
        body: `${event.daysSinceQuote} days since quote — follow-up email sent`,
        leadId: event.leadId,
      }),
    ]);

    for (const r of results) {
      if (r.status === "rejected") {
        console.error("[CommunicationService] Channel failed:", r.reason);
      }
    }
  }

  // ── Private channel methods ────────────────────────────────

  private async sendQuoteConfirmationEmail(event: LeadCapturedEvent) {
    const email = getEmailProvider();
    const { subject, html } = buildQuoteConfirmationEmail(event);
    return email.send({ to: event.email, subject, html });
  }

  private async sendLeadAcknowledgementSms(event: LeadCapturedEvent) {
    const sms = getSmsProvider();
    // SMS is plain text — no HTML escaping needed, but sanitize to prevent injection of control chars
    const firstName = (event.fullName.split(" ")[0] || event.fullName).replace(/[\r\n]/g, "");
    return sms.send({
      to: toE164(event.phone),
      body: `Hi ${firstName}! Your PolicyScanner quotes are ready. A licensed advisor will call within 1 business day. Reply STOP to opt out.`,
    });
  }

  private async notifyAdminNewLead(event: LeadCapturedEvent) {
    const notification = getNotificationProvider();
    const policyLabel = POLICY_LABELS[event.policyType] ?? event.policyType;
    return notification.send({
      type: "new_lead",
      title: `New lead: ${event.fullName}`,
      body: `${policyLabel} — $${(event.coverage / 1000).toFixed(0)}K — ${event.province}`,
      leadId: event.leadId,
      sessionId: event.sessionId,
    });
  }
}

// ── Singleton export ─────────────────────────────────────────

export const comms = new CommunicationService();
