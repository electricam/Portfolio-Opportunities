import { CompanyProfile, StakeholderMapItem } from "@/lib/types";
import { clamp } from "@/lib/utils";

export function stakeholderConfidence(profile: CompanyProfile, role: string) {
  const roleText = role.toLowerCase();
  const support = profile.likelyGovernmentUsers.filter((user) =>
    user.toLowerCase().includes(roleText) || roleText.includes(user.toLowerCase()),
  ).length;
  return clamp(0.52 + support * 0.12 + profile.sourceConfidence * 0.2, 0.42, 0.92);
}

export function addStakeholderConfidence(profile: CompanyProfile, item: Omit<StakeholderMapItem, "confidence">): StakeholderMapItem {
  return {
    ...item,
    confidence: stakeholderConfidence(profile, item.role),
  };
}
