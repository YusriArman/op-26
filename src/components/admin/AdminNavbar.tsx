import { Link } from "react-router-dom";

function AdminNavbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Admin title */}
        <Link
          to="/dashboard"
          className="text-sm font-semibold uppercase"
        >
          Elysium Admin
        </Link>

        {/* Admin navigation */}
        <div className="flex items-center gap-6 text-sm">
          <Link
            to="/dashboard"
            className="text-gray-600 transition hover:text-black"
          >
            Dashboard
          </Link>

          <Link
            to="/registration"
            className="text-gray-600 transition hover:text-black"
          >
            Registration
          </Link>

          <Link
            to="/binding"
            className="text-gray-600 transition hover:text-black"
          >
            Binding
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;