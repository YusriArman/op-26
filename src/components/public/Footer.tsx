// src/components/public/Footer.tsx
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full px-4 sm:px-6 py-4 mt-8 mb-12 sm:mb-16">
      <div className="mx-auto max-w-6xl rounded-none p-[1px] bg-gradient-to-r from-[#3cf6f7]/60 via-[#e139fa]/60 to-[#6045f4]/60 shadow-[0_0_25px_rgba(60,246,247,0.2)] relative">
        <div className="w-full h-full bg-[#090520]/85 backdrop-blur-md p-6 sm:p-8">

          {/* Tech Corner Decorative Accents */}
          <div className="absolute top-0 left-0 h-3.5 w-3.5 border-t-2 border-l-2 border-[#3cf6f7]" />
          <div className="absolute top-0 right-0 h-3.5 w-3.5 border-t-2 border-r-2 border-[#3cf6f7]" />
          <div className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b-2 border-l-2 border-[#3cf6f7]" />
          <div className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b-2 border-r-2 border-[#3cf6f7]" />

          {/* Top Content Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 items-center border-b border-[#3cf6f7]/20 pb-6">

            {/* Col 1: Big Logo */}
            <div className="flex justify-center md:justify-start">
              <img
                src="/Elysium-Logo.png"
                alt="Elysium 2026"
                className="h-28 sm:h-32 w-auto max-w-full object-contain drop-shadow-[0_0_15px_rgba(60,246,247,0.4)]"
              />
            </div>

            {/* Col 2: NAVIGATE */}
            <div>
              <h4 className="text-xs font-futura-heavy font-bold uppercase tracking-[0.2em] text-[#3cf6f7] mb-3 drop-shadow-[0_0_5px_rgba(60,246,247,0.5)]">
                NAVIGATE
              </h4>
              <ul className="space-y-2 text-xs font-futura-book tracking-wider text-gray-300">
                <li>
                  <Link to="/" className="hover:text-[#3cf6f7] transition">
                    &gt; HOME
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-[#3cf6f7] transition">
                    &gt; QUEUE
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-[#3cf6f7] transition">
                    &gt; FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/prizes" className="hover:text-[#3cf6f7] transition">
                    &gt; MERCH &amp; LUCKY DRAW
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: CONNECT */}
            <div>
              <h4 className="text-xs font-futura-heavy font-bold uppercase tracking-[0.2em] text-[#3cf6f7] mb-3 drop-shadow-[0_0_5px_rgba(60,246,247,0.5)]">
                CONNECT
              </h4>
              <ul className="space-y-2 text-xs font-futura-book tracking-wider text-gray-300">
                <li>
                  <a
                    href="https://www.instagram.com/orientation.tlc/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#3cf6f7] transition"
                  >
                    &gt; INSTAGRAM
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/Orientation.TLC/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#3cf6f7] transition"
                  >
                    &gt; FACEBOOK
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:op.elysium2026@gmail.com"
                    className="hover:text-[#3cf6f7] transition"
                  >
                    &gt; EMAIL
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: LOCATION */}
            <div>
              <h4 className="text-xs font-futura-heavy font-bold uppercase tracking-[0.2em] text-[#3cf6f7] mb-3 drop-shadow-[0_0_5px_rgba(60,246,247,0.5)]">
                LOCATION
              </h4>
              <div className="flex items-start gap-2 text-xs font-futura-book tracking-wider text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="#3cf6f7"
                  className="w-5 h-5 shrink-0 drop-shadow-[0_0_5px_rgba(60,246,247,0.8)]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <span>
                  THE GRAND HALL (TGH),<br />
                  TAYLOR'S UNIVERSITY
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-4 text-center text-[10px] font-futura-medium tracking-[0.25em] text-gray-400 uppercase">
            @ 2026 ELYSIUM: ORIENTATION PARTY 2026 . ALL RIGHTS RESERVED
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;