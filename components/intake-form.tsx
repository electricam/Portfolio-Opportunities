"use client";

import { useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function IntakeForm() {
  const router = useRouter();
  const [websiteUrl, setWebsiteUrl] = useState("https://reveng.ai");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams({ websiteUrl });
    router.push((`/radar?${params.toString()}` as Route));
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-8 sm:px-6 lg:px-8">
      <Card className="w-full p-8 lg:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex w-fit items-center gap-3">
            <div className="rounded-full bg-flare/10 p-3 text-flare">
              <Radar className="size-5" />
            </div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Gov Adoption Radar</p>
          </div>
          <h1 className="mt-6 text-5xl font-semibold text-slate-950">Gov Adoption Radar</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Paste a company website. The system identifies what the company does, where it fits in government, and which live opportunities, offices, and stakeholders are worth pursuing first.
          </p>

          <form className="mt-10" onSubmit={handleSubmit}>
            <label className="block text-left">
              <span className="sr-only">Enter a company website</span>
              <input
                type="url"
                value={websiteUrl}
                onChange={(event) => setWebsiteUrl(event.target.value)}
                className="w-full rounded-full border border-slate-200 bg-white px-6 py-4 text-base outline-none ring-0 transition focus:border-signal"
                placeholder="https://reveng.ai"
                required
              />
            </label>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              Gov Adoption Radar analyzes the company website, classifies the capability, searches source-backed government opportunities, and produces a customer-discovery map.
            </p>

            <Button type="submit" className="mt-6 w-full gap-2 rounded-full py-4 text-base">
              <Radar className="size-4" />
              Generate Government Adoption Radar
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
