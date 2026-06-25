import agencyFocus from "@/data/reference/agency-focus.json";
import budgetThemes from "@/data/reference/budget-themes.json";
import stakeholderPathways from "@/data/reference/stakeholder-pathways.json";
import acquisitionPaths from "@/data/reference/acquisition-paths.json";
import { IntakePayload, TranslationRow } from "@/lib/types";

const KEYWORD_MAP: Array<{ triggers: string[]; keywords: string[]; mission: string; user: string }> = [
  {
    triggers: ["cyber", "malware", "threat", "security"],
    keywords: ["cyber", "malware analysis", "threat hunting", "zero trust", "network defense"],
    mission: "Accelerate cyber defense and analyst triage workflows.",
    user: "CISA hunt teams / USCYBERCOM analysts",
  },
  {
    triggers: ["ai", "ml", "model", "data"],
    keywords: ["artificial intelligence", "decision support", "automation", "data fusion"],
    mission: "Shorten decision cycles with AI-assisted analysis.",
    user: "Mission analysts / program office AI leads",
  },
  {
    triggers: ["autonomy", "robot", "drone", "uas"],
    keywords: ["autonomy", "uncrewed systems", "mission autonomy", "robotics"],
    mission: "Extend mission reach with autonomous or remotely operated systems.",
    user: "Operational experimentation cells / autonomy PMs",
  },
  {
    triggers: ["space", "satellite", "orbital"],
    keywords: ["space resilience", "space domain awareness", "satellite operations"],
    mission: "Improve resilience and awareness in the space domain.",
    user: "Space operations mission owners / Space Systems commands",
  },
  {
    triggers: ["manufacturing", "supply chain", "factory"],
    keywords: ["industrial base", "manufacturing resilience", "production readiness"],
    mission: "Increase supply chain resilience and production throughput.",
    user: "Industrial base offices / sustainment leaders",
  },
];

function normalizeText(payload: IntakePayload) {
  return `${payload.companyName} ${payload.websiteUrl} ${payload.companyDescription} ${payload.capabilityTags.join(" ")}`
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]+/g, " ");
}

export function deriveKeywords(payload: IntakePayload) {
  const text = normalizeText(payload);
  const keywords = new Set<string>();

  KEYWORD_MAP.forEach((entry) => {
    if (entry.triggers.some((trigger) => text.includes(trigger))) {
      entry.keywords.forEach((keyword) => keywords.add(keyword));
    }
  });

  payload.capabilityTags.forEach((tag) => keywords.add(tag.toLowerCase()));
  payload.companyDescription
    .split(/[\s,.;:()]+/)
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length > 5)
    .slice(0, 18)
    .forEach((token) => keywords.add(token));

  return Array.from(keywords).slice(0, 20);
}

export function deriveTranslations(payload: IntakePayload, keywords: string[]): TranslationRow[] {
  const text = normalizeText(payload);
  const rows = KEYWORD_MAP.filter((entry) => entry.triggers.some((trigger) => text.includes(trigger))).map((entry) => ({
    capability: entry.keywords[0],
    missionTranslation: entry.mission,
    likelyUser: entry.user,
    evidence: keywords.filter((keyword) => entry.keywords.includes(keyword)).slice(0, 4),
    priority: "high" as const,
  }));

  if (rows.length > 0) return rows;

  return [
    {
      capability: payload.capabilityTags[0] ?? "Core platform capability",
      missionTranslation: "Translate the commercial capability into measurable mission speed, resilience, or cost advantage.",
      likelyUser: "Innovation cell / mission owner / program office scout",
      evidence: keywords.slice(0, 4),
      priority: "medium",
    },
  ];
}

export function deriveTargetAgencies(payload: IntakePayload, keywords: string[]) {
  if (payload.targetAgency !== "auto") {
    return agencyFocus
      .filter((entry) => entry.key === payload.targetAgency)
      .map((entry) => entry.label);
  }

  const matches = agencyFocus
    .map((entry) => ({
      label: entry.label,
      score: entry.missions.filter((mission) =>
        keywords.some((keyword) => mission.toLowerCase().includes(keyword.toLowerCase())),
      ).length,
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map((entry) => entry.label);

  return matches.length > 0 ? matches : ["DoD", "DHS / CISA"];
}

export function deriveBudgetAlignment(keywords: string[]) {
  return budgetThemes
    .map((theme) => {
      const matches = theme.signals.filter((signal) =>
        keywords.some((keyword) => keyword.toLowerCase().includes(signal.toLowerCase()) || signal.includes(keyword.toLowerCase())),
      );

      return {
        title: theme.title,
        summary: theme.summary,
        rationale:
          matches.length > 0
            ? `Matched on ${matches.slice(0, 3).join(", ")}.`
            : "Included as a strategic adjacency for customer-discovery framing.",
        score: Math.min(96, 58 + matches.length * 12),
        sourceLabel: theme.sourceLabel,
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 4);
}

export function deriveStakeholders(keywords: string[]) {
  return stakeholderPathways.slice(0, 4).map((pathway, index) => ({
    title: pathway.title,
    summary: pathway.summary,
    targetRoles: pathway.targetRoles,
    recommendedPaths: pathway.recommendedPaths,
    whyNow:
      index === 0
        ? `Early user pull is especially important because current keywords center on ${keywords.slice(0, 3).join(", ")}.`
        : `Supports conversion from discovery into a funded path once signal quality improves.`,
  }));
}

export function deriveAcquisitionPathways() {
  return acquisitionPaths.map((path) => ({
    name: path.name,
    type: path.type,
    whenToUse: path.whenToUse,
    status: path.liveSource ? ("demo" as const) : ("disabled" as const),
  }));
}

export function deriveValueProp(payload: IntakePayload, keywords: string[]) {
  const lead = payload.capabilityTags[0] ?? keywords[0] ?? "commercial technology";
  const target = payload.targetAgency === "auto" ? "priority government teams" : payload.targetAgency.replace(/-/g, " ");

  return `${lead} positioned for ${target} buyers with a story around mission speed, resilience, and transition readiness.`;
}

export function deriveActionPlan(payload: IntakePayload, topAgency: string, topStakeholder: string) {
  return [
    {
      phase: "30 Days" as const,
      items: [
        `Pressure-test the mission narrative with 5-7 interviews across ${topAgency} operators and mission support staff.`,
        `Build a one-page brief that translates ${payload.companyName} into mission outcomes, not feature language.`,
        `Review live SAM.gov and SBIR signals weekly using the current keyword set and refine the search terms.`,
      ],
    },
    {
      phase: "60 Days" as const,
      items: [
        `Convert the strongest user pain into a buyer hypothesis for ${topStakeholder}.`,
        "Identify one fast path such as SBIR, OTA, or DIU-style prototyping and map entry requirements.",
        "Start incumbent and teaming analysis using USAspending historical award patterns.",
      ],
    },
    {
      phase: "90 Days" as const,
      items: [
        "Run a pilot or technical evaluation proposal tied to a real user workflow.",
        "Secure a warm handoff from user champion to program office or contracting path.",
        "Package budget-alignment evidence and transition milestones into an investor-grade government motion update.",
      ],
    },
  ];
}
