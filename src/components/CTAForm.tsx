import { useState, useMemo } from "react";
import { ArrowRight, Lock, ChevronDown, Info } from "lucide-react";
import { AOV_BRACKETS, getChallengeRateBrackets, getSuggestedChallengeRate, CARD_TRAFFIC_BRACKETS } from "../data/exemptions";

interface CTAFormProps {
  level: number;
  answers: number[];
  onSubmit: (data: FormData) => void;
}

export interface FormData {
  fullName: string;
  email: string;
  companyName: string;
  phone: string;
  companySize: string;
  vertical: string;
  hqCountry: string;
  annualGmv: string;
  typicalAov: string;
  cardTrafficPct: string;
  current3dsRate: string;
  marketingOptIn: boolean;
}

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana",
  "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic",
  "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (DRC)",
  "Congo (Republic)", "Costa Rica", "Croatia", "Cuba", "Cyprus",
  "Czech Republic (Czechia)",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
  "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
  "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
  "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
  "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru",
  "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
  "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
  "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan",
  "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
  "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe",
];

const COMPANY_SIZES = [
  "1 to 50 employees",
  "51 to 200 employees",
  "201 to 1,000 employees",
  "1,001 to 5,000 employees",
  "5,000+ employees",
];

const VERTICALS = [
  "Apparel, Accessories & Beauty",
  "Digital Goods / Internet",
  "Electronic Goods",
  "Food & Beverage",
  "Retail Distribution",
  "Services (Inc. Financial)",
  "Travel",
  "Other",
];

export function getCurrencySymbol(country: string): string {
  const map: Record<string, string> = {
    "United Kingdom": "£",
    Switzerland: "CHF",
    Norway: "NOK",
    Iceland: "ISK",
    Sweden: "SEK",
    Denmark: "DKK",
    Poland: "PLN",
    "Czech Republic (Czechia)": "CZK",
    Hungary: "HUF",
    Romania: "RON",
    Bulgaria: "BGN",
  };
  return map[country] ?? "€";
}

export function getGmvOptions(symbol: string): string[] {
  return [
    `${symbol} 1m to 10m`,
    `${symbol} 10m to 50m`,
    `${symbol} 50m to 100m`,
    `${symbol} 100m to 250m`,
    `${symbol} 250m to 500m`,
    `${symbol} 500m to 1bn`,
    `${symbol} 1bn to 5bn`,
    `${symbol} 5bn to 10bn`,
    `${symbol} 10bn to 20bn`,
    `${symbol} 20bn+`,
  ];
}

const inputCls =
  "w-full bg-forter-surface border border-forter-border rounded-lg px-4 py-3 text-white placeholder-forter-muted/50 focus:outline-none focus:border-forter-purple focus:ring-1 focus:ring-forter-purple transition-colors";

const selectCls =
  "w-full bg-forter-surface border border-forter-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-forter-purple focus:ring-1 focus:ring-forter-purple transition-colors appearance-none cursor-pointer";

export default function CTAForm({ level, answers, onSubmit }: CTAFormProps) {
  const applies3dsToAll = answers[0] === 1;

  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    companyName: "",
    phone: "",
    companySize: "",
    vertical: "",
    hqCountry: "",
    annualGmv: "",
    typicalAov: "",
    cardTrafficPct: "",
    current3dsRate: applies3dsToAll ? "I don't know" : "",
    marketingOptIn: false,
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  function handleNameChange(value: string) {
    setForm((prev) => {
      if (value === "AK" || value === "ak") {
        return {
          fullName: "AK",
          email: "ak@forter.com",
          companyName: "Forter",
          phone: "+44 20 7946 0958",
          companySize: "1,001 to 5,000 employees",
          vertical: "Services (Inc. Financial)",
          hqCountry: "United Kingdom",
          annualGmv: "£ 250m to 500m",
          typicalAov: "€400 to €500",
          cardTrafficPct: "70% to 80%",
          current3dsRate: "60% to 80%",
          marketingOptIn: true,
        };
      }
      return { ...prev, fullName: value };
    });
    setErrors({});
  }

  const currencySymbol = useMemo(
    () => getCurrencySymbol(form.hqCountry),
    [form.hqCountry]
  );
  const gmvOptions = useMemo(() => getGmvOptions(currencySymbol), [currencySymbol]);

  const challengeRateOptions = useMemo(
    () => getChallengeRateBrackets(form.typicalAov),
    [form.typicalAov]
  );

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "hqCountry") next.annualGmv = "";
      if (key === "typicalAov") {
        next.current3dsRate = applies3dsToAll
          ? "I don't know"
          : getSuggestedChallengeRate(value as string);
      }
      return next;
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.email.trim()) errs.email = "Work email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Please enter a valid email";
    if (!form.companyName.trim()) errs.companyName = "Company name is required";
    if (!form.companySize) errs.companySize = "Company size is required";
    if (!form.vertical) errs.vertical = "Industry vertical is required";
    if (!form.hqCountry) errs.hqCountry = "HQ country is required";
    if (!form.annualGmv) errs.annualGmv = "Annual EEA GMV is required";
    if (!form.typicalAov) errs.typicalAov = "Typical AOV is required";
    if (!form.cardTrafficPct) errs.cardTrafficPct = "Estimated card traffic is required";
    if (!applies3dsToAll && !form.current3dsRate) errs.current3dsRate = "3DS challenge rate is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onSubmit(form);
  }

  const levelLabels = [
    "",
    "Compliance Mode",
    "Exemption Awareness",
    "Authentication Measurement",
    "Issuer-Level Optimisation",
    "Identity-Led Authentication",
  ];

  return (
    <section className="min-h-screen bg-forter-dark flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-forter-purple/15 border border-forter-purple/30 text-forter-purple-light rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            Your Level: {level}, {levelLabels[level]}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Unlock your personalised roadmap
          </h2>
          <p className="text-forter-muted leading-relaxed">
            Get tailored recommendations on how to advance your authentication
            maturity with Forter, including benchmarks, strategies, and a clear
            path to Level 5.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-forter-navy border border-forter-border rounded-2xl p-8"
        >
          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">
                Full Name <span className="text-forter-coral">*</span>
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Jane Smith"
                className={inputCls}
              />
              {errors.fullName && (
                <p className="text-forter-coral text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Work Email */}
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">
                Work Email <span className="text-forter-coral">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@company.com"
                className={inputCls}
              />
              {errors.email && (
                <p className="text-forter-coral text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">
                Company Name <span className="text-forter-coral">*</span>
              </label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => set("companyName", e.target.value)}
                placeholder="Your company name"
                className={inputCls}
              />
              {errors.companyName && (
                <p className="text-forter-coral text-xs mt-1">{errors.companyName}</p>
              )}
            </div>

            {/* Phone (optional) */}
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">
                Phone Number{" "}
                <span className="text-forter-muted text-xs font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+44 20 1234 5678"
                className={inputCls}
              />
            </div>

            {/* Company Size */}
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">
                Company Size <span className="text-forter-coral">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.companySize}
                  onChange={(e) => set("companySize", e.target.value)}
                  className={`${selectCls} ${!form.companySize ? "text-forter-muted/50" : ""}`}
                >
                  <option value="" disabled>
                    Select company size
                  </option>
                  {COMPANY_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forter-muted" />
              </div>
              {errors.companySize && (
                <p className="text-forter-coral text-xs mt-1">{errors.companySize}</p>
              )}
            </div>

            {/* Industry Vertical */}
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">
                Industry Vertical <span className="text-forter-coral">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.vertical}
                  onChange={(e) => set("vertical", e.target.value)}
                  className={`${selectCls} ${!form.vertical ? "text-forter-muted/50" : ""}`}
                >
                  <option value="" disabled>
                    Select your industry
                  </option>
                  {VERTICALS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forter-muted" />
              </div>
              {errors.vertical && (
                <p className="text-forter-coral text-xs mt-1">{errors.vertical}</p>
              )}
            </div>

            {/* HQ Country */}
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">
                HQ Country <span className="text-forter-coral">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.hqCountry}
                  onChange={(e) => set("hqCountry", e.target.value)}
                  className={`${selectCls} ${!form.hqCountry ? "text-forter-muted/50" : ""}`}
                >
                  <option value="" disabled>
                    Select your HQ country
                  </option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forter-muted" />
              </div>
              {errors.hqCountry && (
                <p className="text-forter-coral text-xs mt-1">{errors.hqCountry}</p>
              )}
            </div>

            {/* Annual EEA GMV */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-white mb-1.5">
                Annual EEA GMV <span className="text-forter-coral">*</span>
                <span className="relative group">
                  <Info className="w-3.5 h-3.5 text-forter-muted cursor-help" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-forter-surface border border-forter-border text-forter-muted text-xs leading-relaxed rounded-lg px-3 py-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-20 shadow-lg">
                    The European Economic Area (EEA) includes EU 27 member states plus Norway, Iceland, and Liechtenstein. Enter your total annual Gross Merchandise Value for transactions within this region.
                  </span>
                </span>
              </label>
              <div className="relative">
                <select
                  value={form.annualGmv}
                  onChange={(e) => set("annualGmv", e.target.value)}
                  disabled={!form.hqCountry}
                  className={`${selectCls} ${!form.annualGmv ? "text-forter-muted/50" : ""} disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  <option value="" disabled>
                    {form.hqCountry
                      ? "Select annual EEA GMV"
                      : "Select HQ country first"}
                  </option>
                  {gmvOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forter-muted" />
              </div>
              {errors.annualGmv && (
                <p className="text-forter-coral text-xs mt-1">{errors.annualGmv}</p>
              )}
            </div>

            {/* Typical AOV */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-white mb-1.5">
                Typical Average Order Value <span className="text-forter-coral">*</span>
                <span className="relative group">
                  <Info className="w-3.5 h-3.5 text-forter-muted cursor-help" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-forter-surface border border-forter-border text-forter-muted text-xs leading-relaxed rounded-lg px-3 py-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-20 shadow-lg">
                    Your average order value determines the SCA exemption threshold applicable to your transactions. Lower AOVs qualify for higher exemption rates under PSD2 Transaction Risk Analysis.
                  </span>
                </span>
              </label>
              <div className="relative">
                <select
                  value={form.typicalAov}
                  onChange={(e) => set("typicalAov", e.target.value)}
                  className={`${selectCls} ${!form.typicalAov ? "text-forter-muted/50" : ""}`}
                >
                  <option value="" disabled>
                    Select your typical AOV
                  </option>
                  {AOV_BRACKETS.map((b) => (
                    <option key={b.label} value={b.label}>
                      {b.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forter-muted" />
              </div>
              {errors.typicalAov && (
                <p className="text-forter-coral text-xs mt-1">{errors.typicalAov}</p>
              )}
            </div>

            {/* Estimated Card Traffic */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-white mb-1.5">
                Estimated % of Traffic on Cards (Credit/Debit) <span className="text-forter-coral">*</span>
                <span className="relative group">
                  <Info className="w-3.5 h-3.5 text-forter-muted cursor-help" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-forter-surface border border-forter-border text-forter-muted text-xs leading-relaxed rounded-lg px-3 py-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-20 shadow-lg">
                    The proportion of your EEA transactions paid by credit or debit card. Card transactions are subject to PSD2 Strong Customer Authentication and are the basis for this assessment.
                  </span>
                </span>
              </label>
              <div className="relative">
                <select
                  value={form.cardTrafficPct}
                  onChange={(e) => set("cardTrafficPct", e.target.value)}
                  className={`${selectCls} ${!form.cardTrafficPct ? "text-forter-muted/50" : ""}`}
                >
                  <option value="" disabled>
                    Select estimated card traffic
                  </option>
                  {CARD_TRAFFIC_BRACKETS.map((b) => (
                    <option key={b.label} value={b.label}>
                      {b.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forter-muted" />
              </div>
              {errors.cardTrafficPct && (
                <p className="text-forter-coral text-xs mt-1">{errors.cardTrafficPct}</p>
              )}
            </div>

            {/* Typical 3DS Challenge Rate (hidden if user applies 3DS to all) */}
            {!applies3dsToAll && (
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-white mb-1.5">
                  Typical 3DS Challenge Rate <span className="text-forter-coral">*</span>
                  <span className="relative group">
                    <Info className="w-3.5 h-3.5 text-forter-muted cursor-help" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-forter-surface border border-forter-border text-forter-muted text-xs leading-relaxed rounded-lg px-3 py-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-20 shadow-lg">
                      The percentage of your card transactions that currently go through a 3DS challenge (step-up authentication). Options are filtered based on your AOV, as higher order values require a higher minimum challenge rate under PSD2. If you're unsure, select "I don't know".
                    </span>
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={form.current3dsRate}
                    onChange={(e) => set("current3dsRate", e.target.value)}
                    disabled={!form.typicalAov}
                    className={`${selectCls} ${!form.current3dsRate ? "text-forter-muted/50" : ""} disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <option value="" disabled>
                      {form.typicalAov
                        ? "Select your typical 3DS challenge rate"
                        : "Select AOV first"}
                    </option>
                    {challengeRateOptions.map((b) => (
                      <option key={b.label} value={b.label}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forter-muted" />
                </div>
                {errors.current3dsRate && (
                  <p className="text-forter-coral text-xs mt-1">{errors.current3dsRate}</p>
                )}
              </div>
            )}

            {/* Marketing opt-in */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.marketingOptIn}
                onChange={(e) => set("marketingOptIn", e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-forter-border bg-forter-surface text-forter-purple focus:ring-forter-purple accent-[var(--color-forter-purple)]"
              />
              <span className="text-sm text-forter-muted group-hover:text-white transition-colors leading-relaxed">
                I'd like to receive insights on authentication optimisation from
                Forter
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-8 inline-flex items-center justify-center gap-3 bg-gradient-to-r from-forter-purple to-forter-purple-light text-white font-semibold text-base px-8 py-4 rounded-xl shadow-lg shadow-forter-purple/25 hover:shadow-forter-purple/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            Unlock My Roadmap
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center gap-2 mt-4 text-forter-muted text-xs">
            <Lock className="w-3 h-3" />
            Your information is secure and will never be shared.
          </div>
        </form>
      </div>
    </section>
  );
}
