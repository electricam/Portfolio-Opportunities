import agencyFocus from "@/data/reference/agency-focus.json";
import { acquisitionPaths } from "@/lib/reference/acquisitionPathways";
import { budgetThemes } from "@/lib/reference/budgetThemes";
import { stakeholderPathways } from "@/lib/reference/stakeholderFramework";
import {
  AcquisitionPathwayRecommendation,
  AgencyFit,
  BudgetAlignment,
  CompanyProfile,
  EvidenceItem,
  SearchPlan,
  StakeholderMapItem,
  TranslationRow,
} from "@/lib/types";
import { addStakeholderConfidence } from "@/lib/scoring/stakeholderScore";
import { uniqueStrings } from "@/lib/utils";

export function deriveTranslations(profile: CompanyProfile, plan: SearchPlan): TranslationRow[] {
  return profile.technologyKeywords.slice(0, 5).map((keyword, index) => ({
    websiteLanguage: keyword,
    missionTranslation:
      index === 0
        ? `Translate ${keyword} into operational advantage, faster analyst throughput, or more resilient mission execution.`
        : `Frame ${keyword} in government language around measurable mission outcomes rather than product features.`,
    likelyUser: profile.likelyGovernmentUsers[index] ?? profile.likelyGovernmentUsers[0] ?? "Mission user",
    searchKeywords: uniqueStrings([
      keyword,
      plan.samQueries[index] ?? "",
      plan.sbirQueries[index] ?? "",
      plan.usaspendingQueries[index] ?? "",
    ]).slice(0, 4),
    confidence: Math.min(0.92, profile.sourceConfidence + index * 0.03),
  }));
}

export function deriveAgencyFits(profile: CompanyProfile, plan: SearchPlan): AgencyFit[] {
  return profile.likelyAgencies.slice(0, 5).map((agency, index) => ({
    agency,
    officeType:
      agencyFocus.find((entry) => entry.label === agency)?.missions[0] ?? "Mission owner / program office / technical evaluator",
    whyTheyCare:
      index === 0
        ? `${profile.sector} language from the website maps closely to ${plan.samQueries.slice(0, 3).join(", ")}.`
        : `This agency is plausible based on the inferred mission language and user set.`,
    evidence: uniqueStrings([profile.oneLineDescription, ...profile.missionKeywords.slice(0, 3)]),
    matchScore: 86 - index * 7,
    suggestedFirstConversation:
      index === 0
        ? "Start with a mission user or technical evaluator before broader acquisition mapping."
        : "Validate the problem statement with an operator-adjacent team or innovation scout.",
  }));
}

export function deriveStakeholderMap(profile: CompanyProfile): StakeholderMapItem[] {
  const roles = [
    {
      role: "End user / operator",
      whyRelevant: "Validates whether the inferred mission problem is real and painful enough to justify further engagement.",
      likelyAsk: "Walk through the current workflow and decision bottlenecks.",
      sourceEvidence: profile.likelyGovernmentUsers[0] ?? "Website language points to direct operational use.",
      caveat: "Do not assume named units or organizations without direct evidence.",
    },
    {
      role: "Technical evaluator",
      whyRelevant: "Screens integration, security, data, and deployment fit before sponsorship broadens.",
      likelyAsk: "Clarify deployment architecture, security posture, and integration requirements.",
      sourceEvidence: profile.deploymentSignals[0] ?? "Security or integration language appears on the site.",
      caveat: "Website claims are not equivalent to government approval status.",
    },
    {
      role: "Program office / PAE / CPE / PEO",
      whyRelevant: "Converts user pull into a budget, program, or transition path.",
      likelyAsk: "Show why the capability matters to mission outcomes and acquisition timing.",
      sourceEvidence: profile.likelyAgencies[0] ?? "Budget and agency fit inference.",
      caveat: "Specific offices should come from live evidence or provided directories.",
    },
    {
      role: "Contracting / vehicle owner",
      whyRelevant: "Determines the most practical path to award once mission pull exists.",
      likelyAsk: "What vehicle, set-aside, or prototype path reduces friction?",
      sourceEvidence: "Acquisition pathway reference library.",
      caveat: "Vehicle fit depends on actual procurement context.",
    },
    {
      role: "Prime / integrator",
      whyRelevant: "Useful when the company is better positioned as a partner than a direct prime.",
      likelyAsk: "How does the capability complement current delivery or vehicle access?",
      sourceEvidence: profile.commercialTractionSignals[0] ?? "Commercial positioning suggests possible teaming value.",
      caveat: "Incumbent mapping is still partly demo/stubbed in this MVP.",
    },
    {
      role: "Innovation pathway owner",
      whyRelevant: "Can help early discovery companies enter through pilots, OTAs, or scouting channels.",
      likelyAsk: "Is the company mature enough for a rapid evaluation or prototype?",
      sourceEvidence: "Stakeholder framework reference layer.",
      caveat: "Fast pathways are not universal and still require real customer pull.",
    },
    {
      role: "Investor / transition partner",
      whyRelevant: "Useful for aligning government timing with commercial financing and transition milestones.",
      likelyAsk: "What evidence would de-risk the next government-adoption step?",
      sourceEvidence: "Adoption plan and maturity signals.",
      caveat: "This is a planning role, not a direct government stakeholder.",
    },
  ];

  return roles.map((role) => addStakeholderConfidence(profile, role));
}

export function deriveAcquisitionPathways(profile: CompanyProfile): AcquisitionPathwayRecommendation[] {
  return acquisitionPaths.map((path, index) => ({
    name: path.name,
    fitScore: 84 - index * 7,
    whyItFits:
      index === 0
        ? "Best when a live notice already matches the inferred mission language."
        : `Useful because ${path.whenToUse.toLowerCase()}`,
    requiredMaturity:
      index < 3
        ? "Working product story with credible technical validation."
        : "Varies by path; some routes support discovery while others require stronger deployment readiness.",
    likelyBuyer: profile.likelyAgencies[0] ?? "Mission office or innovation pathway owner",
    nextAction: "Validate this path against real customer pull before treating it as the primary go-to-government motion.",
    sourceLink:
      path.name === "SAM.gov Contract Opportunities"
        ? "https://sam.gov/search/?index=opp"
        : path.name === "SBIR / STTR"
          ? "https://www.sbir.gov"
          : undefined,
    sourceStatus: path.liveSource ? "demo" : "disabled",
  }));
}

export function deriveBudgetAlignment(profile: CompanyProfile): BudgetAlignment[] {
  return budgetThemes
    .map((theme) => {
      const matches = theme.signals.filter((signal) =>
        [...profile.technologyKeywords, ...profile.missionKeywords].some((keyword) =>
          keyword.toLowerCase().includes(signal.toLowerCase()) || signal.toLowerCase().includes(keyword.toLowerCase()),
        ),
      );

      return {
        title: theme.title,
        whyItMatters: theme.summary,
        companyRelevance:
          matches.length > 0
            ? `The company website surfaced ${matches.slice(0, 3).join(", ")}, which overlaps with this budget theme.`
            : "Strategic adjacency only; this theme may help shape discovery language but does not imply immediate budget fit.",
        keywords: matches.length > 0 ? matches : theme.signals.slice(0, 3),
        confidence: Math.min(0.91, 0.55 + matches.length * 0.1),
        sourceLabel: theme.sourceLabel,
      };
    })
    .sort((left, right) => right.confidence - left.confidence)
    .slice(0, 5);
}

export function deriveEvidence(profile: CompanyProfile, plan: SearchPlan): EvidenceItem[] {
  const now = new Date().toISOString();
  return [
    {
      sourceTitle: profile.websiteTitle || profile.websiteUrl,
      url: profile.websiteUrl,
      sourceType: "Company website",
      usedFor: "Company profile, keyword extraction, mission translation",
      lastChecked: now,
      confidence: profile.sourceConfidence,
    },
    {
      sourceTitle: "SAM.gov Contract Opportunities",
      url: "https://sam.gov/search/?index=opp",
      sourceType: "Live opportunity source",
      usedFor: `Opportunity search using ${plan.samQueries.slice(0, 3).join(", ")}`,
      lastChecked: now,
      confidence: 0.82,
    },
    {
      sourceTitle: "SBIR.gov",
      url: "https://www.sbir.gov",
      sourceType: "Innovation funding source",
      usedFor: `SBIR/STTR topic discovery using ${plan.sbirQueries.slice(0, 3).join(", ")}`,
      lastChecked: now,
      confidence: 0.74,
    },
    {
      sourceTitle: "USAspending.gov",
      url: "https://www.usaspending.gov/search",
      sourceType: "Historical awards source",
      usedFor: "Incumbent mapping and historical award context",
      lastChecked: now,
      confidence: 0.71,
    },
    {
      sourceTitle: "Grants.gov",
      url: "https://www.grants.gov",
      sourceType: "Grant opportunity source",
      usedFor: "Civilian and research grant path discovery when relevant",
      lastChecked: now,
      confidence: 0.54,
    },
    {
      sourceTitle: "FY26 budget themes",
      sourceType: "Static reference",
      usedFor: "Budget alignment and leadership-priority framing",
      lastChecked: now,
      confidence: 0.79,
    },
    {
      sourceTitle: "Stakeholder reference framework",
      sourceType: "Static reference",
      usedFor: "Stakeholder categories and likely asks",
      lastChecked: now,
      confidence: 0.76,
    },
  ];
}

export function deriveActionPlan(profile: CompanyProfile) {
  return [
    {
      phase: "0-30 Days" as const,
      items: [
        "Validate the inferred mission fit with 5-7 operator or analyst conversations.",
        "Review live opportunity signals and narrow the keyword set based on the website-derived profile.",
        "Map likely primes, incumbents, and technical evaluators before outreach widens.",
        `Prepare a first mission demo narrative for ${profile.name}.`,
      ],
    },
    {
      phase: "30-60 Days" as const,
      items: [
        "Conduct technical discovery on integration, deployment, and security constraints.",
        "Pick the most credible acquisition path based on maturity and user pull.",
        "Identify a plausible pilot sponsor or innovation-pathway owner.",
      ],
    },
    {
      phase: "60-90 Days" as const,
      items: [
        "Shape a pilot, teaming, or prototype plan around a real workflow.",
        "Map the likely budget owner and transition path.",
        "Turn the evidence into a customer-backed adoption memo.",
      ],
    },
  ];
}

export function deriveSourceNotes() {
  return [
    "Start with the company. Infer the mission. Find the buyer.",
    "Gov Adoption Radar analyzes a company website and turns it into a source-backed government customer discovery map.",
    "Budget alignment indicates leadership attention and potential resourcing; it is not a guarantee of funding.",
    "This is a customer-discovery and government-adoption intelligence tool, not a capture-management tool.",
    `Stakeholder mapping is based on category frameworks such as ${stakeholderPathways[0]?.title ?? "operator-to-program-office discovery"}.`,
  ];
}
