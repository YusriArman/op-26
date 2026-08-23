function Footer() {
  return (
    <footer className="border-t border-gray-300 bg-gray-200">
      <div className="mx-auto flex max-w-6xl items-start justify-between px-6 py-8">
        {/* Logo */}
        <div>
          <p className="text-lg font-medium">
            LOGO
          </p>

          <div className="mt-3 space-y-1">
            <div className="h-2 w-32 bg-gray-400" />
            <div className="h-2 w-32 bg-gray-400" />
          </div>
        </div>

        {/* Contact */}
        <div className="text-xs">
          <div>
            <p className="font-semibold">
              OP EMAIL
            </p>

            <p className="text-gray-700">
              elysium@gmail.com
            </p>
          </div>

          <div className="mt-3">
            <p className="font-semibold">
              INSTAGRAM
            </p>

            <p className="text-gray-700">
              @Instagram
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;