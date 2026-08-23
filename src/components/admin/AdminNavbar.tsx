import { Link } from "react-router-dom";

function AdminNavbar() {
  return (
    <nav className="border-b border-gray-200 bg-gray-900 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/dashboard"
          className="text-xl font-bold"
        >
          Admin Panel
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-gray-300 transition hover:text-white"
          >
            Dashboard
          </Link>

          <Link
            to="/registration"
            className="text-gray-300 transition hover:text-white"
          >
            Registration
          </Link>

          <Link
            to="/binding"
            className="text-gray-300 transition hover:text-white"
          >
            Binding
          </Link>

          <button
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-200"
            onClick={() => {
              console.log("Logout clicked");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;