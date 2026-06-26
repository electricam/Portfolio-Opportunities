import { CompanyProfile, Opportunity, SearchPlan } from "@/lib/types";
import { clamp } from "@/lib/utils";

export function scoreOpportunity(opportunity: Opportunity, profile: CompanyProfile, plan: SearchPlan) {
  const haystack = `${opportunity.title} ${opportunity.descriptionSummary} ${opportunity.agency} ${opportunity.office ?? ""}`.toLowerCase();
  const keywordHits = plan.samQueries.filter((query) => haystack.includes(query.toLowerCase())).length;
  const agencyHit = profile.likelyAgencies.some((agency) => haystack.includes(agency.toLowerCase())) ? 1 : 0;
  const base = opportunity.sourceStatus === "live" ? 70 : opportunity.sourceStatus === "demo" ? 58 : 34;
  return clamp(base + keywordHits * 6 + agencyHit * 8, 18, 97);
}
