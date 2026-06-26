import { Globe, Radar, ShieldCheck, Sparkles, Target } from "lucide-react";
import { BudgetAlignmentChart } from "@/components/dashboard/charts";
import { OpportunityList } from "@/components/dashboard/opportunity-list";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DashboardData } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function RadarDashboard({ data }: { data: DashboardData }) {
  const topOpportunityScore = data.opportunities[0]?.matchScore ?? 0;

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden bg-horizon p-8 text-white">
        <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-teal-200">Gov Adoption Radar</p>
            <h2 className="mt-3 text-4xl font-semibold">{data.companyProfile.name}</h2>
            <p className="mt-4 max-w-3xl text-lg text-slate-200">{data.companyProfile.governmentValueProposition}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {data.companyProfile.capabilityTags.map((tag) => (
                <Badge key={tag} className="border-white/10 bg-white/10 text-white">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-300">
              <span>Website: {data.companyProfile.websiteUrl}</span>
              <span>Refreshed {formatDate(data.generatedAt)}</span>
              <span>Source confidence {Math.round(data.companyProfile.sourceConfidence * 100)}%</span>
            </div>
          </div>
          <div className="grid gap-4">
            <Metric icon={Radar} label="Top Opportunity Score" value={`${topOpportunityScore}`} />
            <Metric icon={Target} label="First Discovery Target" value={data.companyProfile.likelyGovernmentUsers[0] ?? "Mission user"} />
            <Metric icon={ShieldCheck} label="Sector" value={data.companyProfile.sector} />
          </div>
        </div>
      </Card>

      <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Globe className="size-5 text-flare" />
            <div>
              <h3 className="text-2xl font-semibold text-slate-950">Website Intelligence Header</h3>
              <p className="text-sm text-slate-600">Start with the company. Infer the mission. Find the buyer.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <DetailCard label="Website" value={data.companyProfile.websiteUrl} />
            <DetailCard label="One-line Description" value={data.companyProfile.oneLineDescription} />
            <DetailCard label="What Government Would Call It" value={data.companyProfile.governmentValueProposition} />
            <DetailCard label="Analyzed From Website" value={`${data.websiteExtract.pagesFetched.filter((page) => page.status === "fetched").length} pages fetched · ${data.websiteExtract.extractionStatus}`} />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-2xl font-semibold text-slate-950">Company Classification</h3>
          <div className="mt-4 space-y-4">
            <DetailCard label="Core Capabilities" value={data.companyProfile.capabilityTags.join(", ")} />
            <DetailCard label="Inferred Mission Areas" value={data.companyProfile.missionKeywords.join(", ")} />
            <DetailCard label="Likely Users" value={data.companyProfile.likelyGovernmentUsers.join(", ")} />
            <DetailCard label="Confidence / Caveats" value={data.companyProfile.caveats.join(" ") || "Website extraction was sufficient for a baseline classification."} />
          </div>
        </Card>
      </section>

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
                  <th className="pb-3 pr-4">Website Language</th>
                  <th className="pb-3 pr-4">Government Mission Translation</th>
                  <th className="pb-3 pr-4">Likely User</th>
                  <th className="pb-3 pr-4">Search Keywords Generated</th>
                  <th className="pb-3">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {data.translations.map((row) => (
                  <tr key={`${row.websiteLanguage}-${row.likelyUser}`} className="border-b border-slate-100 align-top">
                    <td className="py-4 pr-4 text-sm font-medium text-slate-900">{row.websiteLanguage}</td>
                    <td className="py-4 pr-4 text-sm text-slate-600">{row.missionTranslation}</td>
                    <td className="py-4 pr-4 text-sm text-slate-600">{row.likelyUser}</td>
                    <td className="py-4 pr-4">
                      <div className="flex flex-wrap gap-2">
                        {row.searchKeywords.map((item) => (
                          <Badge key={item}>{item}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 text-sm text-slate-600">{Math.round(row.confidence * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-2xl font-semibold text-slate-950">Agency Fit Map</h3>
          <div className="mt-5 space-y-3">
            {data.agencyFits.map((fit) => (
              <div key={fit.agency} className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{fit.agency}</p>
                  <Badge>{fit.matchScore}</Badge>
                </div>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{fit.officeType}</p>
                <p className="mt-2 text-sm text-slate-600">{fit.whyTheyCare}</p>
                <p className="mt-2 text-sm text-slate-700">Suggested first conversation: {fit.suggestedFirstConversation}</p>
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
            <p className="text-sm text-slate-600">Every record is labeled as live, demo, disabled, error, or needs API key.</p>
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
            {data.stakeholderMap.map((stakeholder) => (
              <div key={stakeholder.role} className="rounded-[24px] bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{stakeholder.role}</p>
                    <p className="mt-2 text-sm text-slate-600">{stakeholder.whyRelevant}</p>
                  </div>
                  <Badge>{Math.round(stakeholder.confidence * 100)}%</Badge>
                </div>
                <p className="mt-3 text-sm text-slate-700">Likely ask: {stakeholder.likelyAsk}</p>
                <p className="mt-2 text-sm text-slate-600">Evidence: {stakeholder.sourceEvidence}</p>
                <p className="mt-2 text-sm text-slate-500">Caveat: {stakeholder.caveat}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-2xl font-semibold text-slate-950">Acquisition Pathway Recommender</h3>
          <div className="mt-5 grid gap-3">
            {data.acquisitionPathways.map((path) => (
              <div key={path.name} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{path.name}</p>
                  <Badge>{path.fitScore}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600">{path.whyItFits}</p>
                <p className="mt-2 text-sm text-slate-700">Required maturity: {path.requiredMaturity}</p>
                <p className="mt-2 text-sm text-slate-700">Likely buyer: {path.likelyBuyer}</p>
                <p className="mt-2 text-sm text-slate-600">Next action: {path.nextAction}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1fr_1fr]">
        <Card className="p-6">
          <h3 className="text-2xl font-semibold text-slate-950">Budget & Strategy Alignment</h3>
          <p className="mt-2 text-sm text-slate-600">
            Budget alignment indicates leadership attention and potential resourcing; it is not a guarantee of funding.
          </p>
          <BudgetAlignmentChart items={data.budgetAlignment} />
          <div className="space-y-3">
            {data.budgetAlignment.map((item) => (
              <div key={item.title} className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <Badge>{Math.round(item.confidence * 100)}%</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.companyRelevance}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-2xl font-semibold text-slate-950">Evidence Panel</h3>
          <div className="mt-5 space-y-4">
            {data.evidence.map((item) => (
              <div key={`${item.sourceTitle}-${item.usedFor}`} className="rounded-[24px] bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{item.sourceTitle}</p>
                  <Badge>{Math.round(item.confidence * 100)}%</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.usedFor}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">{item.sourceType}</p>
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noreferrer" className="mt-2 block text-sm text-signal underline">
                    {item.url}
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className="p-6">
        <h3 className="text-2xl font-semibold text-slate-950">30/60/90-Day Adoption Plan</h3>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
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

      <Card className="p-6">
        <h3 className="text-xl font-semibold text-slate-950">Product Framing</h3>
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

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-800">{value}</p>
    </div>
  );
}
