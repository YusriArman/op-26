interface HeaderProps {
  title: string;
  description?: string;
}

function Header({ title, description }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="mt-3 text-gray-600">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}

export default Header;