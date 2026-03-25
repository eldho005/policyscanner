// ═══════════════════════════════════════════════════════════════
//  Email Template — Follow-Up Re-engagement (T3)
//  Sent ~7 days after quote if no plan has been selected.
// ═══════════════════════════════════════════════════════════════

import type { FollowUpEvent } from "../types";
import { escapeHtml } from "../utils/html";
import { env } from "@/lib/config/env";

const ADVISOR_IMAGE = "https://res.cloudinary.com/dy4lolmvf/image/upload/v1774455799/eldho_photo_headshot_1_susqew.jpg";

export function buildFollowUpEmail(event: FollowUpEvent) {
  const rawFirstName = event.fullName.split(" ")[0] || event.fullName;
  const firstName = escapeHtml(rawFirstName);
  const unsubscribeUrl = `${env.appUrl}/api/unsubscribe?token=${event.leadId}`;
  const quoteUrl = `${env.appUrl}/quote`;

  // Subject is plain text — use raw name, not HTML-escaped
  const subject = `${rawFirstName}, your insurance quotes are still waiting — PolicyScanner`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f4f2;font-family:'Outfit',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f4f2;padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
        <!-- Header -->
        <tr>
          <td style="background:#2b2520;padding:28px 32px">
            <span style="font-size:20px;font-weight:500;color:#ffffff;letter-spacing:-0.01em">
              Policy<span style="font-weight:700;color:#a0522d">Scanner</span>
            </span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px">
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#2b2520;letter-spacing:-0.5px">
              Hi ${firstName}, still looking for coverage?
            </h1>
            <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.6">
              You requested insurance quotes ${event.daysSinceQuote} day${event.daysSinceQuote === 1 ? "" : "s"} ago. Your personalized rates are still available.
            </p>

            <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6">
              Insurance rates change frequently — locking in today's rate means you're protected at the lowest available price for your age and health profile.
            </p>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0" style="margin:0 0 28px">
              <tr>
                <td style="background:#a0522d;border-radius:6px">
                  <a href="${quoteUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none">
                    View My Quotes &rarr;
                  </a>
                </td>
              </tr>
            </table>

            <!-- Advisor Card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f7;border:1px solid #ebe8e4;border-radius:8px;margin-bottom:24px">
              <tr>
                <td style="padding:20px">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:top;padding-right:16px">
                        <img src="${ADVISOR_IMAGE}" alt="Eldho George" width="56" height="56" style="border-radius:50%;display:block;object-fit:cover" />
                      </td>
                      <td style="vertical-align:top">
                        <p style="margin:0;font-size:15px;font-weight:600;color:#2b2520">Eldho George</p>
                        <p style="margin:2px 0 0;font-size:12px;color:#888">LLQP, RIBO &middot; Licensed Life Advisor</p>
                        <p style="margin:8px 0 0;font-size:13px;color:#555;line-height:1.5">
                          I'm still here to help, ${firstName}. Reply to this email and I'll personally walk you through your options — no pressure, no commitment.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #ebe8e4;font-size:12px;color:#999;line-height:1.5">
            PolicyScanner.ca &middot; Helping Canadians find the right coverage.<br>
            <a href="${unsubscribeUrl}" style="color:#999">Unsubscribe</a> from future emails.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();

  return { subject, html };
}
