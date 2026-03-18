export interface QuizOption {
  text: string;
  level: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  subtitle: string;
  options: QuizOption[];
}

export const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "How does your business currently handle Strong Customer Authentication (SCA)?",
    subtitle: "Your current approach to 3DS and authentication decisioning",
    options: [
      { text: "We apply 3DS to all transactions to stay compliant", level: 1 },
      { text: "We use some exemptions but apply them broadly across all transactions", level: 2 },
      { text: "We track which exemptions work and measure challenge vs frictionless outcomes", level: 3 },
      { text: "We tailor exemption strategies by issuer, region, and device type", level: 4 },
      { text: "We use real-time identity and behavioural signals to decide authentication dynamically per transaction", level: 5 },
    ],
  },
  {
    id: 2,
    question: "How do you measure the impact of authentication on your conversion rates?",
    subtitle: "Visibility into authentication-specific performance metrics",
    options: [
      { text: "We don't currently track authentication-specific metrics", level: 1 },
      { text: "We monitor overall 3DS pass/fail rates at an aggregate level", level: 2 },
      { text: "We track challenge rates, frictionless rates, and drop-off by authentication flow", level: 3 },
      { text: "We analyse authentication performance by issuer, BIN range, device, and geography", level: 4 },
      { text: "We correlate authentication decisions with identity confidence scores and optimise in real time", level: 5 },
    ],
  },
  {
    id: 3,
    question: "What role do SCA exemptions play in your payment strategy?",
    subtitle: "How exemptions factor into your authentication and conversion optimisation",
    options: [
      { text: "We don't actively use exemptions. Regulatory compliance is the priority", level: 1 },
      { text: "We apply TRA or low-value exemptions where possible but without granular rules", level: 2 },
      { text: "We test different exemption types and measure their impact on approval rates", level: 3 },
      { text: "We dynamically select exemptions based on issuer-specific acceptance patterns", level: 4 },
      { text: "Exemption decisions are driven by a real-time risk and identity engine that adapts per transaction", level: 5 },
    ],
  },
  {
    id: 4,
    question: "How does your team respond to changes in issuer authentication behaviour?",
    subtitle: "Your ability to detect and adapt to issuer-level performance shifts",
    options: [
      { text: "We're not aware of issuer-level differences in how authentication is handled", level: 1 },
      { text: "We know issuers behave differently but don't have processes to act on it", level: 2 },
      { text: "We review issuer-level performance periodically and adjust rules manually", level: 3 },
      { text: "We maintain issuer-specific strategies that we update regularly based on data", level: 4 },
      { text: "Our system adapts automatically to issuer behaviour shifts using machine learning and identity signals", level: 5 },
    ],
  },
  {
    id: 5,
    question: "What best describes your authentication technology stack?",
    subtitle: "The tools and platforms powering your authentication decisions",
    options: [
      { text: "We rely on our PSP's default 3DS setup with no customisation", level: 1 },
      { text: "We've configured basic exemption rules with our PSP or gateway", level: 2 },
      { text: "We use a dedicated 3DS solution with reporting and analytics dashboards", level: 3 },
      { text: "We use an optimisation layer that routes authentication based on historical issuer data", level: 4 },
      { text: "We use an identity-based platform that makes real-time authentication decisions across the full transaction lifecycle", level: 5 },
    ],
  },
];
