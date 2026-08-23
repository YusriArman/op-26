import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2">
        {/* Logo / Event Name */}
        <Link
          to="/"
          className="text-xs font-medium uppercase"
        >
          Elysium: Orientation Party 2026
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6 text-xs">
          <Link
            to="/"
            className="transition hover:text-gray-500"
          >
            HOME
          </Link>

          <Link
            to="/faq"
            className="transition hover:text-gray-500"
          >
            FAQ
          </Link>

          <Link
            to="/prizes"
            className="transition hover:text-gray-500"
          >
            MERCH & LUCKY DRAW
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;