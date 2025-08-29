import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Tổng lượt truy cập (Event page = 'visit')
    const trafficCount = await prisma.event.count({
      where: { event: "visit" },
    });

    // Tổng số leads
    const leadsCount = await prisma.lead.count();

    // Tổng số đơn hàng và doanh thu
    const orders = await prisma.order.findMany({
      where: { status: "paid" },
      select: { amount: true },
    });
    const ordersCount = orders.length;
    const revenue = orders.reduce((sum, order) => sum + order.amount, 0);

    // Conversion rate
    const leadsConversion = trafficCount ? leadsCount / trafficCount : 0;
    const revenueConversion = trafficCount ? revenue / trafficCount : 0;

    return NextResponse.json({
      trafficCount,
      leadsCount,
      ordersCount,
      revenue,
      leadsConversion,
      revenueConversion,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
