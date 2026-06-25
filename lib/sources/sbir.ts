import { IntakePayload, Opportunity } from "@/lib/types";
import { getDemoSbirOpportunities } from "@/lib/sources/demo-opportunities";

export async function fetchSbirSignals(payload: IntakePayload, keywords: string[]): Promise<Opportunity[]> {
  try {
    // MVP stub: treat this as the contract for future wiring while keeping the app demo-ready today.
    return getDemoSbirOpportunities(payload, keywords);
  } catch {
    return getDemoSbirOpportunities(payload, keywords);
  }
}
