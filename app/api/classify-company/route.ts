import { NextResponse } from "next/server";
import { classifyCompany } from "@/lib/agents/classifyCompany";
import { WebsiteExtract } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as WebsiteExtract;
    const data = await classifyCompany(payload);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Company classification failed." }, { status: 500 });
  }
}
