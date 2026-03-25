// ═══════════════════════════════════════════════════════════════
//  Email Template — Advisor Introduction (T1)
//  Sent when a customer submits their info on the quote step page.
//  Introduces Eldho George as their dedicated advisor with his
//  direct line and explains next steps.
// ═══════════════════════════════════════════════════════════════

import type { LeadCapturedEvent } from "../types";
import { escapeHtml } from "../utils/html";
import { env } from "@/lib/config/env";

const POLICY_LABELS: Record<string, string> = {
  term: "Term Life Insurance",
  whole: "Whole Life Insurance",
  mortgage: "Mortgage Insurance",
  critical: "Critical Illness",
};

function formatCoverage(n: number): string {
  return n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
    : `$${(n / 1_000).toFixed(0)},000`;
}

const ADVISOR_IMAGE = "https://res.cloudinary.com/dy4lolmvf/image/upload/v1774455799/eldho_photo_headshot_1_susqew.jpg";
const ADVISOR_PHONE = "+1 (437) 422-2835";
const ADVISOR_EMAIL = "eldho@policyscanner.ca";

export function buildQuoteConfirmationEmail(event: LeadCapturedEvent & { leadId?: string }) {
  const firstName = escapeHtml(event.fullName.split(" ")[0] || event.fullName);
  const policyLabel = POLICY_LABELS[event.policyType] ?? event.policyType;
  const coverageLabel = formatCoverage(event.coverage);
  const safeProvince = escapeHtml(event.province);
  const unsubscribeUrl = event.leadId
    ? `${env.appUrl}/api/unsubscribe?token=${event.leadId}`
    : `${env.appUrl}/api/unsubscribe`;

  const subject = `${firstName}, meet your dedicated insurance advisor — PolicyScanner`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    @media only screen and (max-width:480px) {
      .outer-pad { padding: 12px 6px !important; }
      .card { border-radius: 6px !important; }
      .header-cell { padding: 20px 20px !important; }
      .body-cell { padding: 24px 20px !important; }
      .footer-cell { padding: 16px 20px !important; }
      .advisor-pad { padding: 16px !important; }
      .next-pad { padding: 16px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f5f4f2;font-family:'Outfit',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-text-size-adjust:100%">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f5f4f2">
    <tr><td class="outer-pad" align="center" style="padding:28px 12px">
      <!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
      <table cellpadding="0" cellspacing="0" role="presentation" class="card" style="width:100%;max-width:560px;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
        <!-- Header -->
        <tr>
          <td class="header-cell" style="background:#2b2520;padding:22px 28px">
            <span style="font-size:20px;font-weight:500;color:#ffffff;letter-spacing:-0.01em">
              Policy<span style="font-weight:700;color:#a0522d">Scanner</span>
            </span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td class="body-cell" style="padding:28px 28px 24px">
            <h1 style="margin:0 0 8px;font-size:21px;font-weight:700;color:#2b2520;letter-spacing:-0.4px;line-height:1.3">
              Hi ${firstName}, welcome to PolicyScanner!
            </h1>
            <p style="margin:0 0 22px;font-size:15px;color:#555;line-height:1.65">
              Thanks for submitting your information. We've assigned a dedicated licensed advisor to your file who will personally review the best insurance options for you.
            </p>

            <!-- Advisor Card -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#faf9f7;border:1px solid #ebe8e4;border-radius:8px;margin-bottom:22px">
              <tr>
                <td class="advisor-pad" style="padding:24px 20px">
                  <!-- Centered photo + name -->
                  <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="text-align:center">
                    <tr>
                      <td align="center" style="padding-bottom:14px">
                        <img src="${ADVISOR_IMAGE}" alt="Eldho George" width="72" height="72" style="border-radius:50%;display:inline-block;object-fit:cover;object-position:center top" />
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <p style="margin:0;font-size:18px;font-weight:700;color:#2b2520;line-height:1.2">Eldho George</p>
                        <p style="margin:4px 0 0;font-size:12px;color:#888;line-height:1.4">LLQP, RIBO &middot; Licensed Life Insurance Advisor</p>
                        <p style="margin:8px 0 0;font-size:13px;color:#a0522d;font-weight:600">Your Dedicated Advisor</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Contact Details — stacked labels -->
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:16px;border-top:1px solid #ebe8e4;padding-top:16px">
                    <tr>
                      <td align="center" style="padding-bottom:12px">
                        <p style="margin:0;font-size:11px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.6px">Direct Line</p>
                        <p style="margin:4px 0 0"><a href="tel:+14374222835" style="font-size:17px;font-weight:700;color:#a0522d;text-decoration:none;white-space:nowrap">${ADVISOR_PHONE}</a></p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <p style="margin:0;font-size:11px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.6px">Email</p>
                        <p style="margin:4px 0 0"><a href="mailto:${ADVISOR_EMAIL}" style="font-size:15px;font-weight:600;color:#a0522d;text-decoration:none">${ADVISOR_EMAIL}</a></p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.65">
              Eldho is reviewing the best ${policyLabel.toLowerCase()} options for your <strong style="color:#2b2520">${coverageLabel}</strong> coverage need in <strong style="color:#2b2520">${safeProvince}</strong>${event.term > 0 ? ` over a <strong style="color:#2b2520">${event.term}-year</strong> term` : ""}. He'll find you the most competitive rates from Canada's top carriers.
            </p>

            <!-- What's Next -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#faf9f7;border:1px solid #ebe8e4;border-radius:8px;margin-bottom:22px">
              <tr>
                <td class="next-pad" style="padding:18px 20px">
                  <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.8px">What Happens Next</p>
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td style="padding:5px 0;font-size:14px;color:#555;line-height:1.5">
                        <strong style="color:#a0522d">1.</strong> Eldho reviews the market for plans that fit your profile
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:5px 0;font-size:14px;color:#555;line-height:1.5">
                        <strong style="color:#a0522d">2.</strong> You'll receive your personalized quotes to compare
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:5px 0;font-size:14px;color:#555;line-height:1.5">
                        <strong style="color:#a0522d">3.</strong> Eldho will walk you through your options — no pressure, no obligation
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:15px;color:#555;line-height:1.65">
              Feel free to call Eldho directly at <a href="tel:+14374222835" style="color:#a0522d;font-weight:600;text-decoration:none">${ADVISOR_PHONE}</a> if you have any immediate questions. He's happy to help.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td class="footer-cell" style="padding:18px 28px;border-top:1px solid #ebe8e4;font-size:12px;color:#999;line-height:1.5">
            PolicyScanner.ca &middot; Helping Canadians find the right coverage.<br>
            You're receiving this because you submitted an insurance inquiry.
            &nbsp;<a href="${unsubscribeUrl}" style="color:#999">Unsubscribe</a>.
          </td>
        </tr>
      </table>
      <!--[if mso]></td></tr></table><![endif]-->
    </td></tr>
  </table>
</body>
</html>`.trim();

  return { subject, html };
}
