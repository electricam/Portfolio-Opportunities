import { NextResponse } from "next/server";
import { generateDashboard } from "@/lib/radar";
import { DashboardRequest } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as DashboardRequest;

    if (!payload.websiteUrl) {
      return NextResponse.json({ error: "Website URL is required." }, { status: 400 });
    }

    const dashboard = await generateDashboard(payload);
    return NextResponse.json(dashboard);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate dashboard.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
