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
      <Link to={mainTo} className="text-sm text-[#8592B4] transition hover:text-white">
        {label}
      </Link>

      {open && (
        <div className="absolute left-0 top-full z-10 w-52 pt-2">
          <div className="glass-card rounded-lg py-1 shadow-xl shadow-black/40">
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block px-4 py-2 text-sm text-[#8592B4] transition hover:bg-white/5 hover:text-white"
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