export default function Header() {
  const base = import.meta.env.BASE_URL;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-forter-dark/80 backdrop-blur-xl border-b border-forter-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
        <a href={base} className="flex items-center">
          <img
            src={`${base}forter-logo.png`}
            alt="Forter"
            className="h-7"
          />
        </a>
      </div>
    </header>
  );
}
