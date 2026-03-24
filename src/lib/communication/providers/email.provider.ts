// ═══════════════════════════════════════════════════════════════
//  Email Provider — Console Logger (V1 Stub)
//
//  Logs every email to the server console. Swap this file for a
//  real provider (SendGrid, Resend, AWS SES) when ready — the
//  interface stays the same.
//
//  To integrate a real provider:
//    1. npm install @sendgrid/mail   (or resend, etc.)
//    2. Replace the send() body below
//    3. Add SENDGRID_API_KEY (or equiv.) to .env.local
// ═══════════════════════════════════════════════════════════════

import type { EmailProvider, EmailMessage, EmailResult } from "../types";

const FROM_ADDRESS = process.env.EMAIL_FROM ?? "noreply@policyscanner.ca";

export class ConsoleEmailProvider implements EmailProvider {
  async send(message: EmailMessage): Promise<EmailResult> {
    const messageId = `email_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    console.log(
      `[Email] ${messageId}\n` +
      `  From: ${FROM_ADDRESS}\n` +
      `  To:   ${message.to}\n` +
      `  Subj: ${message.subject}\n` +
      `  Size: ${message.html.length} chars`,
    );

    return { success: true, messageId };
  }
}

// ── Singleton ────────────────────────────────────────────────

let _instance: EmailProvider | null = null;

export function getEmailProvider(): EmailProvider {
  if (!_instance) {
    _instance = new ConsoleEmailProvider();
  }
  return _instance;
}
