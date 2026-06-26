"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { RadarDashboard } from "@/components/dashboard/radar-dashboard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardData, DashboardRequest } from "@/lib/types";

export function RadarResult() {
  const params = useSearchParams();
  const websiteUrl = params.get("websiteUrl") ?? "";
  const options = params.get("options");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualText, setManualText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadDashboard(fallbackText?: string) {
    if (!websiteUrl) {
      setError("Website URL is required.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload: DashboardRequest = {
        websiteUrl,
        advancedOptions: options ? JSON.parse(options) : undefined,
        manualText: fallbackText,
      };

      const response = await fetch("/api/generate-dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to generate dashboard.");
      }

      setDashboard(data as DashboardData);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unexpected error.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, [websiteUrl, options]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <Card className="flex min-h-[360px] items-center justify-center p-10">
          <div className="text-center">
            <Loader2 className="mx-auto size-8 animate-spin text-signal" />
            <p className="mt-4 text-sm text-slate-600">Analyzing website, inferring mission, and building the government adoption map.</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <Card className="p-8">
          <h1 className="text-3xl font-semibold text-slate-950">Website analysis needs a fallback</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{error}</p>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            You can paste text from the company website here and rerun the workflow without changing the homepage experience.
          </p>
          <textarea
            value={manualText}
            onChange={(event) => setManualText(event.target.value)}
            className="mt-5 min-h-52 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-signal"
            placeholder="Paste website text here if the site blocked fetches or rendered poorly..."
          />
          <div className="mt-5">
            <Button onClick={() => void loadDashboard(manualText)} disabled={!manualText.trim()}>
              Retry With Pasted Text
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!dashboard) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <RadarDashboard data={dashboard} />
    </div>
  );
}
