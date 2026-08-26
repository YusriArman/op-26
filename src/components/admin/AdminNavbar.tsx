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
    <nav className="glass-card sticky top-0 z-20 border-x-0 border-t-0">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">

        <Link to="/dashboard" className="flex items-center gap-3">
          <img
            src="/Elysium_Logo.jpg"
            alt="Elysium Logo"
            className="h-8 w-8 rounded-md object-contain ring-1 ring-white/10"
          />
          <span className="font-display text-lg font-semibold tracking-tight text-white">
            ELYSIUM ADMIN
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <NavDropdown
            label="Dashboard"
            mainTo="/dashboard"
            items={[{ label: "Attended Students", to: "/attended" }]}
          />

          <Link to="/registration" className="text-sm text-[#8592B4] transition hover:text-white">
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

          <Link to="/database" className="text-sm text-[#8592B4] transition hover:text-white">
            Database
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-[#4C7CFF] px-4 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(76,124,255,0.35)] transition hover:bg-[#3D68E0]"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
}

export default AdminNavbar;