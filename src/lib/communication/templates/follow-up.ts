// ═══════════════════════════════════════════════════════════════
//  Email Template — Lead Acknowledgement / Follow-Up
//  Sent as a follow-up reminder to leads who haven't converted.
// ═══════════════════════════════════════════════════════════════

import type { FollowUpEvent } from "../types";
import { escapeHtml } from "../utils/html";

export function buildFollowUpEmail(event: FollowUpEvent) {
  const rawFirstName = event.fullName.split(" ")[0] || event.fullName;
  const firstName = escapeHtml(rawFirstName);

  // Subject is plain text — use raw name, not HTML-escaped
  const subject = `${rawFirstName}, your insurance quotes are still waiting — PolicyScanner`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
        <!-- Header -->
        <tr>
          <td style="background:#1a1a2e;padding:28px 32px">
            <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.5px">
              Policy<span style="color:#4f8cff">Scanner</span>.ca
            </span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px">
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1a1a2e;letter-spacing:-0.5px">
              Hi ${firstName}, still looking for coverage?
            </h1>
            <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.6">
              You requested insurance quotes ${event.daysSinceQuote} day${event.daysSinceQuote === 1 ? "" : "s"} ago. Your personalized rates are still available.
            </p>

            <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.6">
              Insurance rates change frequently — locking in today's rate means you're protected at the lowest available price for your age and health profile.
            </p>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0" style="margin:24px 0">
              <tr>
                <td style="background:#4f8cff;border-radius:6px">
                  <a href="https://policyscanner.ca/quote" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none">
                    View My Quotes
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 20px;font-size:14px;color:#555;line-height:1.5">
              Or simply reply to this email and a licensed advisor will reach out at a time that works for you.
            </p>

            <p style="margin:0;font-size:13px;color:#888;line-height:1.5">
              Questions? Call us at <strong style="color:#555">1-800-555-0199</strong>.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #e8eaed;font-size:12px;color:#999;line-height:1.5">
            PolicyScanner.ca &middot; Helping Canadians find the right coverage.<br>
            <a href="https://policyscanner.ca/unsubscribe" style="color:#999">Unsubscribe</a> from future emails.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();

  return { subject, html };
}
