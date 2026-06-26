import { NextResponse } from "next/server";
import { generateSearchPlan } from "@/lib/agents/generateSearchPlan";
import { CompanyProfile } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CompanyProfile;
    const data = generateSearchPlan(payload);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Search plan generation failed." }, { status: 500 });
  }
}
