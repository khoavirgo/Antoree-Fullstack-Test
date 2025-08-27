import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.set(
    "Set-Cookie",
    `admin_key=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
  );
  return res;
}
