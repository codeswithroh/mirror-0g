import { NextRequest, NextResponse } from "next/server";
import { uploadPersonaToStorage, type PersonaData } from "@/lib/0g-storage";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { personaData: PersonaData };

    if (!body.personaData?.name) {
      return NextResponse.json({ error: "Missing persona data" }, { status: 400 });
    }

    const result = await uploadPersonaToStorage(body.personaData);
    return NextResponse.json(result);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Upload error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
