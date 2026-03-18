import { Shield } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-forter-dark/80 backdrop-blur-xl border-b border-forter-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forter-purple to-forter-purple-light flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            forter
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-forter-muted">
          <a href="#assessment" className="hover:text-white transition-colors">
            Assessment
          </a>
          <a href="#maturity-model" className="hover:text-white transition-colors">
            Maturity Model
          </a>
          <a href="#insights" className="hover:text-white transition-colors">
            Insights
          </a>
        </nav>
      </div>
    </header>
  );
}
