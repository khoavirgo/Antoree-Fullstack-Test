import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, courseId } = body;

    if (!name || !email || !courseId) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Xử lý DB tương tự như trước
    let lead = await prisma.lead.findFirst({ where: { email: String(email) } });
    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          name: String(name),
          email: String(email),
          phone: phone ? String(phone) : null,
        },
      });
    }

    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
    });
    if (!course)
      return new Response(
        JSON.stringify({ ok: false, error: "Course not found" }),
        { status: 404 }
      );

    const order = await prisma.order.create({
      data: {
        leadId: lead.id,
        courseId: course.id,
        amount: course.price,
        status: "paid",
        provider: "mock",
      },
    });

    return new Response(JSON.stringify({ ok: true, order }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
    });
  }
}
