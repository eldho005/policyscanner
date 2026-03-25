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
import { getNotificationProvider } from "./providers/notification.provider";
import { buildQuoteConfirmationEmail } from "./templates/quote-confirmation";
import { buildQuoteSelectedEmail } from "./templates/quote-selected";
import { buildFollowUpEmail } from "./templates/follow-up";

// ── Helpers ──────────────────────────────────────────────────

const POLICY_LABELS: Record<string, string> = {
  term: "Term Life",
  whole: "Whole Life",
  mortgage: "Mortgage",
  critical: "Critical Illness",
};

// ── Service class ────────────────────────────────────────────

class CommunicationService {
  // ────────────────────────────────────────────────────────────
  //  Event: Lead captured (user submitted the quote form)
  //  → Email: welcome / confirmation
  //  → Admin: new lead notification
  // ────────────────────────────────────────────────────────────
  async onLeadCaptured(event: LeadCapturedEvent & { leadId?: string }): Promise<void> {
    const results = await Promise.allSettled([
      this.sendWelcomeEmail(event),
      this.notifyAdminNewLead(event),
    ]);

    for (const r of results) {
      if (r.status === "rejected") {
        console.error("[CommunicationService] Channel failed:", r.reason);
      }
    }
  }

  // ────────────────────────────────────────────────────────────
  //  Event: User clicked "Get a Quote" on a specific plan (T2)
  //  → Email: branded plan details + advisor contact
  //  → Admin: notification with plan info
  // ────────────────────────────────────────────────────────────
  async onQuoteSelected(event: QuoteSelectedEvent): Promise<void> {
    const email = getEmailProvider();
    const notification = getNotificationProvider();

    const { subject, html } = buildQuoteSelectedEmail(event);
    const policyLabel = POLICY_LABELS[event.policyType] ?? event.policyType;

    const results = await Promise.allSettled([
      email.send({ to: event.email, subject, html }),
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

  private async sendWelcomeEmail(event: LeadCapturedEvent & { leadId?: string }) {
    const email = getEmailProvider();
    const { subject, html } = buildQuoteConfirmationEmail(event);
    return email.send({ to: event.email, subject, html });
  }

  private async notifyAdminNewLead(event: LeadCapturedEvent & { leadId?: string }) {
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
