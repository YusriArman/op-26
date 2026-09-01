import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../utils/supabase";

function Admin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    navigate("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-admin px-6">
      <div className="glass-card w-full max-w-md rounded-2xl p-8">

        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Admin Login</h1>
          <p className="mt-2 text-sm text-[#8592B4]">Sign in to access the admin dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">

          <div>
            <label htmlFor="email" className="text-sm font-medium text-white">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-[#5b6785] outline-none focus:border-[#4C7CFF]"
              placeholder="example@gmail.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-white">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-[#5b6785] outline-none focus:border-[#4C7CFF]"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg border border-[#F87171]/20 bg-[#F87171]/10 px-4 py-3 text-sm text-[#F87171]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#4C7CFF] px-4 py-2 text-white shadow-[0_0_20px_rgba(76,124,255,0.35)] transition hover:bg-[#3D68E0] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-[#5b6785] disabled:shadow-none"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </main>
  );
}

export default Admin;