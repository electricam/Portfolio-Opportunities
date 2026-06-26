import { CapabilityTag, TargetAgency } from "@/lib/types";

export const TARGET_AGENCY_OPTIONS: Array<{ value: TargetAgency; label: string }> = [
  { value: "auto", label: "Auto" },
  { value: "dod", label: "DoD" },
  { value: "intelligence-community", label: "Intelligence Community" },
  { value: "dhs-cisa", label: "DHS / CISA" },
  { value: "army", label: "Army" },
  { value: "navy-marine-corps", label: "Navy / Marine Corps" },
  { value: "air-force-space-force", label: "Air Force / Space Force" },
  { value: "socom", label: "SOCOM" },
  { value: "civilian-federal", label: "Civilian Federal" },
];

export const CAPABILITY_OPTIONS: CapabilityTag[] = [
  "Cybersecurity",
  "AI / ML",
  "Autonomy",
  "Space",
  "ISR",
  "Sensors",
  "Electronic Warfare",
  "Energy",
  "Critical Infrastructure",
  "Logistics",
  "Manufacturing",
  "Biotech",
  "Quantum",
  "Software / DevSecOps",
  "Data Infrastructure",
  "Defense Industrial Base",
  "Other",
];

export const DEFAULT_ADVANCED_OPTIONS = {
  includeCivilianAgencies: true,
  includeHistoricalAwards: true,
  includeGrants: true,
  includeSbir: true,
  includeDodOnlySources: false,
  forceAgencyFocus: "auto" as const,
  targetMarketOverride: "",
};
