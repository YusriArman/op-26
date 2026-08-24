import { useState } from "react";
import { Link } from "react-router-dom";

interface NavDropdownItem {
  label: string;
  to: string;
}

interface NavDropdownProps {
  label: string;
  mainTo: string;
  items: NavDropdownItem[];
}

function NavDropdown({ label, mainTo, items }: NavDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        to={mainTo}
        className="text-gray-600 transition hover:text-black"
      >
        {label}
      </Link>

      {open && (
        <div className="absolute left-0 top-full z-10 w-52 pt-2">
          <div className="rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-black"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NavDropdown;