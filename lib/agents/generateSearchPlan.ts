import { CompanyProfile, SearchPlan } from "@/lib/types";
import { uniqueStrings } from "@/lib/utils";
import { budgetThemes } from "@/lib/reference/budgetThemes";

export function generateSearchPlan(profile: CompanyProfile): SearchPlan {
  const base = uniqueStrings([...profile.technologyKeywords, ...profile.missionKeywords, ...profile.capabilityTags]).slice(0, 10);

  return {
    samQueries: base.slice(0, 6),
    sbirQueries: base.slice(0, 6),
    usaspendingQueries: uniqueStrings([...base, ...profile.likelyAgencies]).slice(0, 8),
    grantsQueries: uniqueStrings(base.filter((item) => !/weapons|munitions/i.test(item))).slice(0, 6),
    stakeholderQueries: uniqueStrings([...profile.likelyGovernmentUsers, ...profile.likelyAgencies]).slice(0, 8),
    budgetThemes: budgetThemes
      .filter((theme) => theme.signals.some((signal) => base.some((item) => item.toLowerCase().includes(signal.toLowerCase()))))
      .map((theme) => theme.title)
      .slice(0, 5),
    agencyFilters: profile.likelyAgencies,
    naicsCandidates: inferNaics(profile),
    pscCandidates: inferPsc(profile),
  };
}

function inferNaics(profile: CompanyProfile) {
  const options = ["541511", "541512", "541513", "541519", "541715"];
  if (profile.capabilityTags.includes("Manufacturing")) return ["336413", "332710", "541715"];
  if (profile.capabilityTags.includes("Biotech")) return ["541714", "325414", "541715"];
  return options;
}

function inferPsc(profile: CompanyProfile) {
  const options = ["AC12", "DA01", "DJ01", "R425"];
  if (profile.capabilityTags.includes("Cybersecurity")) return ["AC12", "DG11", "DJ01", "R425"];
  if (profile.capabilityTags.includes("Autonomy")) return ["AC12", "15GP", "R425"];
  return options;
}
