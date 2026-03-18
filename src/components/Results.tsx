import { useState, useMemo } from "react";
import {
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Target,
  Zap,
  Layers,
  ExternalLink,
  DollarSign,
  MessageCircle,
} from "lucide-react";
import { maturityLevels } from "../data/levels";
import { calculateRevenueDirect, getInitialValues } from "../data/exemptions";
import type { FormData } from "./CTAForm";
import MaturityModel from "./MaturityModel";

interface ResultsProps {
  answers: number[];
  formData: FormData | null;
  onRequestAudit: () => void;
}

function formatCurrency(value: number, symbol: string): string {
  if (value >= 1_000_000_000) return `${symbol}${(value / 1_000_000_000).toFixed(1)}bn`;
  if (value >= 1_000_000) return `${symbol}${(value / 1_000_000).toFixed(1)}m`;
  if (value >= 1_000) return `${symbol}${(value / 1_000).toFixed(0)}k`;
  return `${symbol}${value.toFixed(0)}`;
}

function formatGmvInput(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}`;
  return `${value}`;
}

function gmvSuffix(value: number): string {
  if (value >= 1_000_000_000) return "bn";
  if (value >= 1_000_000) return "m";
  return "";
}

function parseGmvInput(text: string, currentRaw: number): number {
  const cleaned = text.replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  if (isNaN(num) || num <= 0) return currentRaw;
  if (currentRaw >= 1_000_000_000) return num * 1_000_000_000;
  if (currentRaw >= 1_000_000) return num * 1_000_000;
  return num;
}

const inlineInputCls =
  "bg-forter-surface border border-forter-border rounded-md px-2 py-1 text-white text-sm font-medium text-right focus:outline-none focus:border-forter-purple focus:ring-1 focus:ring-forter-purple transition-colors w-20";

export default function Results({ answers, formData, onRequestAudit }: ResultsProps) {
  const avgScore = answers.reduce((a, b) => a + b, 0) / answers.length;
  const currentLevel = Math.max(1, Math.min(5, Math.round(avgScore)));
  const level = maturityLevels[currentLevel - 1];
  const nextLevel =
    currentLevel < 5 ? maturityLevels[currentLevel] : undefined;

  const initVals = useMemo(() => {
    if (!formData) return null;
    return getInitialValues(formData.annualGmv, formData.typicalAov, formData.current3dsRate, formData.cardTrafficPct);
  }, [formData]);

  const [gmvRaw, setGmvRaw] = useState(initVals?.gmv ?? 0);
  const [cardTrafficPct, setCardTrafficPct] = useState(initVals?.cardTraffic ?? 70);
  const [challengeRatePct, setChallengeRatePct] = useState(initVals?.challengeRate ?? 70);
  const exemptionRate = initVals?.exemptionRate ?? 0;
  const currency = initVals?.currency ?? "€";

  const [gmvText, setGmvText] = useState(formatGmvInput(gmvRaw));
  const [cardText, setCardText] = useState(String(cardTrafficPct));
  const [crText, setCrText] = useState(String(challengeRatePct));

  const estimate = useMemo(() => {
    if (gmvRaw <= 0) return null;
    return calculateRevenueDirect(
      gmvRaw,
      exemptionRate,
      Math.min(Math.max(challengeRatePct / 100, 0), 1),
      Math.min(Math.max(cardTrafficPct / 100, 0), 1),
      currency,
    );
  }, [gmvRaw, exemptionRate, challengeRatePct, cardTrafficPct, currency]);

  const scorePercent = (avgScore / 5) * 100;

  return (
    <div className="bg-forter-dark min-h-screen">
      {/* Results header */}
      <section id="insights" className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-8"
            style={{
              backgroundColor: `${level.color}15`,
              borderColor: `${level.color}40`,
              color: level.color,
              borderWidth: 1,
            }}
          >
            Level {currentLevel}: {level.name}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Your Authentication Maturity Score
          </h1>

          {/* Score gauge */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="var(--color-forter-surface)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={level.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${scorePercent * 2.64} 264`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-white">
                {avgScore.toFixed(1)}
              </span>
              <span className="text-sm text-forter-muted">out of 5.0</span>
            </div>
          </div>

          <p className="text-lg text-forter-muted max-w-2xl mx-auto leading-relaxed">
            {level.description}
          </p>
        </div>

        {/* Key insights cards */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-forter-navy border border-forter-border rounded-xl p-6">
            <div className="w-10 h-10 rounded-lg bg-forter-coral/15 flex items-center justify-center mb-4">
              <AlertTriangle className="w-5 h-5 text-forter-coral" />
            </div>
            <h3 className="text-white font-semibold mb-2">Revenue at Risk</h3>
            <p className="text-forter-muted text-sm leading-relaxed">
              {level.revenueImpact}
            </p>
          </div>

          <div className="bg-forter-navy border border-forter-border rounded-xl p-6">
            <div className="w-10 h-10 rounded-lg bg-forter-teal/15 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5 text-forter-teal" />
            </div>
            <h3 className="text-white font-semibold mb-2">
              Current Characteristics
            </h3>
            <ul className="space-y-2">
              {level.characteristics.map((c, i) => (
                <li
                  key={i}
                  className="text-forter-muted text-sm flex items-start gap-2"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: level.color }}
                  />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-forter-navy border border-forter-border rounded-xl p-6">
            <div className="w-10 h-10 rounded-lg bg-forter-purple/15 flex items-center justify-center mb-4">
              <Target className="w-5 h-5 text-forter-purple-light" />
            </div>
            <h3 className="text-white font-semibold mb-2">Key Metrics</h3>
            <div className="space-y-3">
              {level.stats.map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-forter-muted text-sm">{stat.label}</span>
                  <span
                    className="font-bold text-sm"
                    style={{ color: level.color }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GMV Recovery Estimate */}
      {estimate && estimate.recoveredHigh > 0 && (
        <section className="py-16 px-4 border-t border-forter-border">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Your Estimated GMV Recovery
              </h2>
              <p className="text-forter-muted text-lg max-w-2xl mx-auto">
                Based on your PSD2-relevant card GMV, average order value, and typical
                3DS challenge rate, here's what Forter's exemption optimisation could unlock.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-forter-navy border border-forter-border rounded-xl p-6 text-center">
                <div className="w-10 h-10 rounded-lg bg-forter-coral/15 flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-5 h-5 text-forter-coral" />
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-forter-coral mb-1">
                  {formatCurrency(estimate.currentLostLow, estimate.currency)} &ndash; {formatCurrency(estimate.currentLostHigh, estimate.currency)}
                </div>
                <p className="text-forter-muted text-sm">
                  GMV currently lost to 3DS abandonment per year
                </p>
              </div>

              <div className="bg-gradient-to-b from-forter-purple/15 to-forter-navy border border-forter-purple/30 rounded-xl p-6 text-center shadow-lg shadow-forter-purple/10">
                <div className="w-10 h-10 rounded-lg bg-forter-purple/15 flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-5 h-5 text-forter-purple-light" />
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-forter-teal mb-1">
                  {formatCurrency(estimate.recoveredLow, estimate.currency)} &ndash; {formatCurrency(estimate.recoveredHigh, estimate.currency)}
                </div>
                <p className="text-forter-muted text-sm">
                  Estimated annual GMV recoverable with Forter
                </p>
              </div>

              <div className="bg-forter-navy border border-forter-border rounded-xl p-6 text-center">
                <div className="w-10 h-10 rounded-lg bg-forter-teal/15 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-5 h-5 text-forter-teal" />
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-white mb-1">
                  {(estimate.forterExemptionRate * 100).toFixed(0)}%
                </div>
                <p className="text-forter-muted text-sm">
                  Exemption rate achievable at your AOV
                </p>
              </div>
            </div>

            {/* Calculation breakdown */}
            <div className="bg-forter-navy border border-forter-border rounded-xl p-6 max-w-2xl mx-auto">
              <h4 className="text-white font-semibold text-sm mb-4">How we calculated this</h4>
              <p className="text-forter-muted text-xs mb-5">Adjust the highlighted values to match your exact numbers and see the estimate update in real time.</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-forter-muted">Your annual EEA GMV</span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-forter-muted text-xs">{currency}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={gmvText}
                      onChange={(e) => setGmvText(e.target.value)}
                      onBlur={() => {
                        const parsed = parseGmvInput(gmvText, gmvRaw);
                        setGmvRaw(parsed);
                        setGmvText(formatGmvInput(parsed));
                      }}
                      className={inlineInputCls}
                    />
                    <span className="text-forter-muted text-xs w-4">{gmvSuffix(gmvRaw)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-forter-muted">Estimated card traffic</span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardText}
                      onChange={(e) => setCardText(e.target.value)}
                      onBlur={() => {
                        const v = Math.min(Math.max(parseInt(cardText) || 0, 1), 100);
                        setCardTrafficPct(v);
                        setCardText(String(v));
                      }}
                      className={`${inlineInputCls} w-14`}
                    />
                    <span className="text-forter-muted text-xs">%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-forter-muted">PSD2-relevant card GMV</span>
                  <span className="text-white font-medium">{formatCurrency(estimate.psd2Gmv, estimate.currency)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-forter-muted">Typical 3DS challenge rate</span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={crText}
                      onChange={(e) => setCrText(e.target.value)}
                      onBlur={() => {
                        const v = Math.min(Math.max(parseInt(crText) || 0, 1), 100);
                        setChallengeRatePct(v);
                        setCrText(String(v));
                      }}
                      className={`${inlineInputCls} w-14`}
                    />
                    <span className="text-forter-muted text-xs">%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-forter-muted">Estimated abandonment/failure rate</span>
                  <span className="text-white font-medium">15% &ndash; 25%</span>
                </div>
                <div className="h-px bg-forter-border my-1" />
                <div className="flex items-center justify-between">
                  <span className="text-forter-muted">GMV currently lost to 3DS friction</span>
                  <span className="text-forter-coral font-medium">{formatCurrency(estimate.currentLostLow, estimate.currency)} &ndash; {formatCurrency(estimate.currentLostHigh, estimate.currency)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-forter-muted">Forter exemption rate (based on AOV)</span>
                  <span className="text-forter-teal font-medium">{(estimate.forterExemptionRate * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-forter-muted">Remaining GMV at risk after Forter</span>
                  <span className="text-white font-medium">{formatCurrency(estimate.forterRemainingLow, estimate.currency)} &ndash; {formatCurrency(estimate.forterRemainingHigh, estimate.currency)}</span>
                </div>
                <div className="h-px bg-forter-border my-1" />
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">GMV recovered annually with Forter</span>
                  <span className="text-forter-teal font-bold text-base">{formatCurrency(estimate.recoveredLow, estimate.currency)} &ndash; {formatCurrency(estimate.recoveredHigh, estimate.currency)}</span>
                </div>
              </div>
              <p className="text-forter-muted text-xs mt-4 leading-relaxed">
                This is an indicative estimate based on industry benchmarks. Actual results
                depend on your transaction mix, issuer behaviour, and authentication flows.
              </p>
            </div>

            {/* Comprehensive assessment CTA */}
            <div className="bg-gradient-to-r from-forter-purple/15 to-forter-navy border border-forter-purple/30 rounded-xl p-6 max-w-2xl mx-auto mt-6 text-center">
              <MessageCircle className="w-8 h-8 text-forter-purple-light mx-auto mb-3" />
              <h4 className="text-white font-semibold text-lg mb-2">
                Want a more precise assessment?
              </h4>
              <p className="text-forter-muted text-sm leading-relaxed mb-5 max-w-md mx-auto">
                These estimates are based on industry averages. Speak to our payment
                optimisation team for a comprehensive, data-driven value assessment
                tailored to your specific transaction profile.
              </p>
              <a
                href="https://www.forter.com/sales/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-forter-purple to-forter-purple-light text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-forter-purple/25 hover:shadow-forter-purple/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Speak to Forter
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Maturity Model visual */}
      <MaturityModel currentLevel={currentLevel} aovLabel={formData?.typicalAov ?? ""} />

      {/* Next steps / Improvement path */}
      {nextLevel && (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Your Path to Level {nextLevel.level}:{" "}
                <span style={{ color: nextLevel.color }}>
                  {nextLevel.name}
                </span>
              </h2>
              <p className="text-forter-muted text-lg">
                Here's what it takes to advance your authentication maturity
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {level.improvements.map((improvement, i) => (
                <div
                  key={i}
                  className="bg-forter-navy border border-forter-border rounded-xl p-6 flex items-start gap-4 hover:border-forter-purple/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-forter-purple/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lightbulb className="w-4 h-4 text-forter-purple-light" />
                  </div>
                  <p className="text-white text-sm leading-relaxed">
                    {improvement}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Forter section */}
      <section className="py-20 px-4 border-t border-forter-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Leading Merchants Choose Forter
            </h2>
            <p className="text-forter-muted text-lg max-w-2xl mx-auto">
              Forter's identity-led approach sits at the intersection of fraud
              prevention, authentication, and payment authorisation, the exact
              gap where revenue leakage happens.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-gradient-to-b from-forter-surface/60 to-forter-surface/20 border border-forter-border rounded-xl p-6 text-center">
              <div className="text-3xl font-extrabold text-white mb-2">83%</div>
              <p className="text-forter-muted text-sm">
                Reduction in transactions sent to 3DS challenge
              </p>
            </div>
            <div className="bg-gradient-to-b from-forter-surface/60 to-forter-surface/20 border border-forter-border rounded-xl p-6 text-center">
              <div className="text-3xl font-extrabold text-white mb-2">
                4.5%
              </div>
              <p className="text-forter-muted text-sm">
                Average increase in approval rates
              </p>
            </div>
            <div className="bg-gradient-to-b from-forter-surface/60 to-forter-surface/20 border border-forter-border rounded-xl p-6 text-center">
              <div className="text-3xl font-extrabold text-white mb-2">90%</div>
              <p className="text-forter-muted text-sm">
                Reduction in chargeback rates
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-forter-navy border border-forter-border rounded-xl p-8">
              <Zap className="w-6 h-6 text-forter-purple-light mb-4" />
              <h3 className="text-white font-bold text-lg mb-3">
                Identity-Led Optimisation
              </h3>
              <p className="text-forter-muted text-sm leading-relaxed mb-4">
                Unlike static fraud rules that trigger more challenges, Forter
                uses behavioural identity signals to determine when
                authentication is truly needed. Known, trusted customers skip
                unnecessary friction, driving higher conversion without
                increasing risk.
              </p>
              <p className="text-forter-muted text-sm leading-relaxed">
                This is what separates Level 5 merchants from the rest: the
                decision to challenge is based on how well you know the customer,
                not just the risk profile of a single transaction.
              </p>
            </div>

            <div className="bg-forter-navy border border-forter-border rounded-xl p-8">
              <Layers className="w-6 h-6 text-forter-teal mb-4" />
              <h3 className="text-white font-bold text-lg mb-3">
                Regulatory Optimisation (PSD2 & Beyond)
              </h3>
              <p className="text-forter-muted text-sm leading-relaxed mb-4">
                Forter's platform dynamically selects the optimal exemption
                strategy per transaction (TRA, low-value, trusted beneficiary)
                based on real-time issuer acceptance data and customer identity
                intelligence.
              </p>
              <p className="text-forter-muted text-sm leading-relaxed">
                With PSD3 expected by 2026 to 2027, merchants who build
                authentication optimisation as a core competency today will be
                best positioned for what's next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* All levels detailed */}
      <section className="py-20 px-4 border-t border-forter-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            The 5 Levels of Authentication Maturity
          </h2>

          <div className="space-y-6">
            {maturityLevels.map((l) => (
              <details
                key={l.level}
                className="group bg-forter-navy border border-forter-border rounded-xl overflow-hidden"
                open={l.level === currentLevel}
              >
                <summary className="flex items-center gap-4 px-6 py-5 cursor-pointer hover:bg-forter-surface/30 transition-colors list-none">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: l.color }}
                  >
                    {l.level}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{l.name}</h3>
                    <p className="text-forter-muted text-sm">{l.tagline}</p>
                  </div>
                  {l.level === currentLevel && (
                    <span className="text-xs font-bold text-forter-purple bg-forter-purple/15 px-3 py-1 rounded-full">
                      YOUR LEVEL
                    </span>
                  )}
                  <ArrowRight className="w-5 h-5 text-forter-muted group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-6 border-t border-forter-border pt-5">
                  <p className="text-forter-muted text-sm leading-relaxed mb-4">
                    {l.description}
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white text-sm font-semibold mb-3">
                        Characteristics
                      </h4>
                      <ul className="space-y-2">
                        {l.characteristics.map((c, i) => (
                          <li
                            key={i}
                            className="text-forter-muted text-sm flex items-start gap-2"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                              style={{ backgroundColor: l.color }}
                            />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-semibold mb-3">
                        {l.level < 5
                          ? "How to Advance"
                          : "Continue Leading"}
                      </h4>
                      <ul className="space-y-2">
                        {l.improvements.map((imp, i) => (
                          <li
                            key={i}
                            className="text-forter-muted text-sm flex items-start gap-2"
                          >
                            <Lightbulb
                              className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                              style={{ color: l.color }}
                            />
                            {imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-forter-purple/20 to-forter-surface border border-forter-purple/30 rounded-2xl p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to reclaim your hidden revenue?
            </h2>
            <p className="text-forter-muted text-lg mb-8 max-w-xl mx-auto">
              Request a complimentary Payment Friction Audit and benchmark your
              authentication performance against industry leaders.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onRequestAudit}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-forter-purple to-forter-purple-light text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-forter-purple/25 hover:shadow-forter-purple/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Request a Payment Friction Audit
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="https://www.forter.com/platform/payment-optimization/psd2/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-forter-purple-light hover:text-white transition-colors text-sm font-medium"
              >
                Learn about Forter PSD2
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-forter-border py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-forter-muted text-sm">
          <p>
            Data sourced from ECB, EBA, Stripe, MRC, and industry
            research reports.
          </p>
          <p>&copy; {new Date().getFullYear()} Forter, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
