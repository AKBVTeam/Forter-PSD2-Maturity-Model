export interface AovBracket {
  label: string;
  midpoint: number;
  exemptionRate: number;
  forter3dsRate: number;
}

export const AOV_BRACKETS: AovBracket[] = [
  { label: "Under €100",   midpoint: 75,   exemptionRate: 0.7713, forter3dsRate: 0.2287 },
  { label: "€100 to €200", midpoint: 150,  exemptionRate: 0.6713, forter3dsRate: 0.3287 },
  { label: "€200 to €300", midpoint: 250,  exemptionRate: 0.5713, forter3dsRate: 0.4287 },
  { label: "€300 to €400", midpoint: 350,  exemptionRate: 0.4713, forter3dsRate: 0.5287 },
  { label: "€400 to €500", midpoint: 450,  exemptionRate: 0.3713, forter3dsRate: 0.6287 },
  { label: "€500 to €600", midpoint: 550,  exemptionRate: 0.3213, forter3dsRate: 0.6787 },
  { label: "€600 to €700", midpoint: 650,  exemptionRate: 0.2213, forter3dsRate: 0.7787 },
  { label: "€700 to €800", midpoint: 750,  exemptionRate: 0.1213, forter3dsRate: 0.8787 },
  { label: "€800 to €900", midpoint: 850,  exemptionRate: 0.0213, forter3dsRate: 0.9787 },
  { label: "€900+",        midpoint: 950,  exemptionRate: 0.0000, forter3dsRate: 1.0000 },
];

export interface ChallengeRateBracket {
  label: string;
  low: number;
  high: number;
  midpoint: number;
}

const ALL_CHALLENGE_BRACKETS: ChallengeRateBracket[] = [
  { label: "0% to 20%",   low: 0.00, high: 0.20, midpoint: 0.10 },
  { label: "20% to 40%",  low: 0.20, high: 0.40, midpoint: 0.30 },
  { label: "40% to 60%",  low: 0.40, high: 0.60, midpoint: 0.50 },
  { label: "60% to 80%",  low: 0.60, high: 0.80, midpoint: 0.70 },
  { label: "80% to 100%", low: 0.80, high: 1.00, midpoint: 0.90 },
  { label: "I don't know", low: 0, high: 1, midpoint: 1.00 },
];

export function getChallengeRateBrackets(aovLabel: string): ChallengeRateBracket[] {
  const aov = AOV_BRACKETS.find((b) => b.label === aovLabel);
  if (!aov) return ALL_CHALLENGE_BRACKETS;

  const minRate = aov.forter3dsRate;
  return ALL_CHALLENGE_BRACKETS.filter(
    (b) => b.label === "I don't know" || b.high > minRate
  );
}

export function getChallengeRatesByLevel(aovLabel: string): Record<number, string> {
  const aov = AOV_BRACKETS.find((b) => b.label === aovLabel);
  if (!aov) {
    return { 1: "80%+", 2: "40 to 60%", 3: "25 to 40%", 4: "15 to 25%", 5: "<15%" };
  }

  const floor = aov.forter3dsRate;
  const ceiling = 1.0;
  const span = ceiling - floor;

  const l4 = floor + span * 0.15;
  const l3 = floor + span * 0.35;
  const l2 = floor + span * 0.60;
  const l1 = floor + span * 0.85;

  function fmt(v: number): string {
    return `${Math.round(v * 100)}%`;
  }

  return {
    1: `${fmt(l1)}+`,
    2: `${fmt(l2)} to ${fmt(l1)}`,
    3: `${fmt(l3)} to ${fmt(l2)}`,
    4: `${fmt(l4)} to ${fmt(l3)}`,
    5: `<${fmt(l4)}`,
  };
}

export function getSuggestedChallengeRate(aovLabel: string): string {
  const aov = AOV_BRACKETS.find((b) => b.label === aovLabel);
  if (!aov) return "";

  const floor = aov.forter3dsRate;
  if (floor >= 0.60) return "80% to 100%";
  if (floor >= 0.40) return "60% to 80%";
  if (floor >= 0.20) return "40% to 60%";
  return "40% to 60%";
}

export const CARD_TRAFFIC_BRACKETS = [
  { label: "Under 40%",   midpoint: 0.35 },
  { label: "40% to 50%",  midpoint: 0.45 },
  { label: "50% to 60%",  midpoint: 0.55 },
  { label: "60% to 70%",  midpoint: 0.65 },
  { label: "70% to 80%",  midpoint: 0.75 },
  { label: "80% to 90%",  midpoint: 0.85 },
  { label: "90% to 100%", midpoint: 0.95 },
  { label: "I don't know", midpoint: 0.70 },
];

const ABANDONMENT_LOW = 0.15;
const ABANDONMENT_HIGH = 0.25;

export interface RevenueEstimate {
  totalGmv: number;
  cardTrafficPct: number;
  psd2Gmv: number;
  currentChallengeRate: number;
  forterExemptionRate: number;
  currentLostLow: number;
  currentLostHigh: number;
  recoveredLow: number;
  recoveredHigh: number;
  forterRemainingLow: number;
  forterRemainingHigh: number;
  currency: string;
}

function parseGmvMidpoint(gmvLabel: string): { value: number; currency: string } {
  const match = gmvLabel.match(/^([^\d]+)\s*/);
  const currency = match ? match[1].trim() : "€";

  if (gmvLabel.includes("20bn+")) return { value: 25_000_000_000, currency };
  if (gmvLabel.includes("10bn to 20bn")) return { value: 15_000_000_000, currency };
  if (gmvLabel.includes("5bn to 10bn")) return { value: 7_500_000_000, currency };
  if (gmvLabel.includes("1bn to 5bn")) return { value: 3_000_000_000, currency };
  if (gmvLabel.includes("500m to 1bn")) return { value: 750_000_000, currency };
  if (gmvLabel.includes("250m to 500m")) return { value: 375_000_000, currency };
  if (gmvLabel.includes("100m to 250m")) return { value: 175_000_000, currency };
  if (gmvLabel.includes("50m to 100m")) return { value: 75_000_000, currency };
  if (gmvLabel.includes("10m to 50m")) return { value: 30_000_000, currency };
  if (gmvLabel.includes("1m to 10m")) return { value: 5_500_000, currency };
  return { value: 5_500_000, currency };
}

export function calculateRevenue(
  gmvLabel: string,
  aovLabel: string,
  challengeRateLabel: string,
  cardTrafficLabel: string,
): RevenueEstimate | null {
  const aov = AOV_BRACKETS.find((b) => b.label === aovLabel);
  const cr = ALL_CHALLENGE_BRACKETS.find((b) => b.label === challengeRateLabel);
  const ct = CARD_TRAFFIC_BRACKETS.find((b) => b.label === cardTrafficLabel);
  if (!aov || !cr || !ct) return null;

  const { value: totalGmv, currency } = parseGmvMidpoint(gmvLabel);
  return calculateRevenueDirect(totalGmv, aov.exemptionRate, cr.midpoint, ct.midpoint, currency);
}

export function calculateRevenueDirect(
  totalGmv: number,
  forterExemptionRate: number,
  currentChallengeRate: number,
  cardTrafficPct: number,
  currency: string,
): RevenueEstimate {
  const psd2Gmv = totalGmv * cardTrafficPct;

  const currentLostLow = psd2Gmv * currentChallengeRate * ABANDONMENT_LOW;
  const currentLostHigh = psd2Gmv * currentChallengeRate * ABANDONMENT_HIGH;

  const forterEffectiveRate = currentChallengeRate * (1 - forterExemptionRate);
  const forterRemainingLow = psd2Gmv * forterEffectiveRate * ABANDONMENT_LOW;
  const forterRemainingHigh = psd2Gmv * forterEffectiveRate * ABANDONMENT_HIGH;

  const recoveredLow = currentLostLow - forterRemainingLow;
  const recoveredHigh = currentLostHigh - forterRemainingHigh;

  return {
    totalGmv,
    cardTrafficPct,
    psd2Gmv,
    currentChallengeRate,
    forterExemptionRate,
    currentLostLow,
    currentLostHigh,
    recoveredLow,
    recoveredHigh,
    forterRemainingLow,
    forterRemainingHigh,
    currency,
  };

}

export function getInitialValues(
  gmvLabel: string,
  aovLabel: string,
  challengeRateLabel: string,
  cardTrafficLabel: string,
): { gmv: number; cardTraffic: number; challengeRate: number; exemptionRate: number; currency: string } | null {
  const aov = AOV_BRACKETS.find((b) => b.label === aovLabel);
  const cr = ALL_CHALLENGE_BRACKETS.find((b) => b.label === challengeRateLabel);
  const ct = CARD_TRAFFIC_BRACKETS.find((b) => b.label === cardTrafficLabel);
  if (!aov || !cr || !ct) return null;

  const { value, currency } = parseGmvMidpoint(gmvLabel);
  return {
    gmv: value,
    cardTraffic: Math.round(ct.midpoint * 100),
    challengeRate: Math.round(cr.midpoint * 100),
    exemptionRate: aov.exemptionRate,
    currency,
  };
}
