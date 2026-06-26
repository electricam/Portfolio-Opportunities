import {
  deriveAcquisitionPathways,
  deriveActionPlan,
  deriveAgencyFits,
  deriveBudgetAlignment,
  deriveEvidence,
  deriveSourceNotes,
  deriveStakeholderMap,
  deriveTranslations,
} from "@/lib/analysis";
import { classifyCompany } from "@/lib/agents/classifyCompany";
import { generateSearchPlan } from "@/lib/agents/generateSearchPlan";
import { fetchGrantsSignals } from "@/lib/sources/grants";
import { fetchSamOpportunities } from "@/lib/sources/sam";
import { fetchSbirSignals } from "@/lib/sources/sbir";
import { fetchUsaSpendingSignals } from "@/lib/sources/usaspending";
import { scoreOpportunity } from "@/lib/scoring/opportunityScore";
import { fetchWebsite } from "@/lib/website/fetchWebsite";
import { DashboardData, DashboardRequest } from "@/lib/types";

export async function analyzeWebsite(request: DashboardRequest) {
  return fetchWebsite(request.websiteUrl, request.manualText);
}

export async function classifyWebsite(request: DashboardRequest) {
  const extract = await analyzeWebsite(request);
  return classifyCompany(extract);
}

export async function buildSearchPlan(request: DashboardRequest) {
  const extract = await analyzeWebsite(request);
  const profile = await classifyCompany(extract);
  return generateSearchPlan(profile);
}

export async function generateDashboard(request: DashboardRequest): Promise<DashboardData> {
  const websiteExtract = await analyzeWebsite(request);
  const companyProfile = await classifyCompany(websiteExtract);
  const searchPlan = generateSearchPlan(companyProfile);

  const [sam, sbir, spending, grants] = await Promise.all([
    fetchSamOpportunities(companyProfile, searchPlan),
    request.advancedOptions?.includeSbir === false ? Promise.resolve([]) : fetchSbirSignals(companyProfile, searchPlan),
    request.advancedOptions?.includeHistoricalAwards === false
      ? Promise.resolve([])
      : fetchUsaSpendingSignals(companyProfile, searchPlan),
    fetchGrantsSignals(request.advancedOptions?.includeGrants ?? true),
  ]);

  const opportunities = [...sam, ...sbir, ...spending, ...grants]
    .map((opportunity) => ({
      ...opportunity,
      matchScore: scoreOpportunity(opportunity, companyProfile, searchPlan),
    }))
    .sort((left, right) => right.matchScore - left.matchScore)
    .slice(0, 10);

  return {
    generatedAt: new Date().toISOString(),
    websiteExtract,
    companyProfile,
    searchPlan,
    translations: deriveTranslations(companyProfile, searchPlan),
    opportunities,
    agencyFits: deriveAgencyFits(companyProfile, searchPlan),
    stakeholderMap: deriveStakeholderMap(companyProfile),
    acquisitionPathways: deriveAcquisitionPathways(companyProfile),
    budgetAlignment: deriveBudgetAlignment(companyProfile),
    evidence: deriveEvidence(companyProfile, searchPlan),
    actionPlan: deriveActionPlan(companyProfile),
    sourceNotes: deriveSourceNotes(),
  };
}
