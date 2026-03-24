// ═══════════════════════════════════════════════════════════════
//  Communication Module — Public API
//
//  import { comms } from "@/lib/communication";
//  import type { LeadCapturedEvent } from "@/lib/communication";
// ═══════════════════════════════════════════════════════════════

export { comms } from "./communication.service";
export type {
  LeadCapturedEvent,
  QuoteSelectedEvent,
  FollowUpEvent,
  EmailMessage,
  SmsMessage,
  AdminNotification,
  EmailProvider,
  SmsProvider,
  NotificationProvider,
  EmailResult,
  SmsResult,
  NotificationResult,
} from "./types";
