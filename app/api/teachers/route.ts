import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import cloudinary from "../../../lib/cloudinary"; // bạn cần tạo file lib/cloudinary.ts

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

    const teacher = await prisma.teacher.create({
      data: {
        name,
        email,
        phone,
        education,
        achievements,
        ...(avatarUrl ? { avatarUrl } : {}),
      },
    });

    return NextResponse.json({ ok: true, data: teacher });
  } catch (e) {
    console.error("POST /api/teachers", e);
    return NextResponse.json(
      { ok: false, error: "Failed to create teacher" },
      { status: 500 }
    );
  }
}
