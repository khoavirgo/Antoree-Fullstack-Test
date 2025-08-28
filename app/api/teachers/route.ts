import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET /api/teachers
export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, data: teachers });
  } catch (e) {
    console.error("GET /api/teachers", e);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}

// POST /api/teachers
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = body.email ? String(body.email).trim() : "";

    if (!name) {
      return NextResponse.json(
        { ok: false, error: "INVALID_INPUT" },
        { status: 400 }
      );
    }

    const teacher = await prisma.teacher.create({
      data: {
        name,
        email,
      },
    });

    return NextResponse.json({ ok: true, data: teacher }, { status: 201 });
  } catch (e) {
    console.error("POST /api/teachers error", e);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
