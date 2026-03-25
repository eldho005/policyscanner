// ═══════════════════════════════════════════════════════════════
//  Email Provider
//
//  Uses SendGrid when SENDGRID_API_KEY is present; falls back to
//  a console logger for local development / CI without credentials.
// ═══════════════════════════════════════════════════════════════

import sgMail from "@sendgrid/mail";
import type { EmailProvider, EmailMessage, EmailResult } from "../types";
import { env } from "@/lib/config/env";

// ── SendGrid provider ────────────────────────────────────────

class SendGridEmailProvider implements EmailProvider {
  constructor() {
    sgMail.setApiKey(env.sendgridApiKey);
  }

  async send(message: EmailMessage): Promise<EmailResult> {
    try {
      const [response] = await sgMail.send({
        from: { email: env.emailFrom, name: "PolicyScanner" },
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
        replyTo: message.replyTo,
      });

      const messageId = response.headers["x-message-id"] as string | undefined;
      console.log(`[Email/SendGrid] Sent to ${message.to} — ${message.subject}`);
      return { success: true, messageId };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`[Email/SendGrid] Failed to send to ${message.to}:`, errMsg);
      return { success: false, error: errMsg };
    }
  }
}

// ── Console fallback (local dev / no API key) ────────────────

class ConsoleEmailProvider implements EmailProvider {
  async send(message: EmailMessage): Promise<EmailResult> {
    const messageId = `email_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    console.log(
      `[Email/Console] ${messageId}\n` +
      `  From: ${env.emailFrom}\n` +
      `  To:   ${message.to}\n` +
      `  Subj: ${message.subject}\n` +
      `  Size: ${message.html.length} chars`,
    );
    return { success: true, messageId };
  }
}

// ── Singleton factory ────────────────────────────────────────

let _instance: EmailProvider | null = null;

export function getEmailProvider(): EmailProvider {
  if (!_instance) {
    _instance = env.sendgridApiKey
      ? new SendGridEmailProvider()
      : new ConsoleEmailProvider();
  }
  return _instance;
}
