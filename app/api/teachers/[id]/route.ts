import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import cloudinary from "@/lib/cloudinary";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    if (isNaN(id))
      return NextResponse.json(
        { ok: false, error: "INVALID_ID" },
        { status: 400 }
      );

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const education = formData.get("education") as string;
    const achievements = formData.get("achievements") as string;

    const avatarFile = formData.get("avatar");
    let avatarUrl: string | undefined;
    if (avatarFile instanceof File && avatarFile.size > 0) {
      const buffer = Buffer.from(await avatarFile.arrayBuffer());
      const uploadRes = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "teachers" }, (err, result) => {
              if (err || !result) return reject(err);
              resolve(result as { secure_url: string });
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
        ...(avatarUrl ? { avatarUrl } : {}),
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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  await prisma.teacher.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
