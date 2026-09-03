// src/components/public/Footer.tsx
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full bg-[#00081b] px-4 sm:px-6 py-10 mt-8 mb-12 sm:mb-16">
      <div className="mx-auto max-w-6xl rounded-none p-[1px] bg-gradient-to-r from-[#00F0FF]/50 via-[#E000FF]/50 to-[#2596be]/50 shadow-[0_0_25px_rgba(0,240,255,0.15)] relative overflow-hidden">
        <div className="w-full h-full bg-[#090520]/85 backdrop-blur-md p-6 sm:p-10">

          {/* Tech Corner Decorative Accents */}
          <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-[#00F0FF]" />
          <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-[#00F0FF]" />
          <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-[#00F0FF]" />
          <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-[#00F0FF]" />

          {/* Top Content Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center border-b border-cyan-400/20 pb-8">

            {/* Col 1: Big Star Logo */}
            <div className="flex justify-center md:justify-start">
              <img
                src="/Elysium-Logo.png"
                alt="Elysium 2026"
                className="h-36 sm:h-44 md:h-48 w-auto object-contain drop-shadow-[0_0_20px_rgba(0,240,255,0.8)]"
              />
            </div>

            {/* Col 2: NAVIGATE */}
            <div>
              <h4 className="text-xs font-futura-heavy font-bold uppercase tracking-[0.2em] text-[#00F0FF] mb-3 drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
                NAVIGATE
              </h4>
              <ul className="space-y-2 text-xs font-futura-book tracking-wider text-gray-300">
                <li>
                  <Link to="/" className="hover:text-[#00F0FF] transition">
                    &gt; HOME
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-[#00F0FF] transition">
                    &gt; QUEUE
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-[#00F0FF] transition">
                    &gt; FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/prizes" className="hover:text-[#00F0FF] transition">
                    &gt; MERCH &amp; LUCKY DRAW
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: CONNECT */}
            <div>
              <h4 className="text-xs font-futura-heavy font-bold uppercase tracking-[0.2em] text-[#00F0FF] mb-3 drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
                CONNECT
              </h4>
              <ul className="space-y-2 text-xs font-futura-book tracking-wider text-gray-300">
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#00F0FF] transition"
                  >
                    &gt; INSTAGRAM
                  </a>
                </li>
                <li>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#00F0FF] transition"
                  >
                    &gt; FACEBOOK
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:elysium@gmail.com"
                    className="hover:text-[#00F0FF] transition"
                  >
                    &gt; EMAIL
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: LOCATION */}
            <div>
              <h4 className="text-xs font-futura-heavy font-bold uppercase tracking-[0.2em] text-[#00F0FF] mb-3 drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
                LOCATION
              </h4>
              <div className="flex items-start gap-2 text-xs font-futura-book tracking-wider text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="#00F0FF"
                  className="w-5 h-5 flex-shrink-0 drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]"
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
          <div className="pt-6 text-center text-[10px] font-futura-medium tracking-[0.25em] text-gray-400 uppercase">
            @ 2026 ELYSIUM: ORIENTATION PARTY 2026 . ALL RIGHTS RESERVED
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;