import { Opportunity } from "@/lib/types";
import { getDisabledGrantsNotice } from "@/lib/sources/demo-opportunities";

export async function fetchGrantsSignals(includeGrants: boolean): Promise<Opportunity[]> {
  if (!includeGrants) return [];
  return [getDisabledGrantsNotice()];
}
