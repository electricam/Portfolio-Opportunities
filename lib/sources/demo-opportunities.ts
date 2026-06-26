import { CompanyProfile, Opportunity, SearchPlan, SourceStatus } from "@/lib/types";
import { slugify } from "@/lib/utils";

function makeId(prefix: string, profile: CompanyProfile, index: number) {
  return `${prefix}-${slugify(profile.name)}-${index}`;
}

function sourceStatusForFallback(status: SourceStatus) {
  return status;
}

export function getDemoSamOpportunities(profile: CompanyProfile, plan: SearchPlan): Opportunity[] {
  return [
    {
      id: makeId("sam", profile, 1),
      title: `Prototype support for ${plan.samQueries[0] ?? "commercial mission software"} workflows`,
      source: "SAM.gov",
      sourceStatus: sourceStatusForFallback("demo"),
      sourceUrl: "https://sam.gov/search/?index=opp",
      agency: profile.likelyAgencies[0] ?? "Department of Defense",
      office: "Mission integration office",
      status: "Forecast / Sources Sought",
      dueDate: "2026-08-15",
      type: "Contract opportunity",
      noticeId: "DEMO-SAM-001",
      vehicle: "TBD",
      naics: plan.naicsCandidates[0],
      psc: plan.pscCandidates[0],
      descriptionSummary: "Illustrative opportunity card used when live contract-opportunity automation is not available.",
      extractedKeywords: plan.samQueries.slice(0, 5),
      whyFit: "The website language points toward a credible fit for prototype, evaluation, or market-research activity.",
      buyerHypothesis: "A program office sponsor could start with a scoped pilot before budget transition decisions.",
      recommendedAction: "Use this as a discovery prompt, not as a real open pipeline item, until live source results are available.",
      confidence: 0.61,
      caveats: ["Demo result shown because live SAM.gov calls are unavailable or returned no matching records."],
      matchScore: 72,
    },
  ];
}

export function getDemoSbirSignals(profile: CompanyProfile, plan: SearchPlan): Opportunity[] {
  return [
    {
      id: makeId("sbir", profile, 1),
      title: `SBIR topic aligned to ${plan.sbirQueries[0] ?? "dual-use technology"}`,
      source: "SBIR.gov",
      sourceStatus: "demo",
      sourceUrl: "https://www.sbir.gov/topics",
      agency: profile.likelyAgencies[0] ?? "Air Force",
      office: "SBIR / STTR Program",
      status: "Solicitation window",
      dueDate: "2026-07-30",
      type: "SBIR/STTR solicitation",
      noticeId: "DEMO-SBIR-001",
      descriptionSummary: "Illustrative topic-fit result shown when live SBIR integration is not yet active.",
      extractedKeywords: plan.sbirQueries.slice(0, 5),
      whyFit: "The company appears mature enough for early government discovery, but still prototype-friendly.",
      buyerHypothesis: "A non-dilutive prototype motion may be one of the fastest ways to validate government pull.",
      recommendedAction: "Check whether current topic language matches the company’s technical maturity and deployment posture.",
      confidence: 0.66,
      caveats: ["Demo result rather than a live solicitation record."],
      matchScore: 68,
    },
  ];
}

export function getDemoUsaSpendingSignals(profile: CompanyProfile, plan: SearchPlan): Opportunity[] {
  return [
    {
      id: makeId("usa", profile, 1),
      title: `Historical award signal for ${profile.sector} incumbents`,
      source: "USAspending.gov",
      sourceStatus: "demo",
      sourceUrl: "https://www.usaspending.gov/search",
      agency: profile.likelyAgencies[0] ?? "Department of Defense",
      office: "Incumbent / prime signal",
      status: "Historical award / incumbent signal",
      type: "Award history",
      descriptionSummary: "Historical award signal used to frame incumbent mapping and teaming conversations.",
      extractedKeywords: plan.usaspendingQueries.slice(0, 5),
      whyFit: "Historical spending can reveal likely buyers, prime channels, and contract structures even when no live solicitation is open.",
      buyerHypothesis: "Initial access may come through an incumbent or vehicle holder rather than a direct prime bid.",
      recommendedAction: "Use award history to identify likely vehicles, primes, and office patterns.",
      confidence: 0.64,
      caveats: ["Historical signal only; not a live opportunity."],
      matchScore: 63,
      isHistorical: true,
    },
  ];
}

export function getDisabledGrantsNotice(): Opportunity {
  return {
    id: "grants-disabled",
    title: "Grants.gov can be enabled when API configuration is available",
    source: "Grants.gov",
    sourceStatus: "needs-api-key",
    sourceUrl: "https://www.grants.gov",
    agency: "Civilian federal agencies",
    status: "Configuration required",
    type: "Grant opportunities",
    descriptionSummary: "Grants.gov remains disabled until its API path is configured, but the pathway is still shown when civilian or research relevance exists.",
    extractedKeywords: ["grants", "research", "civilian"],
    whyFit: "Relevant for research-heavy or civilian-adjacent companies, but not always the primary path.",
    buyerHypothesis: "If the company leans research or infrastructure, grants may support a first government signal.",
    recommendedAction: "Add Grants.gov configuration before treating this as a live search channel.",
    confidence: 0.41,
    caveats: ["Needs API key or dedicated integration work."],
    matchScore: 28,
  };
}
