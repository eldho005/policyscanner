"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  RefreshCw,
  LogOut,
  Users,
  Clock,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";

/* ───────────────────── Types ───────────────────── */

interface Lead {
  id: string;
  created_at: string;
  session_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  province: string;
  policy_type: string;
  coverage: number;
  term: number;
  user_risk_class: string;
  period_selected: string | null;
  plan_brand: string | null;
  plan_product: string | null;
  plan_price_monthly: number | null;
  plan_price_annual: number | null;
  plan_risk_class: string | null;
  plan_tag: string | null;
  status: string;
  notes: string | null;
}

/* ───────────────────── Helpers ───────────────────── */

const POLICY_LABELS: Record<string, string> = {
  term: "Term Life",
  whole: "Whole Life",
  mortgage: "Mortgage",
  critical: "Critical Illness",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-accent-blue/10 text-accent-blue",
  contacted: "bg-accent-gold/15 text-accent-gold",
  converted: "bg-accent-green/10 text-accent-green",
  lost: "bg-accent-red/10 text-accent-red",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  }).format(n);
}

function formatCoverage(n: number): string {
  return n >= 1000000
    ? `$${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`
    : `$${(n / 1000).toFixed(0)}K`;
}

const REFRESH_INTERVAL = 10_000; // 10 seconds

/* ───────────────────── Component ───────────────────── */

export default function AdminDashboardPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Fetch leads ── */
  const fetchLeads = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch("/api/admin/leads", { cache: "no-store" });
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
        setLastRefreshed(new Date());
        setError("");
      } else {
        setError(data.error || "Failed to load leads");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [router]);

  /* ── Initial load ── */
  useEffect(() => {
    fetchLeads(true);
  }, [fetchLeads]);

  /* ── Auto-refresh polling ── */
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => fetchLeads(false), REFRESH_INTERVAL);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh, fetchLeads]);

  /* ── Logout ── */
  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin");
  }

  /* ── Stats ── */
  const totalLeads = leads.length;
  const todayLeads = leads.filter(
    (l) => new Date(l.created_at).toDateString() === new Date().toDateString(),
  ).length;
  const newLeads = leads.filter((l) => l.status === "new").length;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
      <header className="bg-white border-b border-border sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold tracking-[-0.02em] text-foreground">
              PolicyScanner Admin
            </h1>
            <p className="text-xs text-foreground/50 mt-0.5">
              Lead Management Dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Auto-refresh toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                autoRefresh
                  ? "bg-accent-green/10 border-accent-green/30 text-accent-green"
                  : "bg-foreground/5 border-border text-foreground/50"
              }`}
            >
              {autoRefresh ? "● Live" : "○ Paused"}
            </button>

            {/* Manual refresh */}
            <button
              onClick={() => fetchLeads(false)}
              className="p-2 rounded-md hover:bg-foreground/5 text-foreground/50 hover:text-foreground transition-colors"
              title="Refresh now"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-foreground/50 hover:text-accent-red
                         px-3 py-1.5 rounded-md hover:bg-accent-red/5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard icon={<Users className="w-5 h-5" />} label="Total Leads" value={totalLeads} color="primary" />
          <StatCard icon={<Clock className="w-5 h-5" />} label="Today" value={todayLeads} color="blue" />
          <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Awaiting Contact" value={newLeads} color="green" />
        </div>

        {/* ── Last refreshed ── */}
        {lastRefreshed && (
          <p className="text-xs text-foreground/40 mb-3">
            Last updated: {lastRefreshed.toLocaleTimeString()}
            {autoRefresh && " — auto-refreshing every 10s"}
          </p>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="bg-accent-red/8 border border-accent-red/20 text-accent-red rounded-md px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        {/* ── Loading ── */}
        {loading && leads.length === 0 && (
          <div className="flex items-center justify-center py-20 text-foreground/50">
            <RefreshCw className="w-5 h-5 animate-spin mr-2" />
            Loading leads…
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && leads.length === 0 && !error && (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-foreground/20 mx-auto mb-3" />
            <p className="text-foreground/50 font-medium">No leads yet</p>
            <p className="text-foreground/40 text-sm mt-1">
              Leads will appear here when users submit a quote request
            </p>
          </div>
        )}

        {/* ── Leads Table ── */}
        {leads.length > 0 && (
          <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">
            {/* Table header */}
            <div className="hidden lg:grid grid-cols-[1fr_1fr_0.8fr_0.8fr_0.6fr_0.5fr_80px] gap-3 px-5 py-3 bg-foreground/[0.02] border-b border-border text-xs font-semibold text-foreground/50 uppercase tracking-wider">
              <span>Contact</span>
              <span>Plan</span>
              <span>Coverage / Term</span>
              <span>Premium</span>
              <span>Province</span>
              <span>Status</span>
              <span>Time</span>
            </div>

            {/* Rows */}
            {leads.map((lead) => {
              const isExpanded = expandedId === lead.id;
              return (
                <div key={lead.id} className="border-b border-border last:border-b-0">
                  {/* Main row — clickable to expand */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                    className="w-full text-left grid grid-cols-1 lg:grid-cols-[1fr_1fr_0.8fr_0.8fr_0.6fr_0.5fr_80px] gap-2 lg:gap-3 px-5 py-3.5 hover:bg-foreground/[0.015] transition-colors"
                  >
                    {/* Contact */}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{lead.full_name}</p>
                      <p className="text-xs text-foreground/50 truncate">{lead.email}</p>
                    </div>

                    {/* Plan */}
                    <div className="min-w-0 hidden lg:block">
                      <p className="text-sm text-foreground truncate">{lead.plan_brand || "—"}</p>
                      <p className="text-xs text-foreground/50 truncate">{lead.plan_product || "—"}</p>
                    </div>

                    {/* Coverage / Term */}
                    <div className="hidden lg:block">
                      <p className="text-sm text-foreground">{formatCoverage(lead.coverage)}</p>
                      <p className="text-xs text-foreground/50">{lead.term}yr {POLICY_LABELS[lead.policy_type] || lead.policy_type}</p>
                    </div>

                    {/* Premium */}
                    <div className="hidden lg:block">
                      <p className="text-sm text-foreground">
                        {lead.plan_price_monthly != null ? `${formatCurrency(lead.plan_price_monthly)}/mo` : "—"}
                      </p>
                      <p className="text-xs text-foreground/50">
                        {lead.plan_price_annual != null ? `${formatCurrency(lead.plan_price_annual)}/yr` : ""}
                      </p>
                    </div>

                    {/* Province */}
                    <div className="hidden lg:block">
                      <p className="text-sm text-foreground">{lead.province}</p>
                    </div>

                    {/* Status */}
                    <div className="hidden lg:block">
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[lead.status] || "bg-foreground/5 text-foreground/50"}`}>
                        {lead.status}
                      </span>
                    </div>

                    {/* Time + expand arrow */}
                    <div className="flex items-center justify-between lg:justify-start gap-2">
                      <span className="text-xs text-foreground/40">{timeAgo(lead.created_at)}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-foreground/30 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-foreground/30 shrink-0" />
                      )}
                    </div>
                  </button>

                  {/* Expanded detail panel */}
                  {isExpanded && (
                    <div className="px-5 pb-4 pt-1 bg-foreground/[0.01] border-t border-border/50 animate-step-enter">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <DetailItem icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={lead.email} />
                        <DetailItem icon={<Phone className="w-3.5 h-3.5" />} label="Phone" value={lead.phone} />
                        <DetailItem icon={<MapPin className="w-3.5 h-3.5" />} label="Province" value={lead.province} />
                        <DetailItem icon={<Calendar className="w-3.5 h-3.5" />} label="Date" value={new Date(lead.created_at).toLocaleString()} />

                        <DetailItem label="Plan Brand" value={lead.plan_brand} />
                        <DetailItem label="Plan Product" value={lead.plan_product} />
                        <DetailItem label="Plan Tag" value={lead.plan_tag} />
                        <DetailItem label="Plan Risk Class" value={lead.plan_risk_class} />

                        <DetailItem label="Policy Type" value={POLICY_LABELS[lead.policy_type] || lead.policy_type} />
                        <DetailItem label="Coverage" value={formatCoverage(lead.coverage)} />
                        <DetailItem label="Term" value={`${lead.term} years`} />
                        <DetailItem label="User Risk Class" value={lead.user_risk_class} />

                        <DetailItem label="Monthly Premium" value={lead.plan_price_monthly != null ? formatCurrency(lead.plan_price_monthly) : "—"} />
                        <DetailItem label="Annual Premium" value={lead.plan_price_annual != null ? formatCurrency(lead.plan_price_annual) : "—"} />
                        <DetailItem label="Period Selected" value={lead.period_selected} />
                        <DetailItem label="Status" value={lead.status} />
                      </div>
                      {lead.session_id && (
                        <p className="text-xs text-foreground/30 mt-3">
                          Session: {lead.session_id}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

/* ───────────────────── Sub-components ───────────────────── */

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "primary" | "blue" | "green";
}) {
  const colorMap = {
    primary: "bg-primary/8 text-primary",
    blue: "bg-accent-blue/8 text-accent-blue",
    green: "bg-accent-green/8 text-accent-green",
  };
  return (
    <div className="bg-white border border-border rounded-lg p-4 flex items-center gap-4">
      <div className={`p-2.5 rounded-lg ${colorMap[color]}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-foreground tracking-[-0.02em]">{value}</p>
        <p className="text-xs text-foreground/50">{label}</p>
      </div>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string | null;
}) {
  return (
    <div>
      <p className="text-xs text-foreground/45 mb-0.5 flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="text-sm text-foreground font-medium">{value || "—"}</p>
    </div>
  );
}
