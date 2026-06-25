import { Opportunity } from "@/lib/types";
import { getDisabledGrantsNotice } from "@/lib/sources/demo-opportunities";

export async function fetchGrantsSignals(): Promise<Opportunity[]> {
  if (!process.env.GRANTS_GOV_API_KEY) {
    return [getDisabledGrantsNotice()];
  }

  return [getDisabledGrantsNotice()];
}
