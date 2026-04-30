export type SurveyFieldKey =
  | "timestamp"
  | "province"
  | "buyingFrequency"
  | "purchaseChannels"
  | "buyingPriority"
  | "problems"
  | "freshnessDiscomfort"
  | "activeHijabUsage"
  | "productInterest"
  | "mainBenefit"
  | "preferredScent"
  | "mainConcern"
  | "currentPrice"
  | "acceptablePrice"
  | "purchaseIntention";

export type SurveyColumnMap = Record<SurveyFieldKey, string | null>;

export interface SurveyRecord {
  timestamp?: string;
  province?: string;
  buyingFrequency?: string;
  purchaseChannels: string[];
  buyingPriority: string[];
  problems: string[];
  freshnessDiscomfort?: string;
  activeHijabUsage?: string;
  productInterest?: string;
  mainBenefit: string[];
  preferredScent?: string;
  mainConcern: string[];
  currentPrice?: string;
  acceptablePrice?: string;
  purchaseIntention?: string;
}

export interface ParsedSurveyData {
  csvPath: string;
  headers: string[];
  columnMap: SurveyColumnMap;
  rows: SurveyRecord[];
  missingCriticalFields: SurveyFieldKey[];
}

export interface DistributionDatum {
  label: string;
  value: number;
  percentage: number;
}

export interface QuestionInsight {
  question: string;
  topAnswer: string;
  runnerUpAnswer?: string;
  summary: string;
  implication: string;
}

export type ValidationStatus =
  | "Strong validation"
  | "Promising, test further"
  | "Needs refinement"
  | "Weak validation";

export interface MarketOverviewData {
  totalRespondents: number;
  topProvince: string;
  topPurchaseChannel: string;
  provinceDistribution: DistributionDatum[];
  freshnessNeedScore: number;
  freshnessNeedLabel: string;
  buyingFrequency: DistributionDatum[];
  purchaseChannels: DistributionDatum[];
}

export interface CustomerProblemData {
  topProblem: string;
  secondaryProblem?: string;
  problemChart: DistributionDatum[];
  problemRelevanceScore: number;
}

export interface ProductInterestData {
  marketInterestScore: number;
  interestChart: DistributionDatum[];
  mainBenefitChart: DistributionDatum[];
}

export interface PreferredScentData {
  topScent: string;
  secondaryScent?: string;
  scentChart: DistributionDatum[];
  mvpRecommendation: string;
}

export interface PriceAcceptanceData {
  topPriceRange: string;
  priceFitScore: number;
  acceptablePriceChart: DistributionDatum[];
  currentPriceChart: DistributionDatum[];
}

export interface PurchaseIntentionData {
  purchaseIntentionScore: number;
  purchaseIntentionChart: DistributionDatum[];
  conversionOpportunity: string;
}

export interface ConsumerSignalsData {
  buyingPriorityChart: DistributionDatum[];
  freshnessDiscomfortChart: DistributionDatum[];
  mainConcernChart: DistributionDatum[];
}

export interface FinalValidationData {
  finalBusinessValidationScore: number;
  validationStatus: ValidationStatus;
  recommendation: string;
  testingStrategy: string;
  scorecards: Array<{
    label: string;
    value: number;
    summary: string;
  }>;
}

export interface SurveyAnalytics {
  sourcePath: string;
  headers: string[];
  columnMap: SurveyColumnMap;
  totalRespondents: number;
  marketOverview: MarketOverviewData;
  customerProblem: CustomerProblemData;
  productInterest: ProductInterestData;
  preferredScent: PreferredScentData;
  priceAcceptance: PriceAcceptanceData;
  purchaseIntention: PurchaseIntentionData;
  consumerSignals: ConsumerSignalsData;
  finalValidation: FinalValidationData;
  insightSummary: string[];
  questionInsights: Record<string, QuestionInsight>;
}
