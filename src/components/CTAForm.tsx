import { useState } from "react";
import { ArrowRight, Lock } from "lucide-react";

interface CTAFormProps {
  level: number;
  onSubmit: (data: FormData) => void;
}

export interface FormData {
  businessName: string;
  email: string;
  phone: string;
  marketingOptIn: boolean;
}

export default function CTAForm({ level, onSubmit }: CTAFormProps) {
  const [form, setForm] = useState<FormData>({
    businessName: "",
    email: "",
    phone: "",
    marketingOptIn: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  function validate(): boolean {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.businessName.trim()) errs.businessName = "Business name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Please enter a valid email";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
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
            Unlock your personalised insights
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
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">
                Business Name
              </label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) =>
                  setForm({ ...form, businessName: e.target.value })
                }
                placeholder="Your company name"
                className="w-full bg-forter-surface border border-forter-border rounded-lg px-4 py-3 text-white placeholder-forter-muted/50 focus:outline-none focus:border-forter-purple focus:ring-1 focus:ring-forter-purple transition-colors"
              />
              {errors.businessName && (
                <p className="text-forter-coral text-xs mt-1">
                  {errors.businessName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1.5">
                Work Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                className="w-full bg-forter-surface border border-forter-border rounded-lg px-4 py-3 text-white placeholder-forter-muted/50 focus:outline-none focus:border-forter-purple focus:ring-1 focus:ring-forter-purple transition-colors"
              />
              {errors.email && (
                <p className="text-forter-coral text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+44 20 1234 5678"
                className="w-full bg-forter-surface border border-forter-border rounded-lg px-4 py-3 text-white placeholder-forter-muted/50 focus:outline-none focus:border-forter-purple focus:ring-1 focus:ring-forter-purple transition-colors"
              />
              {errors.phone && (
                <p className="text-forter-coral text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.marketingOptIn}
                onChange={(e) =>
                  setForm({ ...form, marketingOptIn: e.target.checked })
                }
                className="mt-1 w-4 h-4 rounded border-forter-border bg-forter-surface text-forter-purple focus:ring-forter-purple accent-[var(--color-forter-purple)]"
              />
              <span className="text-sm text-forter-muted group-hover:text-white transition-colors leading-relaxed">
                I'd like to receive insights, benchmarks, and best practices on
                authentication optimisation from Forter. You can unsubscribe at
                any time.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-8 inline-flex items-center justify-center gap-3 bg-gradient-to-r from-forter-purple to-forter-purple-light text-white font-semibold text-base px-8 py-4 rounded-xl shadow-lg shadow-forter-purple/25 hover:shadow-forter-purple/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            Get My Personalised Report
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
