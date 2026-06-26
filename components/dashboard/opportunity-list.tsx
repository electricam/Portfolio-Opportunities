"use client";

import { useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Opportunity } from "@/lib/types";
import { formatDate } from "@/lib/utils";

function statusColor(status: Opportunity["sourceStatus"]) {
  if (status === "live") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "demo") return "bg-amber-50 text-amber-700 border-amber-200";
  if (status === "needs-api-key") return "bg-blue-50 text-blue-700 border-blue-200";
  if (status === "error") return "bg-rose-50 text-rose-700 border-rose-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

export function OpportunityList({ opportunities }: { opportunities: Opportunity[] }) {
  const [selectedId, setSelectedId] = useState(opportunities[0]?.id);
  const selected = opportunities.find((item) => item.id === selectedId) ?? opportunities[0];

  if (opportunities.length === 0) {
    return <p className="text-sm text-slate-600">No opportunity signals were generated for this run.</p>;
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {opportunities.map((opportunity) => {
          const isSelected = opportunity.id === selectedId;
          return (
            <button
              key={opportunity.id}
              type="button"
              onClick={() => setSelectedId(opportunity.id)}
              className="text-left"
            >
              <Card
                className={
                  isSelected
                    ? "h-full border border-signal/40 bg-signal/5 p-5"
                    : "h-full border border-transparent p-5 transition hover:-translate-y-0.5 hover:border-slate-200"
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{opportunity.title}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">{opportunity.source}</p>
                  </div>
                  <Badge className={statusColor(opportunity.sourceStatus)}>{opportunity.sourceStatus}</Badge>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>{opportunity.agency}</p>
                  <p>{opportunity.status}</p>
                  <p>Due {formatDate(opportunity.dueDate)}</p>
                  <p>Match {opportunity.matchScore}</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>{opportunity.type}</span>
                  {isSelected ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </div>
              </Card>
            </button>
          );
        })}
      </div>

      {selected ? (
        <Card className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-2xl font-semibold text-slate-950">{selected.title}</h3>
                <Badge className={statusColor(selected.sourceStatus)}>{selected.sourceStatus}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-600">{selected.descriptionSummary}</p>
            </div>
            {selected.sourceUrl ? (
              <a href={selected.sourceUrl} target="_blank" rel="noreferrer">
                <Button variant="secondary" className="gap-2">
                  View Source
                  <ArrowUpRight className="size-4" />
                </Button>
              </a>
            ) : null}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <Detail label="Notice / ID" value={selected.noticeId ?? "N/A"} />
            <Detail label="Agency" value={selected.agency} />
            <Detail label="Office / End User" value={selected.office ?? "TBD"} />
            <Detail label="Due Date" value={formatDate(selected.dueDate)} />
            <Detail label="Vehicle / NAICS / PSC" value={[selected.vehicle, selected.naics, selected.psc].filter(Boolean).join(" / ") || "N/A"} />
            <Detail label="Buyer Hypothesis" value={selected.buyerHypothesis} />
            <Detail label="Recommended Action" value={selected.recommendedAction} />
            <Detail label="Confidence Score" value={`${Math.round(selected.confidence * 100)}%`} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <InfoBlock title="Keywords" values={selected.extractedKeywords} />
            <InfoBlock title="Why It Matters" values={[selected.whyFit]} />
            <InfoBlock title="Caveats" values={selected.caveats} />
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-800">{value}</p>
    </div>
  );
}

function InfoBlock({ title, values }: { title: string; values: string[] }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {values.map((value) => (
          <Badge key={value}>{value}</Badge>
        ))}
      </div>
    </div>
  );
}
