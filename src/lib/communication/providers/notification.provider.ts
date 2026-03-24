// ═══════════════════════════════════════════════════════════════
//  Notification Provider — Supabase DB + Console (V1)
//
//  Writes admin notifications to a `notifications` table (if it
//  exists) and logs to console. The admin dashboard can poll or
//  subscribe to this table for real-time alerts.
// ═══════════════════════════════════════════════════════════════

import type {
  NotificationProvider,
  AdminNotification,
  NotificationResult,
} from "../types";
import { getSupabase } from "@/lib/db/supabase";

export class DbNotificationProvider implements NotificationProvider {
  async send(notification: AdminNotification): Promise<NotificationResult> {
    console.log(
      `[Notification] ${notification.type}: ${notification.title}` +
      (notification.leadId ? ` (lead: ${notification.leadId})` : ""),
    );

    const db = getSupabase();
    if (!db) {
      return { success: true }; // No DB — log-only mode
    }

    try {
      const { error } = await db.from("notifications").insert({
        type: notification.type,
        title: notification.title,
        body: notification.body,
        lead_id: notification.leadId ?? null,
        session_id: notification.sessionId ?? null,
      });

      if (error) {
        // Table may not exist yet — degrade gracefully
        if (error.code === "42P01") {
          console.warn("[Notification] 'notifications' table does not exist — skipping DB write");
          return { success: true };
        }
        console.error("[Notification] DB insert error:", error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error("[Notification] Unexpected error:", err);
      return { success: false, error: "Notification write failed" };
    }
  }
}

// ── Singleton ────────────────────────────────────────────────

let _instance: NotificationProvider | null = null;

export function getNotificationProvider(): NotificationProvider {
  if (!_instance) {
    _instance = new DbNotificationProvider();
  }
  return _instance;
}
