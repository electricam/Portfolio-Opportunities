import { CompanyProfile, Opportunity, SearchPlan } from "@/lib/types";
import { getDemoSbirSignals } from "@/lib/sources/demo-opportunities";

export async function fetchSbirSignals(profile: CompanyProfile, plan: SearchPlan): Promise<Opportunity[]> {
  try {
    return getDemoSbirSignals(profile, plan);
  } catch {
    return getDemoSbirSignals(profile, plan);
  }
}
