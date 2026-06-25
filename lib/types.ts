export type TargetAgency =
  | "auto"
  | "dod"
  | "intelligence-community"
  | "dhs-cisa"
  | "army"
  | "navy-marine-corps"
  | "air-force-space-force"
  | "socom"
  | "civilian-federal";

export type CapabilityTag =
  | "AI / ML"
  | "Cybersecurity"
  | "Malware Analysis"
  | "Autonomy"
  | "Space"
  | "ISR"
  | "Sensors"
  | "Electronic Warfare"
  | "Energy"
  | "Critical Infrastructure"
  | "Logistics"
  | "Manufacturing"
  | "Biotech"
  | "Quantum"
  | "Software / DevSecOps"
  | "Data Infrastructure"
  | "Other";

export type SourceStatus = "live" | "demo" | "disabled";

export interface IntakePayload {
  companyName: string;
  websiteUrl: string;
  companyDescription: string;
  targetAgency: TargetAgency;
  capabilityTags: CapabilityTag[];
}

export interface TranslationRow {
  capability: string;
  missionTranslation: string;
  likelyUser: string;
  evidence: string[];
  priority: "high" | "medium" | "low";
}

export interface Opportunity {
  id: string;
  title: string;
  source: "SAM.gov" | "SBIR.gov" | "USAspending.gov" | "Grants.gov";
  sourceStatus: SourceStatus;
  sourceUrl?: string;
  agency: string;
  office?: string;
  status: string;
  dueDate?: string;
  type: string;
  noticeId?: string;
  vehicle?: string;
  naics?: string;
  psc?: string;
  descriptionSummary: string;
  extractedKeywords: string[];
  whyFit: string;
  buyerHypothesis: string;
  recommendedAction: string;
  confidence: number;
  caveats: string[];
  matchScore: number;
  isHistorical?: boolean;
}

export interface BudgetAlignment {
  title: string;
  summary: string;
  rationale: string;
  score: number;
  sourceLabel: string;
}

export interface StakeholderRecommendation {
  title: string;
  summary: string;
  targetRoles: string[];
  recommendedPaths: string[];
  whyNow: string;
}

export interface RadarResponse {
  generatedAt: string;
  companyName: string;
  valueProposition: string;
  targetAgencies: string[];
  capabilityTags: string[];
  keywords: string[];
  topOpportunityScore: number;
  firstTarget: string;
  dataFreshnessNote: string;
  translations: TranslationRow[];
  opportunities: Opportunity[];
  budgetAlignment: BudgetAlignment[];
  stakeholders: StakeholderRecommendation[];
  acquisitionPathways: Array<{
    name: string;
    type: string;
    whenToUse: string;
    status: SourceStatus;
  }>;
  actionPlan: Array<{
    phase: "30 Days" | "60 Days" | "90 Days";
    items: string[];
  }>;
  sourceNotes: string[];
}
