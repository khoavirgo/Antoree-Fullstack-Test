import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const key = req.headers.get("x-admin-key") || "";
    if (key !== (process.env.ADMIN_KEY || "dev123")) {
      return NextResponse.json(
        { ok: false, error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    // Lấy tất cả sự kiện visit và leads, revenue
    const visits = await prisma.event.findMany({
      where: { event: "visit" },
      select: { createdAt: true },
    });

    const leads = await prisma.lead.findMany({ select: { createdAt: true } });

    const orders = await prisma.order.findMany({
      where: { status: "paid" },
      select: { amount: true, createdAt: true },
    });

    // Chia dữ liệu theo quý
    const quarters = ["Q1", "Q2", "Q3", "Q4"].map((q) => ({
      quarter: q,
      visits: 0,
      leads: 0,
      revenue: 0,
    }));

    const getQuarter = (date: Date) => {
      const month = date.getMonth(); // 0-11
      if (month < 3) return 0; // Q1
      if (month < 6) return 1; // Q2
      if (month < 9) return 2; // Q3
      return 3; // Q4
    };

    visits.forEach((v) => {
      quarters[getQuarter(new Date(v.createdAt))].visits += 1;
    });

    leads.forEach((l) => {
      quarters[getQuarter(new Date(l.createdAt))].leads += 1;
    });

    orders.forEach((o) => {
      quarters[getQuarter(new Date(o.createdAt))].revenue += o.amount;
    });

    return NextResponse.json({ ok: true, data: quarters });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
