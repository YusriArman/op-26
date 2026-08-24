import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/UseAuth";
import NavDropdown from "./Navdropdown";

function AdminNavbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">

        {/* Logo + Admin */}
        <Link
          to="/dashboard"
          className="flex items-center gap-3"
        >
          <img
            src="/Elysium_Logo.jpg"
            alt="Elysium Logo"
            className="h-8 w-8 object-contain"
          />

          <span className="text-lg font-semibold">
            ELYSIUM ADMIN
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">

          <NavDropdown
            label="Dashboard"
            mainTo="/dashboard"
            items={[
              { label: "Attended Students", to: "/attended" },
            ]}
          />

          <Link
            to="/registration"
            className="text-gray-600 transition hover:text-black"
          >
            Registration
          </Link>

          <NavDropdown
            label="Binding"
            mainTo="/binding"
            items={[
              { label: "Day 1 (TGH)", to: "/binding/day-1" },
              { label: "Day 2 (LT1)", to: "/binding/day-2" },
              { label: "Waitlist", to: "/binding/waitlist" },
            ]}
          />

          <Link
            to="/database"
            className="text-gray-600 transition hover:text-black"
          >
            Database
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-md bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-800"
          >
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
}

export default AdminNavbar;