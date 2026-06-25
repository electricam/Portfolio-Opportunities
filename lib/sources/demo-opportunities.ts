import { IntakePayload, Opportunity } from "@/lib/types";
import { slugify } from "@/lib/utils";

function makeId(prefix: string, payload: IntakePayload, index: number) {
  return `${prefix}-${slugify(payload.companyName)}-${index}`;
}

export function getDemoSamOpportunities(payload: IntakePayload, keywords: string[]): Opportunity[] {
  return [
    {
      id: makeId("sam", payload, 1),
      title: `Prototype support for ${keywords[0] ?? "AI-enabled"} mission workflows`,
      source: "SAM.gov",
      sourceStatus: "demo",
      sourceUrl: "https://sam.gov/search/?index=opp",
      agency: "Department of Defense",
      office: "Innovation / mission integration office",
      status: "Forecast / Sources Sought",
      dueDate: "2026-08-15",
      type: "Contract opportunity",
      noticeId: "DEMO-SAM-001",
      vehicle: "TBD",
      naics: "541715",
      psc: "AC12",
      descriptionSummary: "Demo placeholder representing a future SAM.gov opportunity card while the live adapter is being wired.",
      extractedKeywords: keywords.slice(0, 5),
      whyFit: "The company description suggests a plausible fit for prototype or evaluation work tied to current budget priorities.",
      buyerHypothesis: "A program office sponsor could use this as a scoped pilot before transition funding.",
      recommendedAction: "Prepare a one-page capability brief and identify likely office sponsors before outreach.",
      confidence: 0.66,
      caveats: ["Demo fallback because SAM.gov live integration is not yet enabled in this environment."],
      matchScore: 82,
    },
    {
      id: makeId("sam", payload, 2),
      title: `${payload.companyName} capability fit for mission data modernization`,
      source: "SAM.gov",
      sourceStatus: "demo",
      sourceUrl: "https://sam.gov/search/?index=opp",
      agency: "DHS / CISA",
      office: "Cyber or infrastructure modernization office",
      status: "Open market research",
      dueDate: "2026-09-05",
      type: "RFI / Sources Sought",
      noticeId: "DEMO-SAM-002",
      vehicle: "Open market",
      descriptionSummary: "Demo market-research notice used to show source-linked opportunity detail before live API calls are connected.",
      extractedKeywords: keywords.slice(2, 7),
      whyFit: "Keywords indicate overlap with modernization, analytics, or cyber mission support.",
      buyerHypothesis: "An innovation or mission integration office may be looking for commercial solutions with fast deployment timelines.",
      recommendedAction: "Use the notice structure to shape outreach and tailor the proof-of-value hypothesis.",
      confidence: 0.61,
      caveats: ["Illustrative card for MVP demo behavior."],
      matchScore: 74,
    },
  ];
}

export function getDemoSbirOpportunities(payload: IntakePayload, keywords: string[]): Opportunity[] {
  return [
    {
      id: makeId("sbir", payload, 1),
      title: `SBIR topic aligned to ${keywords[0] ?? "dual-use technology"}`,
      source: "SBIR.gov",
      sourceStatus: "demo",
      sourceUrl: "https://www.sbir.gov/topics",
      agency: "Air Force",
      office: "SBIR / STTR Program",
      status: "Solicitation window",
      dueDate: "2026-07-30",
      type: "SBIR/STTR solicitation",
      noticeId: "DEMO-SBIR-001",
      descriptionSummary: "Represents how the dashboard will surface live SBIR topics and topic-fit reasoning.",
      extractedKeywords: keywords.slice(0, 5),
      whyFit: "The product appears commercially relevant and prototype-friendly, which often maps well to SBIR entry paths.",
      buyerHypothesis: "An innovation office may fund a scoped feasibility or prototype effort as a first government contract.",
      recommendedAction: "Review topic language, match it to TRL/MRL maturity, and prepare a concise quad chart.",
      confidence: 0.73,
      caveats: ["Demo fallback until SBIR API wiring is complete."],
      matchScore: 79,
    },
    {
      id: makeId("usa", payload, 1),
      title: `Historical awards signal for ${payload.companyName} adjacent category`,
      source: "USAspending.gov",
      sourceStatus: "demo",
      sourceUrl: "https://www.usaspending.gov/search",
      agency: "Department of Defense",
      office: "Incumbent / prime signal",
      status: "Historical award / incumbent signal",
      type: "Award history",
      descriptionSummary: "Illustrative USAspending result showing how incumbents and prior buyers can be surfaced without being misrepresented as open opportunities.",
      extractedKeywords: keywords.slice(1, 6),
      whyFit: "Historical spending in adjacent categories can reveal likely buyers, primes, and contract channels.",
      buyerHypothesis: "The first path may be through a teaming partner already winning in this category.",
      recommendedAction: "Use award history to identify incumbent relationships and relevant NAICS/PSC patterns.",
      confidence: 0.69,
      caveats: ["Historical signal only, not an open solicitation."],
      matchScore: 71,
      isHistorical: true,
    },
  ];
}

export function getDisabledGrantsNotice(): Opportunity {
  return {
    id: "grants-disabled",
    title: "Grants.gov integration available when API key/config is provided",
    source: "Grants.gov",
    sourceStatus: "disabled",
    agency: "Civilian federal agencies",
    status: "Configuration required",
    type: "Grant opportunities",
    descriptionSummary: "This placeholder explains that Grants.gov can be enabled for research, civilian, energy, health, or infrastructure motions.",
    extractedKeywords: ["grants", "civilian", "research"],
    whyFit: "Relevant when agency focus includes civilian infrastructure, health, energy, or basic/applied research buyers.",
    buyerHypothesis: "Some use cases may benefit from grant-funded pilots or research collaborations.",
    recommendedAction: "Add API credentials and narrow grant search logic to relevant civilian targets.",
    confidence: 0.42,
    caveats: ["Disabled until Grants.gov credentials and source-specific query logic are added."],
    matchScore: 40,
  };
}
