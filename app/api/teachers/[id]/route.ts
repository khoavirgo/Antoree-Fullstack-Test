import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const name = body.name?.trim();
    const email = body.email?.trim();

    const teacher = await prisma.teacher.update({
      where: { id },
      data: { ...(name && { name }), ...(email !== undefined && { email }) },
    });

    return NextResponse.json({ ok: true, data: teacher });
  } catch (e) {
    console.error("PUT /api/teachers/:id error", e);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    await prisma.teacher.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/teachers/:id error", e);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
