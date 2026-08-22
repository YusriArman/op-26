import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-xl font-bold"
        >
          Orientation Party 2026
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-600 transition hover:text-black"
          >
            Home
          </Link>

          <Link
            to="/faq"
            className="text-gray-600 transition hover:text-black"
          >
            FAQ
          </Link>

          <Link
            to="/prizes"
            className="text-gray-600 transition hover:text-black"
          >
            Prizes
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;