// src/components/Header.tsx
interface HeaderProps {
  title: string;
  description?: string;
  align?: "left" | "center";
}

function Header({
  title,
  description,
  align = "center",
}: HeaderProps) {
  return (
    <header
      className={`mx-auto max-w-5xl px-6 pt-3 sm:pt-5 pb-0 ${align === "center" ? "text-center" : "text-left"
        }`}
    >
      <h1 className="text-2xl sm:text-4xl font-futura-heavy font-extrabold uppercase tracking-[0.2em] text-[#00F0FF] drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]">
        {title}
      </h1>

      {description && (
        <p className="mt-2 text-xs sm:text-sm font-futura-book text-gray-300 max-w-2xl mx-auto leading-relaxed tracking-wide">
          {description}
        </p>
      )}
    </header>
  );
}

export default Header;