import { CompanyProfile, Opportunity, SearchPlan } from "@/lib/types";
import { getDemoUsaSpendingSignals } from "@/lib/sources/demo-opportunities";

export async function fetchUsaSpendingSignals(profile: CompanyProfile, plan: SearchPlan): Promise<Opportunity[]> {
  try {
    return getDemoUsaSpendingSignals(profile, plan);
  } catch {
    return getDemoUsaSpendingSignals(profile, plan);
  }
}
