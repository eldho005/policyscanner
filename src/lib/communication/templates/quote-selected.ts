// ═══════════════════════════════════════════════════════════════
//  Email Template — Quote Selected (T2)
//  Sent when a customer clicks "Get a Quote" on a specific plan.
//  Shows the plan details they selected + advisor contact.
// ═══════════════════════════════════════════════════════════════

import type { QuoteSelectedEvent } from "../types";
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
const ADVISOR_PHONE = "(437) 422-8353";
const ADVISOR_EMAIL = "eldho@policyscanner.ca";

export function buildQuoteSelectedEmail(event: QuoteSelectedEvent) {
  const firstName = escapeHtml(event.fullName.split(" ")[0] || event.fullName);
  const policyLabel = POLICY_LABELS[event.policyType] ?? event.policyType;
  const coverageLabel = formatCoverage(event.coverage);
  const safeBrand = escapeHtml(event.planBrand);
  const safeProduct = escapeHtml(event.planProduct);
  const monthlyPrice = event.priceMonthly.toFixed(2);
  const annualPrice = event.priceAnnual.toFixed(2);
  const unsubscribeUrl = event.leadId
    ? `${env.appUrl}/api/unsubscribe?token=${event.leadId}`
    : `${env.appUrl}/api/unsubscribe`;

  const subject = `Your ${event.planBrand} quote details — PolicyScanner`;

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
      .plan-pad { padding: 16px !important; }
      .next-pad { padding: 16px !important; }
      .advisor-pad { padding: 16px !important; }
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
              Great choice, ${firstName}!
            </h1>
            <p style="margin:0 0 22px;font-size:15px;color:#555;line-height:1.65">
              Here are the details of the plan you selected. Your advisor Eldho George will be in touch shortly to walk you through the next steps.
            </p>

            <!-- Selected Plan Card -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#faf9f7;border:1px solid #ebe8e4;border-radius:8px;margin-bottom:22px">
              <tr>
                <td class="plan-pad" style="padding:20px">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.8px">Your Selected Plan</p>
                  <p style="margin:0 0 4px;font-size:19px;font-weight:700;color:#2b2520">${safeBrand}</p>
                  <p style="margin:0 0 14px;font-size:14px;color:#888">${safeProduct}</p>

                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td style="font-size:14px;color:#555;padding:6px 0;border-top:1px solid #ebe8e4">Monthly Premium</td>
                      <td align="right" style="font-size:16px;font-weight:700;color:#a0522d;padding:6px 0;border-top:1px solid #ebe8e4">$${monthlyPrice}/mo</td>
                    </tr>
                    <tr>
                      <td style="font-size:14px;color:#555;padding:6px 0">Annual Premium</td>
                      <td align="right" style="font-size:14px;font-weight:600;color:#2b2520;padding:6px 0">$${annualPrice}/yr</td>
                    </tr>
                    <tr>
                      <td style="font-size:14px;color:#555;padding:6px 0">Policy Type</td>
                      <td align="right" style="font-size:14px;font-weight:600;color:#2b2520;padding:6px 0">${policyLabel}</td>
                    </tr>
                    <tr>
                      <td style="font-size:14px;color:#555;padding:6px 0">Coverage</td>
                      <td align="right" style="font-size:14px;font-weight:600;color:#2b2520;padding:6px 0">${coverageLabel}</td>
                    </tr>
                    ${event.term > 0 ? `
                    <tr>
                      <td style="font-size:14px;color:#555;padding:6px 0">Term</td>
                      <td align="right" style="font-size:14px;font-weight:600;color:#2b2520;padding:6px 0">${event.term} years</td>
                    </tr>` : ""}
                  </table>
                </td>
              </tr>
            </table>

            <!-- What's Next -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#faf9f7;border:1px solid #ebe8e4;border-radius:8px;margin-bottom:22px">
              <tr>
                <td class="next-pad" style="padding:18px 20px">
                  <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.8px">What Happens Next</p>
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td style="padding:5px 0;font-size:14px;color:#555;line-height:1.5">
                        1. Eldho will review your selection and confirm the details
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:5px 0;font-size:14px;color:#555;line-height:1.5">
                        2. He'll reach out to guide you through the application process
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:5px 0;font-size:14px;color:#555;line-height:1.5">
                        3. You can always change your mind — no obligation until you sign
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Advisor Card -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#faf9f7;border:1px solid #ebe8e4;border-radius:8px;margin-bottom:22px">
              <tr>
                <td class="advisor-pad" style="padding:24px 20px">
                  <!-- Centered photo + name -->
                  <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="text-align:center">
                    <tr>
                      <td align="center" style="padding-bottom:12px">
                        <img src="${ADVISOR_IMAGE}" alt="Eldho George" width="64" height="64" style="border-radius:50%;display:inline-block;object-fit:cover;object-position:center top" />
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <p style="margin:0;font-size:17px;font-weight:700;color:#2b2520;line-height:1.2">Eldho George</p>
                        <p style="margin:3px 0 0;font-size:12px;color:#888;line-height:1.4">LLQP, RIBO &middot; Licensed Life Insurance Advisor</p>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:14px 0 0;font-size:13px;color:#555;line-height:1.55;text-align:center">
                    Great selection! I'll be reviewing your file and reaching out shortly. Feel free to call or email me directly.
                  </p>
                  <!-- Contact Details — stacked labels -->
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:14px;border-top:1px solid #ebe8e4;padding-top:14px">
                    <tr>
                      <td align="center" style="padding-bottom:10px">
                        <p style="margin:0;font-size:11px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.6px">Direct Line</p>
                        <p style="margin:4px 0 0"><a href="tel:+14374228353" style="font-size:16px;font-weight:700;color:#a0522d;text-decoration:none;white-space:nowrap">${ADVISOR_PHONE}</a></p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <p style="margin:0;font-size:11px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.6px">Email</p>
                        <p style="margin:4px 0 0"><a href="mailto:${ADVISOR_EMAIL}" style="font-size:14px;font-weight:600;color:#a0522d;text-decoration:none">${ADVISOR_EMAIL}</a></p>
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
          <td class="footer-cell" style="padding:18px 28px;border-top:1px solid #ebe8e4;font-size:12px;color:#999;line-height:1.5">
            PolicyScanner.ca &middot; Helping Canadians find the right coverage.<br>
            You're receiving this because you selected an insurance plan.
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
