// ═══════════════════════════════════════════════════════════════
//  SMS Provider — Console Logger (V1 Stub)
//
//  Logs every SMS to the server console. Swap this file for a
//  real provider (Twilio, Vonage, AWS SNS) when ready.
//
//  To integrate Twilio:
//    1. npm install twilio
//    2. Replace the send() body below
//    3. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM
//       to .env.local
// ═══════════════════════════════════════════════════════════════

import type { SmsProvider, SmsMessage, SmsResult } from "../types";

export class ConsoleSmsProvider implements SmsProvider {
  async send(message: SmsMessage): Promise<SmsResult> {
    const messageId = `sms_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    console.log(
      `[SMS] ${messageId}\n` +
      `  To:   ${message.to}\n` +
      `  Body: ${message.body.slice(0, 160)}`,
    );

    return { success: true, messageId };
  }
}

// ── Singleton ────────────────────────────────────────────────

let _instance: SmsProvider | null = null;

export function getSmsProvider(): SmsProvider {
  if (!_instance) {
    _instance = new ConsoleSmsProvider();
  }
  return _instance;
}
