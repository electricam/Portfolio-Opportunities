import { ArrowRight, Radar, ShieldCheck, Sparkles, Target } from "lucide-react";
import { BudgetAlignmentChart } from "@/components/dashboard/charts";
import { OpportunityList } from "@/components/dashboard/opportunity-list";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RadarResponse } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function RadarDashboard({ data }: { data: RadarResponse }) {
  return (
    <div className="space-y-8">
      <Card className="overflow-hidden bg-horizon p-8 text-white">
        <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-teal-200">Gov Adoption Radar</p>
            <h2 className="mt-3 text-4xl font-semibold">{data.companyName}</h2>
            <p className="mt-4 max-w-3xl text-lg text-slate-200">{data.valueProposition}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {data.capabilityTags.map((tag) => (
                <Badge key={tag} className="border-white/10 bg-white/10 text-white">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-300">
              <span>Target agencies: {data.targetAgencies.join(", ")}</span>
              <span>Refreshed {formatDate(data.generatedAt)}</span>
            </div>
          </div>
          <div className="grid gap-4">
            <Metric icon={Radar} label="Top Opportunity Score" value={`${data.topOpportunityScore}`} />
            <Metric icon={Target} label="First Discovery Target" value={data.firstTarget} />
            <Metric icon={ShieldCheck} label="Freshness Note" value={data.dataFreshnessNote} />
          </div>
        </div>
      </Card>

      <section className="grid gap-8 xl:grid-cols-[1.3fr_1fr]">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Sparkles className="size-5 text-flare" />
            <h3 className="text-2xl font-semibold text-slate-950">Capability-to-Mission Translator</h3>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.24em] text-slate-500">
                  <th className="pb-3 pr-4">Capability</th>
                  <th className="pb-3 pr-4">Government Mission Translation</th>
                  <th className="pb-3 pr-4">Likely User</th>
                  <th className="pb-3 pr-4">Evidence / Keywords</th>
                  <th className="pb-3">Priority</th>
                </tr>
              </thead>
              <tbody>
                {data.translations.map((row) => (
                  <tr key={`${row.capability}-${row.likelyUser}`} className="border-b border-slate-100 align-top">
                    <td className="py-4 pr-4 text-sm font-medium text-slate-900">{row.capability}</td>
                    <td className="py-4 pr-4 text-sm text-slate-600">{row.missionTranslation}</td>
                    <td className="py-4 pr-4 text-sm text-slate-600">{row.likelyUser}</td>
                    <td className="py-4 pr-4">
                      <div className="flex flex-wrap gap-2">
                        {row.evidence.map((item) => (
                          <Badge key={item}>{item}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 text-sm text-slate-600">{row.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-2xl font-semibold text-slate-950">Budget & Strategy Alignment</h3>
          <p className="mt-2 text-sm text-slate-600">
            FY26 budget themes act as the priority layer, helping the team anchor commercial capabilities to real resourcing momentum.
          </p>
          <BudgetAlignmentChart items={data.budgetAlignment} />
          <div className="space-y-3">
            {data.budgetAlignment.map((item) => (
              <div key={item.title} className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <Badge>{item.score}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.rationale}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className="p-6">
        <div className="flex items-center gap-3">
          <Radar className="size-5 text-signal" />
          <div>
            <h3 className="text-2xl font-semibold text-slate-950">Live Opportunity Radar</h3>
            <p className="text-sm text-slate-600">Cards expand into source-linked detail and clearly show live vs demo vs disabled status.</p>
          </div>
        </div>
        <div className="mt-6">
          <OpportunityList opportunities={data.opportunities} />
        </div>
      </Card>

      <section className="grid gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-2xl font-semibold text-slate-950">Stakeholder Map</h3>
          <div className="mt-5 space-y-4">
            {data.stakeholders.map((stakeholder) => (
              <div key={stakeholder.title} className="rounded-[24px] bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{stakeholder.title}</p>
                    <p className="mt-2 text-sm text-slate-600">{stakeholder.summary}</p>
                  </div>
                  <ArrowRight className="mt-1 size-4 text-slate-400" />
                </div>
                <p className="mt-3 text-sm text-slate-700">{stakeholder.whyNow}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {stakeholder.targetRoles.map((role) => (
                    <Badge key={role}>{role}</Badge>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {stakeholder.recommendedPaths.map((path) => (
                    <Badge key={path} className="bg-white">
                      {path}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-2xl font-semibold text-slate-950">Acquisition Pathways & 30/60/90</h3>
          <div className="mt-5 grid gap-3">
            {data.acquisitionPathways.map((path) => (
              <div key={path.name} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{path.name}</p>
                  <Badge>{path.status}</Badge>
                </div>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{path.type}</p>
                <p className="mt-2 text-sm text-slate-600">{path.whenToUse}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            {data.actionPlan.map((phase) => (
              <div key={phase.phase} className="rounded-[24px] bg-horizon p-5 text-white">
                <p className="text-xs uppercase tracking-[0.28em] text-teal-200">{phase.phase}</p>
                <div className="mt-3 space-y-2">
                  {phase.items.map((item) => (
                    <p key={item} className="text-sm text-slate-200">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className="p-6">
        <h3 className="text-xl font-semibold text-slate-950">Source Notes</h3>
        <div className="mt-4 space-y-2 text-sm text-slate-600">
          {data.sourceNotes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Radar;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-3">
        <Icon className="size-5 text-teal-200" />
        <p className="text-xs uppercase tracking-[0.24em] text-slate-300">{label}</p>
      </div>
      <p className="mt-3 text-lg font-medium text-white">{value}</p>
    </div>
  );
}
