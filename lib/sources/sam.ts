import { IntakePayload, Opportunity } from "@/lib/types";
import { getDemoSamOpportunities } from "@/lib/sources/demo-opportunities";

const SAM_ENDPOINT = "https://api.sam.gov/prod/opportunities/v2/search";

export async function fetchSamOpportunities(payload: IntakePayload, keywords: string[]): Promise<Opportunity[]> {
  const apiKey = process.env.SAM_GOV_API_KEY;

  if (!apiKey) {
    return getDemoSamOpportunities(payload, keywords);
  }

  try {
    const params = new URLSearchParams({
      api_key: apiKey,
      limit: "10",
      offset: "0",
      postedFrom: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString().slice(0, 10),
      q: keywords.slice(0, 5).join(" "),
    });

    const response = await fetch(`${SAM_ENDPOINT}?${params.toString()}`, {
      method: "GET",
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return getDemoSamOpportunities(payload, keywords);
    }

    const data = (await response.json()) as {
      opportunitiesData?: Array<Record<string, string>>;
    };

    if (!data.opportunitiesData?.length) {
      return getDemoSamOpportunities(payload, keywords);
    }

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
      descriptionSummary: item.description?.slice(0, 280) ?? "Live SAM.gov opportunity.",
      extractedKeywords: keywords.slice(0, 5),
      whyFit: "Live match generated from keyword overlap and agency relevance.",
      buyerHypothesis: "Use the notice metadata to identify the most likely sponsoring office and acquisition strategy.",
      recommendedAction: "Review the live notice, confirm fit, and tailor a capability brief to the named office.",
      confidence: 0.79,
      caveats: ["Live result normalization is intentionally lightweight for MVP."],
      matchScore: 76 - index * 3,
    }));
  } catch {
    return getDemoSamOpportunities(payload, keywords);
  }
}
