import {
  deriveAcquisitionPathways,
  deriveActionPlan,
  deriveBudgetAlignment,
  deriveKeywords,
  deriveStakeholders,
  deriveTargetAgencies,
  deriveTranslations,
  deriveValueProp,
} from "@/lib/analysis";
import { fetchGrantsSignals } from "@/lib/sources/grants";
import { fetchSamOpportunities } from "@/lib/sources/sam";
import { fetchSbirSignals } from "@/lib/sources/sbir";
import { fetchUsaSpendingSignals } from "@/lib/sources/usaspending";
import { IntakePayload, RadarResponse } from "@/lib/types";

export async function generateRadar(payload: IntakePayload): Promise<RadarResponse> {
  const keywords = deriveKeywords(payload);
  const translations = deriveTranslations(payload, keywords);
  const targetAgencies = deriveTargetAgencies(payload, keywords);
  const budgetAlignment = deriveBudgetAlignment(keywords);
  const stakeholders = deriveStakeholders(keywords);

  const [sam, sbir, spending, grants] = await Promise.all([
    fetchSamOpportunities(payload, keywords),
    fetchSbirSignals(payload, keywords),
    fetchUsaSpendingSignals(payload, keywords),
    fetchGrantsSignals(),
  ]);

  const opportunities = [...sam, ...sbir, ...spending, ...grants]
    .sort((left, right) => right.matchScore - left.matchScore)
    .slice(0, 8);

  const topOpportunityScore = opportunities[0]?.matchScore ?? 0;
  const firstTarget = stakeholders[0]?.targetRoles[0] ?? "Mission user";

  return {
    generatedAt: new Date().toISOString(),
    companyName: payload.companyName,
    valueProposition: deriveValueProp(payload, keywords),
    targetAgencies,
    capabilityTags: payload.capabilityTags,
    keywords,
    topOpportunityScore,
    firstTarget,
    dataFreshnessNote: "Source-linked signals should be refreshed before external use.",
    translations,
    opportunities,
    budgetAlignment,
    stakeholders,
    acquisitionPathways: deriveAcquisitionPathways(),
    actionPlan: deriveActionPlan(payload, targetAgencies[0] ?? "DoD", firstTarget),
    sourceNotes: [
      "FY26 budget themes are derived from the user-provided budget document as a strategy layer.",
      "Stakeholder pathways are framed from the user-provided DoW Directory reference and intentionally avoid republishing directory content.",
      "SAM.gov, SBIR.gov, USAspending.gov, and Grants.gov adapters are stubbed to fail gracefully into demo or disabled states.",
    ],
  };
}
