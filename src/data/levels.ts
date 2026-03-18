export interface MaturityLevel {
  level: number;
  name: string;
  tagline: string;
  description: string;
  characteristics: string[];
  revenueImpact: string;
  color: string;
  improvements: string[];
  stats: { label: string; value: string }[];
}

export const maturityLevels: MaturityLevel[] = [
  {
    level: 1,
    name: "Compliance Mode",
    tagline: "3DS applied broadly to satisfy PSD2 requirements",
    description:
      "Your authentication strategy is compliance-driven. 3DS is applied broadly across transactions, and your PSP handles most authentication decisions. While you're meeting regulatory requirements, unnecessary challenges are creating friction that silently erodes conversion.",
    characteristics: [
      "3DS applied to all or most transactions by default",
      "Reliance on PSP default settings for authentication",
      "Limited visibility into authentication-specific drop-off",
      "No active exemption management strategy",
    ],
    revenueImpact:
      "Merchants at this level typically lose 2–3.5% of conversion to unnecessary authentication friction. With 40%+ 3DS abandonment rates in some markets, the hidden revenue leakage can be substantial.",
    color: "var(--color-level-1)",
    improvements: [
      "Implement Transaction Risk Analysis (TRA) exemptions for low-risk transactions",
      "Separate authentication abandonment from general checkout abandonment in reporting",
      "Benchmark your challenge rate against industry averages (global average: 36%)",
      "Identify your top 5 issuers by volume and track their authentication success rates",
    ],
    stats: [
      { label: "Typical challenge rate", value: "80%+" },
      { label: "Revenue at risk", value: "2–3.5%" },
      { label: "Authentication visibility", value: "Minimal" },
    ],
  },
  {
    level: 2,
    name: "Exemption Awareness",
    tagline: "SCA exemptions used to reduce unnecessary authentication",
    description:
      "You've started using SCA exemptions like TRA and low-value to bypass unnecessary challenges. However, your strategy isn't yet data-driven — exemptions are applied broadly rather than optimised per transaction, issuer, or market.",
    characteristics: [
      "Basic SCA exemptions (TRA, low-value) are in place",
      "Some awareness of authentication impact on conversion",
      "Exemption strategy not yet tailored to issuer behaviour",
      "Challenge rates reduced but not systematically optimised",
    ],
    revenueImpact:
      "You're likely recovering some of the conversion tax, but without issuer-level optimisation, exemption rejection rates may still be high — some issuers reject 30%+ of exemption requests.",
    color: "var(--color-level-2)",
    improvements: [
      "Track exemption acceptance rates by issuer and market",
      "Implement trusted beneficiary exemptions for repeat customers",
      "Begin segmenting authentication KPIs: success rate, challenge rate, abandonment",
      "Monitor mobile vs. desktop authentication performance separately",
    ],
    stats: [
      { label: "Typical challenge rate", value: "40–60%"},
      { label: "Exemption adoption", value: "Basic" },
      { label: "Issuer-level visibility", value: "Limited" },
    ],
  },
  {
    level: 3,
    name: "Authentication Measurement",
    tagline: "Merchants track authentication KPIs and challenge outcomes",
    description:
      "You're measuring authentication as a distinct performance discipline. Key metrics like challenge rate, authentication success, and abandonment are tracked separately. You have the data foundation — now you need to act on it at the issuer and market level.",
    characteristics: [
      "Authentication KPIs tracked separately from general conversion",
      "Challenge rates, success rates, and abandonment measured",
      "Data used to inform exemption strategy adjustments",
      "Beginning to identify issuer-level performance variation",
    ],
    revenueImpact:
      "With proper measurement in place, you can now quantify the conversion tax. Most merchants at this level discover 1–2% additional conversion recovery opportunity through issuer and device-level optimisation.",
    color: "var(--color-level-3)",
    improvements: [
      "Build issuer-level authentication scorecards for top 20 issuers",
      "Create device-specific authentication strategies (mobile SDK vs. browser redirect)",
      "Establish SLAs for authentication performance by market",
      "Implement anomaly detection for sudden issuer behaviour changes",
    ],
    stats: [
      { label: "Typical challenge rate", value: "25–40%" },
      { label: "KPI tracking", value: "Comprehensive" },
      { label: "Optimisation", value: "Reactive" },
    ],
  },
  {
    level: 4,
    name: "Issuer-Level Optimisation",
    tagline: "Authentication outcomes analysed by issuer, device, and geography",
    description:
      "You're actively optimising authentication flows based on issuer behaviour, device type, and geographic patterns. Exemptions are dynamically adjusted based on acceptance rates, and you have strong visibility across the authentication journey.",
    characteristics: [
      "Issuer-level authentication performance actively monitored",
      "Exemption strategies tailored per issuer and market",
      "Device-specific authentication flows (mobile-optimised)",
      "Real-time monitoring and anomaly detection in place",
    ],
    revenueImpact:
      "Merchants at this level typically operate at 85%+ authentication success rates (vs. 79% global average) and recover significant revenue through precision exemption management.",
    color: "var(--color-level-4)",
    improvements: [
      "Integrate customer identity signals into authentication decisions",
      "Move from rule-based to AI-driven exemption selection",
      "Build predictive models for issuer authentication behaviour",
      "Implement identity-led frictionless authentication for known customers",
    ],
    stats: [
      { label: "Typical challenge rate", value: "15–25%" },
      { label: "Auth success rate", value: "85%+" },
      { label: "Optimisation", value: "Proactive" },
    ],
  },
  {
    level: 5,
    name: "Identity-Led Authentication",
    tagline: "Behavioural identity signals determine when authentication is required",
    description:
      "You've achieved the pinnacle of authentication optimisation. The decision to challenge is based on how well the customer is known — through behavioural signals, transaction history, and identity intelligence — not just the risk profile of an individual transaction. Authentication is invisible to trusted customers.",
    characteristics: [
      "Identity intelligence drives authentication decisions",
      "Behavioural signals determine challenge necessity in real-time",
      "Near-frictionless experience for known, trusted customers",
      "Continuous optimisation across all issuers, devices, and markets",
    ],
    revenueImpact:
      "Leaders at Level 5 achieve 90%+ authentication success rates with minimal customer friction. The conversion tax is virtually eliminated — recovering the full revenue potential that compliance-only approaches leave behind.",
    color: "var(--color-level-5)",
    improvements: [
      "You're leading the market. Continue to refine identity models with new data signals.",
      "Stay ahead of PSD3 requirements and emerging authentication standards.",
      "Share best practices across your organisation to maintain competitive advantage.",
      "Explore agentic commerce authentication as the next frontier.",
    ],
    stats: [
      { label: "Typical challenge rate", value: "<15%" },
      { label: "Auth success rate", value: "90%+" },
      { label: "Optimisation", value: "AI-driven" },
    ],
  },
];

export const industryStats = [
  { value: "79%", label: "Global 3DS success rate", source: "Ravelin 2025" },
  { value: "€57B", label: "Estimated year-one SCA abandonment losses", source: "Edgar Dunn / Ravelin" },
  { value: "1 in 4", label: "Good customers drop off after a 3DS challenge", source: "Industry data" },
  { value: "13×", label: "More revenue lost to false declines than actual fraud", source: "Opensend Research" },
  { value: "64%", label: "Global frictionless authentication rate", source: "Ravelin 2025" },
  { value: "8.3%", label: "Average revenue boost from 3DS optimisation", source: "Signifyd" },
];
