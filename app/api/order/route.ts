// api/order/route.ts
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";

function formatCurrency(amount: number): string {
  return amount.toLocaleString("vi-VN") + "đ";
}

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

    // Kiểm tra hoặc tạo lead
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

    // Kiểm tra khóa học
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
    });
    if (!course) {
      return new Response(
        JSON.stringify({ ok: false, error: "Course not found" }),
        { status: 404 }
      );
    }

    // Tạo order
    const order = await prisma.order.create({
      data: {
        leadId: lead.id,
        courseId: course.id,
        amount: course.price,
        status: "paid",
        provider: "mock",
      },
    });

    // ---- Gửi email xác nhận ----
    try {
      const subject = "Xác nhận đặt mua khóa học tại English Lab";
      const formattedPrice = formatCurrency(course.price);
      const html = `
        <p>Xin chào <strong>${name}</strong>,</p>
        <p>Cảm ơn bạn đã đặt mua khóa học <strong>${
          course.title
        }</strong> tại English Lab.</p>
        <p>Chúng tôi sẽ sớm liên hệ để hướng dẫn chi tiết.</p>
        <p><b>Thông tin đơn hàng:</b></p>
        <ul>
          <li>Email: ${email}</li>
          ${phone ? `<li>Số điện thoại: ${phone}</li>` : ""}
          <li>Khóa học: ${course.title}</li>
          <li>Số tiền: ${formattedPrice} VND</li>
        </ul>
        <p>Trân trọng,<br/>English Lab</p>
      `;

      await sendMail({
        to: email,
        subject,
        html,
        text: `Cảm ơn ${name} đã đặt khóa học ${course.title} tại English Lab.`,
      });
    } catch (mailErr) {
      console.error("Gửi mail thất bại:", mailErr);
    }

    return new Response(JSON.stringify({ ok: true, order }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
    });
  }
}
