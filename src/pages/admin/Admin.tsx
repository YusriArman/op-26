import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../utils/supabase";

function Admin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    // Successful login
    navigate("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

        <div>
          <h1 className="text-2xl font-semibold">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to access the admin dashboard.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="mt-6 space-y-4"
        >

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
              placeholder="example@gmail.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </main>
  );
}

export default Admin;