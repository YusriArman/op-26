interface HeaderProps {
  title: string;
  description?: string;
  align?: "left" | "center";
}

function Header({
  title,
  description,
  align = "left",
}: HeaderProps) {
  return (
    <header
      className={`mx-auto max-w-6xl px-6 py-8 ${
        align === "center" ? "text-center" : "text-left"
      }`}
    >
      <h1 className="text-3xl font-medium tracking-tight">
        {title}
      </h1>

      {description && (
        <p className="mt-2 text-sm text-gray-600">
          {description}
        </p>
      )}
    </header>
  );
}

export default Header;