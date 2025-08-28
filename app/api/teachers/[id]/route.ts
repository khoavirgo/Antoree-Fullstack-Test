import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import cloudinary from "@/lib/cloudinary";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const education = formData.get("education") as string;
    const achievements = formData.get("achievements") as string;
    const file = formData.get("avatar") as File | null;

    let avatarUrl: string | undefined;

    if (file && (file as any).size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadRes = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "teachers" }, (error, result) => {
              if (error || !result) return reject(error);
              resolve(result as any);
            })
            .end(buffer);
        }
      );

      avatarUrl = uploadRes.secure_url;
    }

    const updated = await prisma.teacher.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        education,
        achievements,
        ...(avatarUrl ? { avatarUrl } : {}), // chỉ cập nhật avatar nếu có upload mới
      },
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (e) {
    console.error("PUT /api/teachers/[id]", e);
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
