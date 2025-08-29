"use client";

import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LabelList,
} from "recharts";
import { User, DollarSign } from "lucide-react";

const ConversionCard = ({ title, value, icon: Icon, gradient }: any) => (
    <div
        className={`p-6 rounded-2xl shadow-lg text-white ${gradient} flex items-center justify-between`}
    >
        <div>
            <p className="text-sm font-medium">{title}</p>
            <h2 className="text-2xl font-bold mt-1">{value}</h2>
        </div>
        <div className="p-4 bg-white/20 rounded-full">
            <Icon size={32} />
        </div>
    </div>
);

const StatCard = ({ title, value, icon: Icon, gradient }: any) => (
    <div
        className={`p-6 rounded-2xl shadow-lg text-white ${gradient} flex items-center justify-between`}
    >
        <div>
            <p className="text-sm font-medium">{title}</p>
            <h2 className="text-2xl font-bold mt-1">{value}</h2>
        </div>
        <div className="p-4 bg-white/20 rounded-full">
            <Icon size={32} />
        </div>
    </div>
);

type QuarterlyData = {
    quarter: string;
    visits: number;
    leads: number;
    revenue: number;
};

export default function Dashboard() {
    const [quarterlyData, setQuarterlyData] = useState<QuarterlyData[]>([]);
    const [crLead, setCrLead] = useState(0);
    const [crRev, setCrRev] = useState(0);
    const [todayVisits, setTodayVisits] = useState(0);
    const [todayLeads, setTodayLeads] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Dữ liệu theo quý
                const resQuarter = await fetch("/api/stats/quarterly", {
                    headers: {
                        "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_KEY || "dev123",
                    },
                });
                const jsonQuarter = await resQuarter.json();
                if (jsonQuarter.ok) setQuarterlyData(jsonQuarter.data);

                // Dữ liệu tổng để tính conversion rate
                const resStats = await fetch("/api/stats", {
                    headers: {
                        "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_KEY || "dev123",
                    },
                });
                const jsonStats = await resStats.json();
                if (jsonStats.ok) {
                    setCrLead(
                        typeof jsonStats.data.crLead === "number"
                            ? +(jsonStats.data.crLead * 100).toFixed(2)
                            : 0
                    );
                    setCrRev(
                        typeof jsonStats.data.crRev === "number"
                            ? +jsonStats.data.crRev.toFixed(0)
                            : 0
                    );
                    setTodayVisits(jsonStats.data.visits ?? 0);
                    setTodayLeads(jsonStats.data.leads ?? 0);
                }
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            }
        };
        fetchData();
    }, []);

    if (!quarterlyData.length)
        return <div className="p-8">Loading stats...</div>;

    // Hàm format VNĐ
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
            val
        );

    return (
        <div className="p-8 space-y-8">
            {/* Grid 2 cột: Revenue + Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Biểu đồ Revenue */}
                <div className="bg-white rounded-2xl p-6 shadow-lg flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">Revenue by Quarter</h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={quarterlyData}>
                                <XAxis dataKey="quarter" />
                                <YAxis tickFormatter={(val) => `${val / 1_000_000}M`} />
                                <Tooltip formatter={(val: number) => formatCurrency(val)} />
                                <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]}>
                                    <LabelList
                                        dataKey="revenue"
                                        position="top"
                                        content={(props: any) => {
                                            const { x, y, value } = props;
                                            return (
                                                <text
                                                    x={x}
                                                    y={y - 5}
                                                    fill="#000"
                                                    textAnchor="middle"
                                                    fontSize={12}
                                                >
                                                    {value != null ? formatCurrency(value) : ""}
                                                </text>
                                            );
                                        }}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>


                {/* Cards Conversion Rate + Stats */}
                <div className="space-y-6">
                    <ConversionCard
                        title="Conversion Rate"
                        value={`${crLead}%`}
                        icon={User}
                        gradient="bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                    <ConversionCard
                        title="Revenue Conversion"
                        value={formatCurrency(crRev)}
                        icon={DollarSign}
                        gradient="bg-gradient-to-r from-green-400 to-teal-500"
                    />
                    <StatCard
                        title="Visits Today"
                        value={todayVisits}
                        icon={User}
                        gradient="bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                    <StatCard
                        title="Leads Today"
                        value={todayLeads}
                        icon={DollarSign}
                        gradient="bg-gradient-to-r from-green-400 to-teal-500"
                    />
                </div>
            </div>

            {/* Grid 2 cột: Visits + Leads */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visits */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">Visits by Quarter</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={quarterlyData}>
                            <XAxis dataKey="quarter" />
                            <YAxis />
                            <Tooltip formatter={(val: number) => val} />
                            <Bar dataKey="visits" fill="#10b981" radius={[6, 6, 0, 0]}>
                                <LabelList
                                    dataKey="visits"
                                    position="top"
                                    content={(props: any) => {
                                        const { x, y, value } = props;
                                        return (
                                            <text
                                                x={x}
                                                y={y - 5}
                                                fill="#000"
                                                textAnchor="middle"
                                                fontSize={12}
                                            >
                                                {value ?? ""}
                                            </text>
                                        );
                                    }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Leads */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">Leads by Quarter</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={quarterlyData}>
                            <XAxis dataKey="quarter" />
                            <YAxis />
                            <Tooltip formatter={(val: number) => val} />
                            <Bar dataKey="leads" fill="#f59e0b" radius={[6, 6, 0, 0]}>
                                <LabelList
                                    dataKey="leads"
                                    position="top"
                                    content={(props: any) => {
                                        const { x, y, value } = props;
                                        return (
                                            <text
                                                x={x}
                                                y={y - 5}
                                                fill="#000"
                                                textAnchor="middle"
                                                fontSize={12}
                                            >
                                                {value ?? ""}
                                            </text>
                                        );
                                    }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
