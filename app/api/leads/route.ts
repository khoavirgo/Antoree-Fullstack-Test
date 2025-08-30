//api/leads/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const source = String(body.source || "Landing page English Lab");

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
    const subject = "Cảm ơn bạn đã đăng ký tư vấn tại English Lab!";
    const html = `
  <p>Xin chào <strong>${name}</strong>,</p>
  <p>Cảm ơn bạn đã đăng ký tư vấn miễn phí tại <strong>English Lab</strong>. Chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất để hỗ trợ và tư vấn lộ trình học phù hợp.</p>
  
  <p><strong>Thông tin bạn đã cung cấp:</strong></p>
  <ul>
    <li>Email: ${email}</li>
    ${phone ? `<li>Điện thoại: ${phone}</li>` : ""}
    <li>Nguồn: ${source}</li>
  </ul>
  
  <p>Chúng tôi xin được gửi tặng bạn một số tài liệu tiếng Anh như một lời cảm ơn vì sự quan tâm của bạn đến nền tảng của chúng tôi.</p>
  
  <p style="text-align:center; margin:20px 0;">
    <a href="https://drive.google.com/drive/folders/1LiaT1n7tQX1WkDYSAW09wpfzCDOy35os?usp=sharing"
       style="display:inline-block; background-color:#2563eb; color:#ffffff; 
              padding:12px 24px; border-radius:8px; text-decoration:none; 
              font-weight:bold; font-size:16px;">
      📥 Tải tài liệu
    </a>
  </p>
  
  <p>Nếu có thắc mắc hoặc cần hỗ trợ ngay, bạn có thể liên hệ với chúng tôi qua email 
     <a href="mailto:ndangkhoa567@gmail.com">ndangkhoa567@gmail.com</a> hoặc số hotline <strong>0914 932 098</strong>.</p>
  
  <p>Trân trọng,<br/><strong>English Lab Team</strong></p>
`;

    const text = `
  Cảm ơn ${name} đã đăng ký tư vấn tại English Lab.
  Thông tin bạn cung cấp:
  - Email: ${email}
  ${phone ? `- Điện thoại: ${phone}` : ""}
  - Nguồn: ${source}

  Chúng tôi sẽ liên hệ bạn sớm. Mọi thắc mắc vui lòng liên hệ ndangkhoa567@gmail.com
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
