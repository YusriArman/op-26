import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { supabase } from "../../utils/supabase";

// Derives Supabase's localStorage session key from the project URL so this
// keeps working automatically if the Supabase project ever changes, instead
// of hardcoding a project ref.
function getSupabaseStorageKey(): string | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  if (!url) return null;

  try {
    const projectRef = new URL(url).hostname.split(".")[0];
    return `sb-${projectRef}-auth-token`;
  } catch {
    return null;
  }
}

function Admin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState<string | null>(null);
  const [resetSubmitting, setResetSubmitting] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    // "Keep me signed in" — if unchecked, clear the session token the
    // moment this tab closes, so it isn't remembered on the next visit.
    // This doesn't touch how the session behaves during the visit itself
    // (refreshes, other tabs opened from this one, etc. still work normally).
    if (!rememberMe) {
      const storageKey = getSupabaseStorageKey();
      if (storageKey) {
        window.addEventListener("beforeunload", () => {
          localStorage.removeItem(storageKey);
        });
      }
    }

    navigate("/dashboard");
  }

  async function handleForgotPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResetStatus(null);

    const cleanEmail = resetEmail.trim();
    if (!cleanEmail) {
      setResetStatus("Please enter your email address.");
      return;
    }

    setResetSubmitting(true);

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setResetSubmitting(false);

    if (error) {
      setResetStatus(error.message);
      return;
    }

    setResetStatus("If an account exists for that email, a reset link has been sent.");
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center px-6 py-12"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      {/* Darken and tint the background for readability, without editing the image itself */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,7,13,0.75) 0%, rgba(11,18,38,0.85) 55%, rgba(5,7,13,0.9) 100%)",
        }}
      />

      <div className="relative z-10 flex w-full flex-col items-center">

        {/* Logo — intentionally not constrained by the card's max-w-md below,
            so it can render much larger while the form stays a normal width */}
        <img
          src="/Elysium Logo (Blue).png"
          alt="Elysium Logo"
          className="h-auto w-[min(85vw,60rem)] object-contain drop-shadow-[0_0_25px_rgba(56,230,255,0.35)]"
        />

        <h1 className="font-display text-2xl font-bold uppercase tracking-[0.2em] text-[#38E6FF] [text-shadow:0_0_20px_rgba(56,230,255,0.6)]">
          Admin Login
        </h1>
        <p className="mt-1 text-sm text-[#8592B4]">Sign in to access the admin dashboard.</p>

        {/* Card */}
        <div className="mt-8 w-full max-w-md rounded-2xl border border-[#38E6FF]/25 bg-[#0b1226]/95 p-8 shadow-[0_0_60px_rgba(56,230,255,0.15)] backdrop-blur-md">

          {!showForgotPassword ? (
            <form onSubmit={handleLogin} className="space-y-4">

              <div>
                <label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-[#8592B4]">
                  Email
                </label>
                <div className="relative mt-1">
                  <svg
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5b6785]"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/10 py-2.5 pl-10 pr-3 text-white placeholder:text-[#5b6785] outline-none focus:border-[#38E6FF]"
                    placeholder="Elysium_something@gmail.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="text-xs font-medium uppercase tracking-wide text-[#8592B4]">
                  Password
                </label>
                <div className="relative mt-1">
                  <svg
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5b6785]"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/10 py-2.5 pl-10 pr-3 text-white placeholder:text-[#5b6785] outline-none focus:border-[#38E6FF]"
                    placeholder="Enter secure password"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-[#8592B4]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#38E6FF] focus:ring-[#38E6FF]"
                  />
                  Keep me signed in
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setResetEmail(email);
                    setResetStatus(null);
                  }}
                  className="text-[#38E6FF] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {error && (
                <div className="rounded-lg border border-[#F87171]/20 bg-[#F87171]/10 px-4 py-3 text-sm text-[#F87171]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-linear-to-r from-[#38E6FF] to-[#A855F7] px-4 py-3 font-semibold text-[#04060c] shadow-[0_0_30px_rgba(56,230,255,0.35)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In to Admin →"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-white">Reset your password</h2>
                <p className="mt-1 text-xs text-[#8592B4]">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <input
                type="email"
                value={resetEmail}
                onChange={(event) => setResetEmail(event.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2.5 text-white placeholder:text-[#5b6785] outline-none focus:border-[#38E6FF]"
                required
              />

              {resetStatus && (
                <div className="rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm text-[#8592B4]">
                  {resetStatus}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-[#8592B4] transition hover:text-white"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={resetSubmitting}
                  className="flex-1 rounded-lg bg-linear-to-r from-[#38E6FF] to-[#A855F7] px-4 py-2.5 text-sm font-semibold text-[#04060c] shadow-[0_0_30px_rgba(56,230,255,0.35)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {resetSubmitting ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          )}
        </div>

        <Link
          to="/"
          className="mt-6 rounded-lg border border-[#38E6FF]/30 px-6 py-2.5 text-sm font-medium text-[#38E6FF] transition hover:bg-[#38E6FF]/10"
        >
          ← Back to the Website
        </Link>
      </div>
    </main>
  );
}

export default Admin;