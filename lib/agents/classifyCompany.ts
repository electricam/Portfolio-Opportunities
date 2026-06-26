import agencyFocus from "@/data/reference/agency-focus.json";
import { createJsonFromOpenAI } from "@/lib/agents/openai";
import { WebsiteExtract, CompanyProfile, CapabilityTag } from "@/lib/types";
import { clamp, sentenceCase, slugify, uniqueStrings } from "@/lib/utils";

const SIGNALS: Array<{
  tag: CapabilityTag;
  sector: string;
  triggers: string[];
  governmentTerms: string[];
  users: string[];
  agencies: string[];
}> = [
  {
    tag: "Cybersecurity",
    sector: "Cybersecurity",
    triggers: ["cyber", "malware", "threat", "security", "detection", "vulnerability", "binary", "reverse engineering"],
    governmentTerms: ["malware analysis", "threat hunting", "software assurance", "incident response"],
    users: ["Threat hunting teams", "Malware analysts", "Network defenders"],
    agencies: ["DHS / CISA", "DoD", "Intelligence Community"],
  },
  {
    tag: "AI / ML",
    sector: "AI / ML",
    triggers: ["ai", "machine learning", "model", "llm", "inference", "agentic"],
    governmentTerms: ["decision support", "automation", "data fusion", "analytic acceleration"],
    users: ["Mission analysts", "AI program leads", "Operational planning cells"],
    agencies: ["DoD", "Intelligence Community", "Civilian Federal"],
  },
  {
    tag: "Autonomy",
    sector: "Autonomy",
    triggers: ["autonomy", "robot", "drone", "uncrewed", "uas", "uav", "swarm"],
    governmentTerms: ["mission autonomy", "uncrewed systems", "operational experimentation"],
    users: ["Autonomy PMs", "Operational test teams", "Experimentation cells"],
    agencies: ["DoD", "SOCOM", "Army"],
  },
  {
    tag: "Space",
    sector: "Space",
    triggers: ["space", "satellite", "orbital", "constellation", "launch"],
    governmentTerms: ["space resilience", "space domain awareness", "mission support"],
    users: ["Space operators", "Mission planners", "Space acquisition offices"],
    agencies: ["Air Force / Space Force", "DoD", "Intelligence Community"],
  },
  {
    tag: "Critical Infrastructure",
    sector: "Critical Infrastructure",
    triggers: ["critical infrastructure", "grid", "utility", "resilience", "infrastructure"],
    governmentTerms: ["infrastructure protection", "resilience", "civilian cyber defense"],
    users: ["Infrastructure risk teams", "Protective security advisors", "Resilience planners"],
    agencies: ["DHS / CISA", "Civilian Federal"],
  },
  {
    tag: "Manufacturing",
    sector: "Manufacturing",
    triggers: ["manufacturing", "factory", "production", "supply chain", "industrial"],
    governmentTerms: ["industrial base resilience", "production readiness", "sustainment"],
    users: ["Industrial base offices", "Sustainment leaders", "Program executive offices"],
    agencies: ["DoD", "Army", "Navy / Marine Corps"],
  },
  {
    tag: "Software / DevSecOps",
    sector: "Software / DevSecOps",
    triggers: ["devsecops", "software delivery", "platform engineering", "developer", "pipeline"],
    governmentTerms: ["software modernization", "secure delivery", "platform operations"],
    users: ["Platform teams", "Mission software offices", "Digital service leaders"],
    agencies: ["DoD", "Civilian Federal", "DHS / CISA"],
  },
  {
    tag: "Data Infrastructure",
    sector: "Data Infrastructure",
    triggers: ["data platform", "data infrastructure", "database", "analytics", "observability"],
    governmentTerms: ["data integration", "mission analytics", "decision support"],
    users: ["Data engineers", "Mission analysts", "Enterprise architects"],
    agencies: ["DoD", "Intelligence Community", "Civilian Federal"],
  },
];

function summarizeText(extract: WebsiteExtract) {
  return `${extract.title}. ${extract.metaDescription}. ${extract.headings.slice(0, 8).join(". ")}. ${extract.visibleText.slice(0, 2200)}`;
}

export async function classifyCompany(extract: WebsiteExtract): Promise<CompanyProfile> {
  const summaryText = summarizeText(extract).toLowerCase();
  const deterministic = deterministicClassification(extract, summaryText);

  const ai = await createJsonFromOpenAI<Partial<CompanyProfile>>({
    systemPrompt:
      "You classify company websites for government customer discovery. Return valid JSON only, concise and source-grounded, using the provided site text without inventing facts.",
    userPrompt: `Classify this company website into a government adoption profile. Return keys: name, oneLineDescription, governmentValueProposition, sector, capabilityTags, technologyKeywords, missionKeywords, likelyAgencies, likelyGovernmentUsers, maturitySignals, commercialTractionSignals, deploymentSignals, caveats.\n\nWebsite: ${extract.url}\nTitle: ${extract.title}\nMeta: ${extract.metaDescription}\nHeadings: ${extract.headings.join(" | ")}\nText: ${extract.visibleText.slice(0, 10000)}`,
  });

  return {
    ...deterministic,
    name: ai?.name || deterministic.name,
    oneLineDescription: ai?.oneLineDescription || deterministic.oneLineDescription,
    governmentValueProposition: ai?.governmentValueProposition || deterministic.governmentValueProposition,
    sector: ai?.sector || deterministic.sector,
    capabilityTags: uniqueStrings(ai?.capabilityTags ?? deterministic.capabilityTags),
    technologyKeywords: uniqueStrings(ai?.technologyKeywords ?? deterministic.technologyKeywords).slice(0, 14),
    missionKeywords: uniqueStrings(ai?.missionKeywords ?? deterministic.missionKeywords).slice(0, 14),
    likelyAgencies: uniqueStrings(ai?.likelyAgencies ?? deterministic.likelyAgencies).slice(0, 6),
    likelyGovernmentUsers: uniqueStrings(ai?.likelyGovernmentUsers ?? deterministic.likelyGovernmentUsers).slice(0, 8),
    maturitySignals: uniqueStrings(ai?.maturitySignals ?? deterministic.maturitySignals).slice(0, 6),
    commercialTractionSignals: uniqueStrings(ai?.commercialTractionSignals ?? deterministic.commercialTractionSignals).slice(0, 6),
    deploymentSignals: uniqueStrings(ai?.deploymentSignals ?? deterministic.deploymentSignals).slice(0, 6),
    caveats: uniqueStrings(ai?.caveats ?? deterministic.caveats).slice(0, 6),
  };
}

function deterministicClassification(extract: WebsiteExtract, summaryText: string): CompanyProfile {
  const matchedSignals = SIGNALS.filter((signal) =>
    signal.triggers.some((trigger) => summaryText.includes(trigger)),
  );

  const capabilityTags =
    matchedSignals.length > 0 ? matchedSignals.map((signal) => signal.tag) : (["Other"] as string[]);

  const technologyKeywords = uniqueStrings(
    matchedSignals.flatMap((signal) => signal.governmentTerms).concat(
      extract.headings.flatMap((heading) =>
        heading
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter((token) => token.length > 4),
      ),
    ),
  ).slice(0, 12);

  const missionKeywords = uniqueStrings(
    matchedSignals
      .flatMap((signal) => signal.governmentTerms)
      .concat(capabilityTags.map((tag) => tag.toLowerCase())),
  ).slice(0, 12);

  const likelyAgencies = uniqueStrings(
    matchedSignals.flatMap((signal) => signal.agencies).concat(
      agencyFocus
        .filter((entry) =>
          entry.missions.some((mission) =>
            technologyKeywords.some((keyword) => mission.toLowerCase().includes(keyword.toLowerCase())),
          ),
        )
        .map((entry) => entry.label),
    ),
  ).slice(0, 5);

  const likelyUsers = uniqueStrings(matchedSignals.flatMap((signal) => signal.users)).slice(0, 6);
  const titleParts = extract.title.split(/[|:-]/).map((part) => part.trim()).filter(Boolean);
  const fallbackName = sentenceCase(titleParts[0] || new URL(extract.url).hostname.replace(/^www\./, ""));
  const description =
    extract.metaDescription ||
    extract.headings[0] ||
    "Commercial technology platform inferred from website language.";

  const maturitySignals = uniqueStrings(
    [
      /customers|case studies|deploy/i.test(extract.visibleText) ? "Evidence of customer-facing deployment language." : "",
      /platform|product|solution/i.test(extract.visibleText) ? "Productized platform language appears on the website." : "",
      /security|compliance|fedramp|air-gapped|on-prem/i.test(extract.visibleText)
        ? "Security or controlled deployment language appears on the site."
        : "",
    ].filter(Boolean),
  );

  const tractionSignals = uniqueStrings(
    [
      /customers|partners|trusted by|fortune|enterprise/i.test(extract.visibleText)
        ? "Commercial traction or customer proof language appears on the site."
        : "",
      /blog|resources|webinar|case study/i.test(extract.visibleText)
        ? "Go-to-market collateral suggests active commercial outreach."
        : "",
    ].filter(Boolean),
  );

  const deploymentSignals = uniqueStrings(
    [
      /api|integrat|sdk|platform/i.test(extract.visibleText) ? "Integration-oriented language suggests platform deployability." : "",
      /security|zero trust|fedramp|compliance|air-gapped|classified/i.test(extract.visibleText)
        ? "Security posture language may help with government deployment conversations."
        : "",
    ].filter(Boolean),
  );

  const sector = matchedSignals[0]?.sector ?? "Other";
  const sourceConfidence = clamp(0.52 + matchedSignals.length * 0.09 + (extract.metaDescription ? 0.05 : 0), 0.45, 0.92);

  return {
    id: slugify(`${fallbackName}-${extract.url}`),
    name: fallbackName,
    websiteUrl: extract.url,
    websiteTitle: extract.title,
    websiteDescription: extract.metaDescription,
    extractedWebsiteText: extract.visibleText,
    oneLineDescription: description,
    governmentValueProposition: `${sector} capability translated into government language around mission speed, resilience, and deployable operational value.`,
    sector,
    capabilityTags,
    technologyKeywords,
    missionKeywords,
    likelyAgencies: likelyAgencies.length > 0 ? likelyAgencies : ["DoD", "DHS / CISA"],
    likelyGovernmentUsers: likelyUsers.length > 0 ? likelyUsers : ["Mission user", "Technical evaluator", "Program office scout"],
    maturitySignals,
    commercialTractionSignals: tractionSignals,
    deploymentSignals,
    caveats: [
      extract.extractionStatus !== "success" ? "Website extraction was partial, so classification confidence is reduced." : "",
      !extract.metaDescription ? "The site offered limited structured metadata." : "",
    ].filter(Boolean),
    generatedAt: new Date().toISOString(),
    sourceConfidence,
  };
}
