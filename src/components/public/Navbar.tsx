// src/components/public/Navbar.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `transition duration-200 ${
      isActive(path)
        ? "text-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.9)]"
        : "text-gray-300 hover:text-[#00F0FF] hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"
    }`;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-cyan-400/20 bg-[#040212]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">

        {/* Logo + Event Name */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="group flex items-center gap-2 transition-transform duration-300 hover:scale-105 sm:gap-3"
        >
          <img
            src="/Elysium-Logo.png"
            alt="Elysium Logo"
            className="h-7 w-auto object-contain drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] sm:h-8"
          />
          {/* Full name on wider screens */}
          <span className="hidden text-xs font-futura-heavy font-bold uppercase tracking-[0.15em] text-[#00F0FF] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)] sm:inline sm:text-sm">
            ELYSIUM: ORIENTATION PARTY 2026
          </span>
          {/* Shortened name on narrow screens so it never wraps/overflows */}
          <span className="text-xs font-futura-heavy font-bold uppercase tracking-[0.15em] text-[#00F0FF] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)] sm:hidden">
            ELYSIUM 2026
          </span>
        </Link>

        {/* Desktop nav links — hidden below md */}
        <div className="hidden items-center gap-6 text-xs font-futura-medium font-semibold uppercase tracking-widest sm:gap-8 sm:text-sm md:flex">
          <Link to="/" className={linkClass("/")}>HOME</Link>
          <Link to="/faq" className={linkClass("/faq")}>FAQ</Link>
          <Link to="/prizes" className={linkClass("/prizes")}>MERCH &amp; LUCKY DRAW</Link>
        </div>

        {/* Mobile hamburger — hidden at md and above */}
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="flex h-9 w-9 items-center justify-center text-[#00F0FF] md:hidden"
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="border-t border-cyan-400/20 bg-[#040212]/95 px-4 pb-4 pt-3 md:hidden">
          <div className="flex flex-col gap-3 text-xs font-futura-medium font-semibold uppercase tracking-widest">
            <Link to="/" onClick={() => setMobileOpen(false)} className={linkClass("/")}>
              HOME
            </Link>
            <Link to="/faq" onClick={() => setMobileOpen(false)} className={linkClass("/faq")}>
              FAQ
            </Link>
            <Link to="/prizes" onClick={() => setMobileOpen(false)} className={linkClass("/prizes")}>
              MERCH &amp; LUCKY DRAW
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;