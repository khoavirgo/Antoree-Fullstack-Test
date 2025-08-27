import { NextResponse } from "next/server";

export function requireAdmin(req: Request) {
  const ADMIN_KEY = process.env.ADMIN_KEY || "dev123";

  const key = (req as any).headers?.get?.("x-admin-key") ?? "";
  if (!key || key !== ADMIN_KEY) {
    return NextResponse.json(
      { ok: false, error: "UNAUTHORIZED" },
      { status: 401 }
    );
  }
  return null;
}
