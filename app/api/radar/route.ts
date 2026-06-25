import { NextResponse } from "next/server";
import { generateRadar } from "@/lib/radar";
import { IntakePayload } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as IntakePayload;

    if (!payload.companyName || !payload.companyDescription) {
      return NextResponse.json({ error: "Company name and description are required." }, { status: 400 });
    }

    const radar = await generateRadar(payload);
    return NextResponse.json(radar);
  } catch {
    return NextResponse.json({ error: "Unable to generate radar." }, { status: 500 });
  }
}
