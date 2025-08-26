// app/api/track/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ev = String(body.event || "unknown");
    const page = String(body.page || "landing");
    await prisma.event.create({ data: { event: ev, page, meta: body } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("/api/track error:", e);
    return NextResponse.json({ ok: false, error: "DB_ERROR" }, { status: 500 });
  }
}
