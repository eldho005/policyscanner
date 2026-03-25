-- ═══════════════════════════════════════════════════════════════
--  Migration 002 — Communication columns on leads table
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS follow_up_sent      BOOLEAN     DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS follow_up_sent_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_unsubscribed  BOOLEAN     DEFAULT FALSE;
