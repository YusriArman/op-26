function Admin() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">
          Admin Login
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Sign in to access the admin dashboard.
        </p>

        <form className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}

export default Admin;