// app/api/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req: Request) {
  try {
    const key = req.headers.get("x-admin-key") || "";
    const allow = key === (process.env.ADMIN_KEY || "dev123");
    if (!allow) {
      return NextResponse.json(
        { ok: false, error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const visits = await prisma.event.count({ where: { event: "visit" } });
    const leads = await prisma.lead.count();
    const orders = await prisma.order.count();
    const sum = await prisma.order.aggregate({ _sum: { amount: true } });
    const revenue = (sum._sum.amount || 0) as number;
    const crLead = visits > 0 ? leads / visits : 0;
    const crRev = visits > 0 ? revenue / visits : 0;

    return NextResponse.json({
      ok: true,
      data: { visits, leads, orders, revenue, crLead, crRev },
    });
  } catch (e) {
    console.error("/api/stats error:", e);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
