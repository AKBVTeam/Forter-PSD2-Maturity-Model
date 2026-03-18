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
    question: "How does your organisation handle 3DS authentication today?",
    subtitle: "Your current approach to Strong Customer Authentication",
    options: [
      { text: "We apply 3DS broadly to all transactions to satisfy PSD2 requirements", level: 1 },
      { text: "We use some SCA exemptions to skip authentication where possible", level: 2 },
      { text: "We actively track authentication KPIs and fine-tune challenge rates", level: 3 },
      { text: "We analyse authentication performance by issuer, device, and geography", level: 4 },
      { text: "We use behavioural identity signals to dynamically determine when authentication is needed", level: 5 },
    ],
  },
  {
    id: 2,
    question: "Which best describes your SCA exemption strategy?",
    subtitle: "Transaction Risk Analysis, low-value, and trusted beneficiary exemptions",
    options: [
      { text: "We don't actively manage exemptions — we rely on default PSP settings", level: 1 },
      { text: "We're aware of TRA and low-value exemptions but haven't fully implemented them", level: 2 },
      { text: "We actively apply TRA and other exemptions to reduce unnecessary challenges", level: 3 },
      { text: "We optimise exemption strategies based on issuer acceptance rates and market data", level: 4 },
      { text: "We use real-time identity intelligence to dynamically select the optimal exemption path per transaction", level: 5 },
    ],
  },
  {
    id: 3,
    question: "How do you measure authentication performance?",
    subtitle: "The KPIs and metrics driving your authentication decisions",
    options: [
      { text: "We primarily track overall authorisation rates from our PSP dashboard", level: 1 },
      { text: "We monitor challenge rates alongside authorisation, but don't segment deeply", level: 2 },
      { text: "We separately track authentication success rates, challenge rates, and abandonment", level: 3 },
      { text: "We segment authentication KPIs by issuer, device type, geography, and payment method", level: 4 },
      { text: "We run real-time anomaly detection on authentication performance with identity-based signals", level: 5 },
    ],
  },
  {
    id: 4,
    question: "How much visibility do you have into issuer-level authentication?",
    subtitle: "Understanding how different banks handle your customer challenges",
    options: [
      { text: "Very little — we rely on aggregate PSP reports", level: 1 },
      { text: "We see some issuer-level data but don't act on it systematically", level: 2 },
      { text: "We track issuer-level authentication success rates and challenge behaviour", level: 3 },
      { text: "We actively optimise authentication flows based on issuer behaviour patterns", level: 4 },
      { text: "We combine issuer intelligence with customer identity data for dynamic per-transaction decisioning", level: 5 },
    ],
  },
  {
    id: 5,
    question: "How do you handle mobile authentication experiences?",
    subtitle: "Mobile accounts for over 60% of ecommerce — and higher authentication drop-off",
    options: [
      { text: "Same approach as desktop — standard 3DS flow across all devices", level: 1 },
      { text: "We know mobile has higher drop-off but haven't optimised specifically", level: 2 },
      { text: "We track mobile vs. desktop authentication performance separately", level: 3 },
      { text: "We optimise authentication flows specifically for mobile devices and native apps", level: 4 },
      { text: "We use identity-led approaches that minimise authentication friction across all devices dynamically", level: 5 },
    ],
  },
  {
    id: 6,
    question: "How prepared is your organisation for evolving authentication requirements?",
    subtitle: "PSD3 is expected by 2026–2027 with stronger authentication mandates",
    options: [
      { text: "We're focused on maintaining current PSD2 compliance", level: 1 },
      { text: "We're monitoring PSD3 developments but haven't started preparing", level: 2 },
      { text: "We have a roadmap for authentication improvements beyond basic compliance", level: 3 },
      { text: "We continuously iterate on our authentication strategy with dedicated resources", level: 4 },
      { text: "Authentication optimisation is a core competency with a dedicated team, technology, and continuous improvement", level: 5 },
    ],
  },
];
