import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const source = String(body.source || "landing");

    // validation
    const emailOk = email.includes("@") && email.includes(".");
    if (!name || !emailOk) {
      return NextResponse.json(
        { ok: false, error: "INVALID_INPUT" },
        { status: 400 }
      );
    }

    // save lead
    const lead = await prisma.lead.create({
      data: { name, email, phone, source },
    });

    // prepare email content
    const subject = "Cảm ơn bạn đã đăng ký tư vấn — English Lab";
    const html = `
      <p>Chào ${name || ""},</p>
      <p>Cảm ơn bạn đã đăng ký tư vấn miễn phí tại English Lab. Chúng tôi sẽ liên hệ trong thời gian sớm nhất.</p>
      <p><strong>Thông tin bạn gửi:</strong></p>
      <ul>
        <li>Email: ${email}</li>
        ${phone ? `<li>Phone: ${phone}</li>` : ""}
        <li>Nguồn: ${source}</li>
      </ul>
      <p>Trân trọng,<br/>English Lab</p>
    `;
    // send email (try/catch so sending failure doesn't break lead creation)
    try {
      const { info, preview } = await sendMail({
        to: email,
        subject,
        html,
        text: `Cảm ơn ${name}`,
      });
      console.log("Lead email sent:", info?.messageId, "preview:", preview);
    } catch (mailErr) {
      console.error("Failed to send lead email:", mailErr);
      // don't return error to client; lead was saved
    }

    // record event optionally
    await prisma.event.create({
      data: { event: "lead_created", page: source, meta: { email, phone } },
    });

    return NextResponse.json({ ok: true, data: lead }, { status: 201 });
  } catch (e) {
    console.error("POST /api/leads error", e);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
