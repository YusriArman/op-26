import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/UseAuth";
import NavDropdown from "./Navdropdown";

function AdminNavbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    setMobileOpen(false);
    await logout();
    navigate("/login");
  }

  return (
    <nav className="glass-card sticky top-0 z-20 border-x-0 border-t-0">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">

        <Link to="/dashboard" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <img
            src="/Elysium Logo (Blue).png"
            alt="Elysium Logo"
            className="h-auto w-20 object-contain sm:w-28"
          />
          <span className="font-display text-base font-semibold tracking-tight text-white sm:text-lg">
            ELYSIUM ADMIN
          </span>
        </Link>

        {/* Desktop nav — hidden below md */}
        <div className="hidden items-center gap-6 md:flex">
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

        {/* Mobile hamburger — hidden at md and above */}
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10 md:hidden"
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

      </div>

      {/* Mobile menu panel — flat stacked list, tap-friendly, no hover dependency */}
      {mobileOpen && (
        <div className="border-t border-white/10 px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">

            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-white transition hover:bg-white/5"
            >
              Dashboard
            </Link>
            <Link
              to="/attended"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 pl-6 text-sm text-[#8592B4] transition hover:bg-white/5 hover:text-white"
            >
              Attended Students
            </Link>

            <Link
              to="/registration"
              onClick={() => setMobileOpen(false)}
              className="mt-1 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition hover:bg-white/5"
            >
              Registration
            </Link>

            <Link
              to="/binding"
              onClick={() => setMobileOpen(false)}
              className="mt-1 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition hover:bg-white/5"
            >
              Binding
            </Link>
            <Link
              to="/binding/day-1"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 pl-6 text-sm text-[#8592B4] transition hover:bg-white/5 hover:text-white"
            >
              Day 1 (TGH)
            </Link>
            <Link
              to="/binding/day-2"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 pl-6 text-sm text-[#8592B4] transition hover:bg-white/5 hover:text-white"
            >
              Day 2 (LT1)
            </Link>
            <Link
              to="/binding/waitlist"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 pl-6 text-sm text-[#8592B4] transition hover:bg-white/5 hover:text-white"
            >
              Waitlist
            </Link>

            <Link
              to="/database"
              onClick={() => setMobileOpen(false)}
              className="mt-1 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition hover:bg-white/5"
            >
              Database
            </Link>

            <button
              onClick={handleLogout}
              className="mt-3 rounded-lg bg-[#4C7CFF] px-4 py-2.5 text-sm font-medium text-white shadow-[0_0_20px_rgba(76,124,255,0.35)] transition hover:bg-[#3D68E0]"
            >
              Logout
            </button>

          </div>
        </div>
      )}
    </nav>
  );
}

export default AdminNavbar;