// ═══════════════════════════════════════════════════════════════
//  Communication Module — Types & Provider Interfaces
// ═══════════════════════════════════════════════════════════════

// ── Message payloads ─────────────────────────────────────────

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  /** Plain-text fallback (auto-stripped from HTML if omitted) */
  text?: string;
  replyTo?: string;
}

export interface SmsMessage {
  to: string;       // E.164 format: +14165550001
  body: string;
}

export interface AdminNotification {
  type: "new_lead" | "quote_completed" | "follow_up_due";
  title: string;
  body: string;
  leadId?: string;
  sessionId?: string;
}

// ── Provider contracts ───────────────────────────────────────
// Each provider implements a single method. Swap implementations
// without touching the orchestrator.

export interface EmailProvider {
  send(message: EmailMessage): Promise<EmailResult>;
}

export interface SmsProvider {
  send(message: SmsMessage): Promise<SmsResult>;
}

export interface NotificationProvider {
  send(notification: AdminNotification): Promise<NotificationResult>;
}

// ── Result types ─────────────────────────────────────────────

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface SmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface NotificationResult {
  success: boolean;
  error?: string;
}

// ── High-level event payloads (what callers pass to the service) ──

export interface LeadCapturedEvent {
  leadId: string;
  sessionId?: string;
  fullName: string;
  email: string;
  phone: string;
  province: string;
  policyType: string;
  coverage: number;
  term: number;
  userRiskClass: string;
}

export interface QuoteSelectedEvent {
  leadId?: string;
  sessionId?: string;
  fullName: string;
  email: string;
  phone: string;
  planBrand: string;
  planProduct: string;
  priceMonthly: number;
  priceAnnual: number;
  coverage: number;
  term: number;
  policyType: string;
}

export interface FollowUpEvent {
  leadId: string;
  fullName: string;
  email: string;
  phone?: string;
  daysSinceQuote: number;
}


