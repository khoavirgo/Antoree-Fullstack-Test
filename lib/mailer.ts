import nodemailer from "nodemailer";

type SendArgs = { to: string; subject: string; html?: string; text?: string };

async function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT
    ? Number(process.env.SMTP_PORT)
    : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && port && user && pass) {
    // production/dev with real SMTP (Gmail App Password)
    return nodemailer.createTransport({
      host,
      port,
      secure: String(process.env.SMTP_SECURE) === "true" || port === 465,
      auth: { user, pass },
    });
  }

  // fallback: ethereal test account (dev only)
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
}

export async function sendMail(opts: SendArgs) {
  const transporter = await createTransporter();
  const from = process.env.SMTP_FROM || `"English Lab" <no-reply@example.com>`;
  const info = await transporter.sendMail({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });

  // preview URL only exists for Ethereal
  const preview = (nodemailer as any).getTestMessageUrl
    ? (nodemailer as any).getTestMessageUrl(info)
    : null;
  return { info, preview };
}
