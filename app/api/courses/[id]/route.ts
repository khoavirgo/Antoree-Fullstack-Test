import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

function parseId(params: { id?: string }) {
  const id = Number(params?.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: Number(id) },
    });

    if (!course) {
      return NextResponse.json(
        { ok: false, error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, data: course });
  } catch (e) {
    console.error("GET /api/courses/[id] error:", e);
    return NextResponse.json(
      { ok: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const body = await req.json();

    const updatedCourse = await prisma.course.update({
      where: { id: Number(id) },
      data: body,
    });

    return NextResponse.json({ ok: true, data: updatedCourse });
  } catch (e) {
    console.error("PUT /api/courses/[id] error:", e);
    return NextResponse.json(
      { ok: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await context.params;
  const id = parseId({ id: rawId });

  if (!id) {
    return NextResponse.json(
      { ok: false, error: "INVALID_ID" },
      { status: 400 }
    );
  }

  try {
    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json(
        { ok: false, error: "NOT_FOUND" },
        { status: 404 }
      );
    }
    throw e;
  }
}
