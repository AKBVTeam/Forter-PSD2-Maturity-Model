import { ArrowRight, TrendingUp, ShieldCheck, BarChart3, DollarSign, Target, Layers } from "lucide-react";
import { industryStats } from "../data/levels";

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-forter-hero pt-16">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-forter-blue/12 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-forter-blue-light/10 blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-forter-blue-light mb-8">
            <ShieldCheck className="w-4 h-4" />
            PSD2 Authentication Maturity Assessment
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Is PSD2 costing you{" "}
            <span className="bg-gradient-to-r from-forter-blue-light to-forter-coral bg-clip-text text-transparent">
              revenue?
            </span>
          </h1>

          <p className="text-lg md:text-xl text-forter-muted leading-relaxed mb-10 max-w-2xl mx-auto">
            1 in 4 good customers drop off after a 3DS challenge. Most merchants
            can't see the problem, let alone fix it. Discover where your
            authentication strategy sits on the maturity curve and unlock the
            revenue you're leaving behind.
          </p>

          <button
            onClick={onStart}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-forter-blue to-forter-blue-light text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-lg shadow-forter-blue/25 hover:shadow-forter-blue/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Take the 2-Minute Assessment
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-forter-muted text-sm mt-4">
            5 quick questions · Free · Instant results
          </p>

          {/* What you'll get */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="flex items-start gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-3.5 text-left">
              <DollarSign className="w-5 h-5 text-forter-teal flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-semibold leading-tight">GMV Recovery Estimate</p>
                <p className="text-forter-muted text-xs mt-0.5">See how much revenue Forter could unlock for your business</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-3.5 text-left">
              <Target className="w-5 h-5 text-forter-purple-light flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-semibold leading-tight">Personalised Roadmap</p>
                <p className="text-forter-muted text-xs mt-0.5">Tailored to your AOV, challenge rate, and maturity level</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-3.5 text-left">
              <Layers className="w-5 h-5 text-forter-coral flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-semibold leading-tight">Maturity Benchmark</p>
                <p className="text-forter-muted text-xs mt-0.5">See where you sit vs. industry leaders across 5 levels</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
          {industryStats.slice(0, 6).map((stat, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-5 text-center hover:border-forter-blue/40 transition-colors"
            >
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-forter-muted leading-snug">
                {stat.label}
              </div>
              <div className="text-xs text-forter-blue-light mt-1.5">
                {stat.source}
              </div>
            </div>
          ))}
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-forter-muted animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-forter-teal" />
            Based on data from Forter, ECB, EBA, Stripe & MRC
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BarChart3 className="w-4 h-4 text-forter-teal" />
            Trusted by world's leading ecommerce brands
          </div>
        </div>
      </div>
    </section>
  );
}
