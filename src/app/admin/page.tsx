"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Invalid password");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* ── Logo / Branding ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-[-0.02em] text-foreground">
            PolicyScanner Admin
          </h1>
          <p className="text-sm text-foreground/60 mt-1">
            Enter your password to access the dashboard
          </p>
        </div>

        {/* ── Login Card ── */}
        <form onSubmit={handleSubmit} className="bg-white border border-border rounded-lg p-6 shadow-sm">
          {error && (
            <div className="flex items-center gap-2 bg-accent-red/8 border border-accent-red/20 text-accent-red rounded-md px-3 py-2.5 text-sm mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <label className="block text-sm font-medium text-foreground/80 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              autoFocus
              className="w-full border-[1.5px] border-border rounded-sm px-3.5 py-3 pr-10 text-sm
                         focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-light)]
                         focus:outline-none transition-all duration-130"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="mt-4 w-full bg-primary text-white font-semibold text-sm py-3 rounded-sm
                       hover:bg-primary-hover active:scale-[0.98] transition-all duration-130
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-foreground/40 mt-6">
          Protected area — authorized personnel only
        </p>
      </div>
    </div>
  );
}
