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
  | "Cybersecurity"
  | "AI / ML"
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
  | "Defense Industrial Base"
  | "Other";

export type SourceStatus = "live" | "demo" | "disabled" | "error" | "needs-api-key";

export interface AdvancedOptions {
  targetMarketOverride?: string;
  forceAgencyFocus?: TargetAgency | "auto";
  includeCivilianAgencies: boolean;
  includeHistoricalAwards: boolean;
  includeGrants: boolean;
  includeSbir: boolean;
  includeDodOnlySources: boolean;
}

export interface DashboardRequest {
  websiteUrl: string;
  advancedOptions?: AdvancedOptions;
  manualText?: string;
}

export interface WebsiteExtract {
  url: string;
  title: string;
  metaDescription: string;
  pagesFetched: Array<{
    url: string;
    title: string;
    status: "fetched" | "skipped" | "error";
  }>;
  headings: string[];
  visibleText: string;
  linksDiscovered: string[];
  extractionStatus: "success" | "partial" | "error";
  errors: string[];
}

export interface CompanyProfile {
  id: string;
  name: string;
  websiteUrl: string;
  websiteTitle: string;
  websiteDescription: string;
  extractedWebsiteText: string;
  oneLineDescription: string;
  governmentValueProposition: string;
  sector: string;
  capabilityTags: string[];
  technologyKeywords: string[];
  missionKeywords: string[];
  likelyAgencies: string[];
  likelyGovernmentUsers: string[];
  maturitySignals: string[];
  commercialTractionSignals: string[];
  deploymentSignals: string[];
  caveats: string[];
  generatedAt: string;
  sourceConfidence: number;
}

export interface SearchPlan {
  samQueries: string[];
  sbirQueries: string[];
  usaspendingQueries: string[];
  grantsQueries: string[];
  stakeholderQueries: string[];
  budgetThemes: string[];
  agencyFilters: string[];
  naicsCandidates: string[];
  pscCandidates: string[];
}

export interface TranslationRow {
  websiteLanguage: string;
  missionTranslation: string;
  likelyUser: string;
  searchKeywords: string[];
  confidence: number;
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

export interface AgencyFit {
  agency: string;
  officeType: string;
  whyTheyCare: string;
  evidence: string[];
  matchScore: number;
  suggestedFirstConversation: string;
}

export interface StakeholderMapItem {
  role: string;
  whyRelevant: string;
  likelyAsk: string;
  sourceEvidence: string;
  confidence: number;
  caveat: string;
}

export interface AcquisitionPathwayRecommendation {
  name: string;
  fitScore: number;
  whyItFits: string;
  requiredMaturity: string;
  likelyBuyer: string;
  nextAction: string;
  sourceLink?: string;
  sourceStatus: SourceStatus;
}

export interface BudgetAlignment {
  title: string;
  whyItMatters: string;
  companyRelevance: string;
  keywords: string[];
  confidence: number;
  sourceLabel: string;
}

export interface EvidenceItem {
  sourceTitle: string;
  url?: string;
  sourceType: string;
  usedFor: string;
  lastChecked: string;
  confidence: number;
}

export interface DashboardData {
  generatedAt: string;
  websiteExtract: WebsiteExtract;
  companyProfile: CompanyProfile;
  searchPlan: SearchPlan;
  translations: TranslationRow[];
  opportunities: Opportunity[];
  agencyFits: AgencyFit[];
  stakeholderMap: StakeholderMapItem[];
  acquisitionPathways: AcquisitionPathwayRecommendation[];
  budgetAlignment: BudgetAlignment[];
  evidence: EvidenceItem[];
  actionPlan: Array<{
    phase: "0-30 Days" | "30-60 Days" | "60-90 Days";
    items: string[];
  }>;
  sourceNotes: string[];
}
