import { useMemo } from "react";
import { maturityLevels } from "../data/levels";
import { getChallengeRatesByLevel } from "../data/exemptions";
import {
  Shield,
  FileSearch,
  BarChart3,
  Layers,
  Brain,
  CheckCircle2,
} from "lucide-react";

interface MaturityModelProps {
  currentLevel: number;
  aovLabel?: string;
}

const levelIcons = [Shield, FileSearch, BarChart3, Layers, Brain];

const staircaseOffsets = [
  "lg:mt-24",
  "lg:mt-18",
  "lg:mt-12",
  "lg:mt-6",
  "lg:mt-0",
];

export default function MaturityModel({ currentLevel, aovLabel }: MaturityModelProps) {
  const challengeRates = useMemo(
    () => getChallengeRatesByLevel(aovLabel ?? ""),
    [aovLabel]
  );
  const isPersonalised = !!aovLabel;

  return (
    <section id="maturity-model" className="bg-forter-dark py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Merchant Authentication Optimisation Maturity Model
          </h2>
          <p className="text-forter-muted text-lg max-w-2xl mx-auto">
            Most European merchants operate between Level 1 and Level 2. The
            organisations reclaiming the most revenue operate at Levels 4 and 5.
          </p>
        </div>

        {/* Staircase visual */}
        <div className="relative mb-12">
          {/* Axis labels */}
          <div className="hidden lg:block text-xs text-forter-muted font-medium tracking-widest uppercase mb-2">
            &uarr; Revenue Recovery
          </div>

          <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-3">
            {maturityLevels.map((level, i) => {
              const Icon = levelIcons[i];
              const isCurrentLevel = level.level === currentLevel;
              const isPast = level.level < currentLevel;

              const stats = level.stats.map((stat) => {
                if (stat.label === "Typical challenge rate") {
                  return {
                    label: isPersonalised ? "Typical challenge rate *" : stat.label,
                    value: challengeRates[level.level] ?? stat.value,
                  };
                }
                return stat;
              });

              return (
                <div
                  key={level.level}
                  className={`flex-1 relative group ${staircaseOffsets[i]}`}
                >
                  <div
                    className={`relative rounded-xl border p-5 transition-all h-full ${
                      isCurrentLevel
                        ? "border-forter-purple bg-forter-purple/10 shadow-lg shadow-forter-purple/20 lg:scale-[1.03]"
                        : isPast
                        ? "border-forter-border/60 bg-forter-surface/30 opacity-60"
                        : "border-forter-border bg-forter-surface/40 hover:border-forter-purple/30"
                    }`}
                  >
                    {isCurrentLevel && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-forter-purple text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap z-10">
                        YOU ARE HERE
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `color-mix(in srgb, ${level.color} 15%, transparent)` }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: level.color }}
                        />
                      </div>
                      <div>
                        <div
                          className="text-xs font-bold tracking-wider uppercase"
                          style={{ color: level.color }}
                        >
                          Level {level.level}
                        </div>
                        <div className="text-white font-semibold text-sm leading-tight">
                          {level.name}
                        </div>
                      </div>
                    </div>

                    <p className="text-forter-muted text-xs leading-relaxed mb-4">
                      {level.tagline}
                    </p>

                    <div className="space-y-1.5">
                      {stats.map((stat, j) => (
                        <div
                          key={j}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-forter-muted">
                            {stat.label}
                          </span>
                          <span className="text-white font-medium">
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {isPast && (
                      <div className="absolute inset-0 flex items-center justify-center bg-forter-dark/40 rounded-xl">
                        <CheckCircle2 className="w-8 h-8 text-forter-teal/60" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden lg:block text-center mt-6 text-xs text-forter-muted font-medium tracking-widest uppercase">
            Operational Sophistication &rarr;
          </div>
        </div>

        {isPersonalised && (
          <p className="text-forter-muted text-xs text-center max-w-2xl mx-auto">
            * Typical challenge rates shown are tailored to your average order value ({aovLabel}). Merchants with different AOV profiles will see different achievable rates at each level.
          </p>
        )}
      </div>
    </section>
  );
}
