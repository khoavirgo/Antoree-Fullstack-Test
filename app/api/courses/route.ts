import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, data: courses });
  } catch (e) {
    console.error("GET /api/courses", e);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const title = String(body.title || "").trim();
    const sku = String(body.sku || "").trim();
    const description =
      body.description !== undefined ? String(body.description).trim() : null;
    const price = Number(body.price ?? 0);

    if (!title || !sku || !Number.isInteger(price) || price < 0) {
      return NextResponse.json(
        { ok: false, error: "INVALID_INPUT" },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: { title, sku, description, price, active: body.active ?? true },
    });

    return NextResponse.json({ ok: true, data: course }, { status: 201 });
  } catch (e: any) {
    if (e?.code === "P2002") {
      return NextResponse.json(
        { ok: false, error: "DUPLICATE_SKU" },
        { status: 409 }
      );
    }
    console.error("POST /api/courses error", e);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
