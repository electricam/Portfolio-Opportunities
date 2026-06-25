import { IntakePayload, Opportunity } from "@/lib/types";
import { getDemoSbirOpportunities } from "@/lib/sources/demo-opportunities";

export async function fetchUsaSpendingSignals(payload: IntakePayload, keywords: string[]): Promise<Opportunity[]> {
  try {
    const demo = getDemoSbirOpportunities(payload, keywords).filter((item) => item.source === "USAspending.gov");
    return demo;
  } catch {
    return getDemoSbirOpportunities(payload, keywords).filter((item) => item.source === "USAspending.gov");
  }
}
