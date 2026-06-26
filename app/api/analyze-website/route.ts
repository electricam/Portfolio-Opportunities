import { NextResponse } from "next/server";
import { analyzeWebsite } from "@/lib/radar";
import { DashboardRequest } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as DashboardRequest;
    if (!payload.websiteUrl) {
      return NextResponse.json({ error: "Website URL is required." }, { status: 400 });
    }

    const data = await analyzeWebsite(payload);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Website analysis failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
