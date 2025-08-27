import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

function parseId(params: { id?: string }) {
  const id = Number(params?.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseId(params);
  if (!id)
    return NextResponse.json(
      { ok: false, error: "INVALID_ID" },
      { status: 400 }
    );

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course)
    return NextResponse.json(
      { ok: false, error: "NOT_FOUND" },
      { status: 404 }
    );

  return NextResponse.json({ ok: true, data: course });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseId(params);
  if (!id)
    return NextResponse.json(
      { ok: false, error: "INVALID_ID" },
      { status: 400 }
    );

  const body = await req.json();
  const data: any = {};
  if (body.title !== undefined) data.title = String(body.title).trim();
  if (body.description !== undefined)
    data.description =
      body.description === null ? null : String(body.description);
  if (body.price !== undefined) data.price = Number(body.price);
  if (body.active !== undefined) data.active = Boolean(body.active);

  try {
    const updated = await prisma.course.update({ where: { id }, data });
    return NextResponse.json({ ok: true, data: updated });
  } catch (e: any) {
    if (e?.code === "P2025")
      return NextResponse.json(
        { ok: false, error: "NOT_FOUND" },
        { status: 404 }
      );
    throw e;
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseId(params);
  if (!id)
    return NextResponse.json(
      { ok: false, error: "INVALID_ID" },
      { status: 400 }
    );

  try {
    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "P2025")
      return NextResponse.json(
        { ok: false, error: "NOT_FOUND" },
        { status: 404 }
      );
    throw e;
  }
}
