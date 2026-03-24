// ═══════════════════════════════════════════════════════════════
//  Email Template — Quote Confirmation
//  Sent immediately after a user submits the quote form.
// ═══════════════════════════════════════════════════════════════

import type { LeadCapturedEvent } from "../types";
import { escapeHtml } from "../utils/html";

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

export function buildQuoteConfirmationEmail(event: LeadCapturedEvent) {
  const firstName = escapeHtml(event.fullName.split(" ")[0] || event.fullName);
  const policyLabel = POLICY_LABELS[event.policyType] ?? event.policyType;
  const coverageLabel = formatCoverage(event.coverage);
  const safeProvince = escapeHtml(event.province);

  const subject = `Your ${policyLabel} quotes are ready — PolicyScanner`;

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
              Hi ${firstName}, your quotes are ready!
            </h1>
            <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6">
              Thank you for using PolicyScanner. We've compared rates from Canada's top insurance carriers based on your profile.
            </p>

            <!-- Quote Summary Box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fb;border:1px solid #e8eaed;border-radius:6px;margin-bottom:24px">
              <tr>
                <td style="padding:20px">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:12px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.8px;padding-bottom:12px">
                        Your Quote Summary
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="font-size:14px;color:#555;padding:4px 0">Policy Type</td>
                            <td align="right" style="font-size:14px;font-weight:600;color:#1a1a2e">${policyLabel}</td>
                          </tr>
                          <tr>
                            <td style="font-size:14px;color:#555;padding:4px 0">Coverage</td>
                            <td align="right" style="font-size:14px;font-weight:600;color:#1a1a2e">${coverageLabel}</td>
                          </tr>
                          ${event.term > 0 ? `
                          <tr>
                            <td style="font-size:14px;color:#555;padding:4px 0">Term</td>
                            <td align="right" style="font-size:14px;font-weight:600;color:#1a1a2e">${event.term} years</td>
                          </tr>` : ""}
                          <tr>
                            <td style="font-size:14px;color:#555;padding:4px 0">Province</td>
                            <td align="right" style="font-size:14px;font-weight:600;color:#1a1a2e">${safeProvince}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- What's Next -->
            <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#1a1a2e">What happens next?</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
              <tr>
                <td style="padding:6px 0;font-size:14px;color:#555;line-height:1.5">
                  <strong style="color:#1a1a2e">1.</strong> A licensed advisor will review your results
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:14px;color:#555;line-height:1.5">
                  <strong style="color:#1a1a2e">2.</strong> They'll call you within 1 business day
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:14px;color:#555;line-height:1.5">
                  <strong style="color:#1a1a2e">3.</strong> No commitment required — compare before you decide
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#888;line-height:1.5">
              Questions? Reply to this email or call us at <strong style="color:#555">1-800-555-0199</strong>.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #e8eaed;font-size:12px;color:#999;line-height:1.5">
            PolicyScanner.ca &middot; Helping Canadians find the right coverage.<br>
            You're receiving this because you requested an insurance quote.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();

  return { subject, html };
}
