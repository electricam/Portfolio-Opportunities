import { CompanyProfile, Opportunity, SearchPlan } from "@/lib/types";
import { getDemoSamOpportunities } from "@/lib/sources/demo-opportunities";

const SAM_ENDPOINT = "https://api.sam.gov/prod/opportunities/v2/search";

export async function fetchSamOpportunities(profile: CompanyProfile, plan: SearchPlan): Promise<Opportunity[]> {
  const apiKey = process.env.SAM_GOV_API_KEY;
  if (!apiKey) return getDemoSamOpportunities(profile, plan);

  try {
    const params = new URLSearchParams({
      api_key: apiKey,
      limit: "10",
      offset: "0",
      postedFrom: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString().slice(0, 10),
      q: plan.samQueries.slice(0, 5).join(" "),
    });

    const response = await fetch(`${SAM_ENDPOINT}?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) return getDemoSamOpportunities(profile, plan);
    const data = (await response.json()) as { opportunitiesData?: Array<Record<string, string>> };
    if (!data.opportunitiesData?.length) return getDemoSamOpportunities(profile, plan);

    return data.opportunitiesData.slice(0, 6).map((item, index) => ({
      id: `sam-live-${index}`,
      title: item.title ?? "Untitled opportunity",
      source: "SAM.gov",
      sourceStatus: "live",
      sourceUrl: item.uiLink ?? "https://sam.gov/search/?index=opp",
      agency: item.fullParentPathName ?? item.organizationType ?? "Federal agency",
      office: item.office ?? item.organizationType,
      status: item.type ?? "Open",
      dueDate: item.responseDeadLine,
      type: item.typeOfSetAsideDescription ?? item.type ?? "Contract opportunity",
      noticeId: item.noticeId,
      vehicle: item.typeOfSetAside,
      naics: item.naicsCode,
      psc: item.classificationCode,
      descriptionSummary: item.description?.slice(0, 320) ?? "Live SAM.gov opportunity.",
      extractedKeywords: plan.samQueries.slice(0, 5),
      whyFit: "Live opportunity relevance inferred from website-derived search language and agency alignment.",
      buyerHypothesis: "Use the named notice and office metadata to identify the most likely sponsorship path.",
      recommendedAction: "Review the live notice and validate mission fit before external use.",
      confidence: 0.8,
      caveats: ["Live normalization is intentionally lightweight in the MVP."],
      matchScore: 75 - index * 3,
    }));
  } catch {
    return getDemoSamOpportunities(profile, plan);
  }
}
