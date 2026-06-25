"use client";

import { useState, useTransition } from "react";
import { Loader2, Radar } from "lucide-react";
import { RadarDashboard } from "@/components/dashboard/radar-dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CAPABILITY_OPTIONS, TARGET_AGENCY_OPTIONS } from "@/lib/constants";
import { CapabilityTag, IntakePayload, RadarResponse } from "@/lib/types";

const DEMO_DESCRIPTION =
  "AI-native cyber platform that automates malware triage, correlates suspicious binaries with threat intelligence, and helps analysts prioritize incident response faster.";

export function IntakeForm() {
  const [result, setResult] = useState<RadarResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [payload, setPayload] = useState<IntakePayload>({
    companyName: "Aegis Forge",
    websiteUrl: "https://example.com",
    companyDescription: DEMO_DESCRIPTION,
    targetAgency: "auto",
    capabilityTags: ["AI / ML", "Cybersecurity", "Malware Analysis", "Software / DevSecOps"],
  });

  function toggleCapability(tag: CapabilityTag) {
    setPayload((current) => {
      const hasTag = current.capabilityTags.includes(tag);
      return {
        ...current,
        capabilityTags: hasTag
          ? current.capabilityTags.filter((item) => item !== tag)
          : [...current.capabilityTags, tag],
      };
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/radar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Unable to generate radar.");
        }

        const data = (await response.json()) as RadarResponse;
        setResult(data);
      } catch (submissionError) {
        setError(submissionError instanceof Error ? submissionError.message : "Unexpected error.");
      }
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.25fr]">
        <Card className="sticky top-6 h-fit p-6 lg:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-flare/10 p-3 text-flare">
              <Radar className="size-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Intake</p>
              <h1 className="mt-1 text-3xl font-semibold text-slate-950">
                Map a Portfolio Company to Government Adoption Pathways
              </h1>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-600">
            Budget themes act as the priority layer, stakeholder pathways act as the engagement layer, and live-source adapters drop into the workflow as they are wired.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <Field label="Company Name">
              <input
                value={payload.companyName}
                onChange={(event) => setPayload((current) => ({ ...current, companyName: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 transition focus:border-signal"
                required
              />
            </Field>

            <Field label="Website URL">
              <input
                type="url"
                value={payload.websiteUrl}
                onChange={(event) => setPayload((current) => ({ ...current, websiteUrl: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 transition focus:border-signal"
                placeholder="https://company.com"
              />
            </Field>

            <Field label="Company Description">
              <textarea
                value={payload.companyDescription}
                onChange={(event) => setPayload((current) => ({ ...current, companyDescription: event.target.value }))}
                className="min-h-40 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-signal"
                required
              />
            </Field>

            <Field label="Target Agency Focus">
              <select
                value={payload.targetAgency}
                onChange={(event) =>
                  setPayload((current) => ({
                    ...current,
                    targetAgency: event.target.value as IntakePayload["targetAgency"],
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-signal"
              >
                {TARGET_AGENCY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Capability Tags">
              <div className="flex flex-wrap gap-2">
                {CAPABILITY_OPTIONS.map((tag) => {
                  const active = payload.capabilityTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleCapability(tag)}
                      className={active ? "rounded-full bg-horizon px-3 py-2 text-xs font-medium text-white" : "rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600"}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Button type="submit" className="w-full gap-2" disabled={isPending}>
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <Radar className="size-4" />}
              Generate Adoption Radar
            </Button>
          </form>

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge>SAM.gov adapter boundary</Badge>
            <Badge>SBIR + USAspending stubs</Badge>
            <Badge>Budget-priority scoring</Badge>
          </div>
        </Card>

        <div className="space-y-6">
          {result ? (
            <RadarDashboard data={result} />
          ) : (
            <Card className="flex min-h-[640px] items-center justify-center p-10">
              <div className="max-w-xl text-center">
                <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Demo-Ready MVP</p>
                <h2 className="mt-3 font-serif text-5xl text-slate-950">Government adoption intelligence, shaped for real conversations.</h2>
                <p className="mt-5 text-base leading-7 text-slate-600">
                  Submit a company profile to generate an adoption map that blends budget priorities, stakeholder pathways, acquisition routes, and source-linked opportunity signals with graceful demo fallbacks.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  <Badge>Users, buyers, PEOs, labs</Badge>
                  <Badge>Live/future opportunity layer</Badge>
                  <Badge>30/60/90 discovery plan</Badge>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-800">{label}</span>
      {children}
    </label>
  );
}
