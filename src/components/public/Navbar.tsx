// src/components/public/Navbar.tsx
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-cyan-400/20 bg-[#040212]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo + Event Name */}
        <Link
          to="/"
          className="group flex items-center gap-3 transition-transform duration-300 hover:scale-105"
        >
          <img
            src="/Elysium-Logo.png"
            alt="Elysium Logo"
            className="h-8 w-auto object-contain drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"
          />
          <span className="text-xs sm:text-sm font-futura-heavy font-bold tracking-[0.15em] text-[#00F0FF] uppercase drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">
            ELYSIUM: ORIENTATION PARTY 2026
          </span>
        </Link>

        {/* Public Navigation Links */}
        <div className="flex items-center gap-6 sm:gap-8 text-xs sm:text-sm font-futura-medium font-semibold tracking-widest uppercase">
          <Link
            to="/"
            className={`transition duration-200 ${isActive("/")
              ? "text-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.9)]"
              : "text-gray-300 hover:text-[#00F0FF] hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"
              }`}
          >
            HOME
          </Link>

          <Link
            to="/faq"
            className={`transition duration-200 ${isActive("/faq")
              ? "text-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.9)]"
              : "text-gray-300 hover:text-[#00F0FF] hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"
              }`}
          >
            FAQ
          </Link>

          <Link
            to="/prizes"
            className={`transition duration-200 ${isActive("/prizes")
              ? "text-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.9)]"
              : "text-gray-300 hover:text-[#00F0FF] hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"
              }`}
          >
            MERCH & LUCKY DRAW
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;