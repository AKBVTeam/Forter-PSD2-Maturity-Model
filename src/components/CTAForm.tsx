import { useState, useMemo } from "react";
import { ArrowRight, Lock, ChevronDown } from "lucide-react";

interface CTAFormProps {
  level: number;
  onSubmit: (data: FormData) => void;
}

export interface FormData {
  fullName: string;
  email: string;
  companyName: string;
  phone: string;
  companySize: string;
  hqCountry: string;
  annualGmv: string;
  marketingOptIn: boolean;
}

const COUNTRIES = [
  "Austria",
  "Belgium",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czech Republic (Czechia)",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Iceland",
  "Ireland",
  "Italy",
  "Latvia",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Netherlands",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
  "United Kingdom",
];

const COMPANY_SIZES = [
  "1–50 employees",
  "51–200 employees",
  "201–1,000 employees",
  "1,001–5,000 employees",
  "5,000+ employees",
];

function getCurrencySymbol(country: string): string {
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

function getGmvOptions(symbol: string): string[] {
  return [
    `${symbol} 1m – 10m`,
    `${symbol} 10m – 50m`,
    `${symbol} 50m – 100m`,
    `${symbol} 100m – 250m`,
    `${symbol} 250m – 500m`,
    `${symbol} 500m – 1bn`,
    `${symbol} 1bn – 5bn`,
    `${symbol} 5bn – 10bn`,
    `${symbol} 10bn – 20bn`,
    `${symbol} 20bn+`,
  ];
}

const inputCls =
  "w-full bg-forter-surface border border-forter-border rounded-lg px-4 py-3 text-white placeholder-forter-muted/50 focus:outline-none focus:border-forter-purple focus:ring-1 focus:ring-forter-purple transition-colors";

const selectCls =
  "w-full bg-forter-surface border border-forter-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-forter-purple focus:ring-1 focus:ring-forter-purple transition-colors appearance-none cursor-pointer";

export default function CTAForm({ level, onSubmit }: CTAFormProps) {
  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    companyName: "",
    phone: "",
    companySize: "",
    hqCountry: "",
    annualGmv: "",
    marketingOptIn: false,
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const currencySymbol = useMemo(
    () => getCurrencySymbol(form.hqCountry),
    [form.hqCountry]
  );
  const gmvOptions = useMemo(() => getGmvOptions(currencySymbol), [currencySymbol]);

  const isValid =
    form.fullName.trim() !== "" &&
    form.email.trim() !== "" &&
    form.companyName.trim() !== "" &&
    form.companySize !== "" &&
    form.hqCountry !== "" &&
    form.annualGmv !== "";

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "hqCountry") next.annualGmv = "";
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
    if (!form.hqCountry) errs.hqCountry = "HQ country is required";
    if (!form.annualGmv) errs.annualGmv = "Annual EEA GMV is required";
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
            Your Level: {level} — {levelLabels[level]}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Unlock your personalised roadmap
          </h2>
          <p className="text-forter-muted leading-relaxed">
            Get tailored recommendations on how to advance your authentication
            maturity with Forter — including benchmarks, strategies, and a clear
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
                onChange={(e) => set("fullName", e.target.value)}
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
              <label className="block text-sm font-medium text-white mb-1.5">
                Annual EEA GMV <span className="text-forter-coral">*</span>
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
            disabled={!isValid}
            className="w-full mt-8 inline-flex items-center justify-center gap-3 bg-gradient-to-r from-forter-purple to-forter-purple-light text-white font-semibold text-base px-8 py-4 rounded-xl shadow-lg shadow-forter-purple/25 hover:shadow-forter-purple/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-forter-purple/25"
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
