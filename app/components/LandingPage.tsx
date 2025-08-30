"use client"
import React, { useEffect, useState } from "react"
import LeadModal from "./LeadModal";
import OrderLeadModal from "./OrderLeadModal";
import { postJSON, getJSON } from "@/lib/fetcher";
import { X } from "lucide-react";

export default function LandingPage() {
    const [openLead, setOpenLead] = useState(false)
    const [toast, setToast] = useState<{ msg: string } | null>(null)
    const [plans, setPlans] = useState<Plan[]>([])
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

    // Hàm track chung
    const track = (event: string, meta: Record<string, unknown> = {}) => {
        postJSON("/api/track", { event, ts: Date.now(), page: "landing", ...meta })
    }

    // Wrapper để track click
    const handleTrackClick = (
        event: string,
        meta: Record<string, unknown> = {},
        action?: () => void
    ) => {
        track(event, meta);
        if (action) action();
    };

    useEffect(() => {
        async function load() {
            const res = await getJSON("/api/courses");
            if (res?.ok && Array.isArray(res.data)) {
                const mapped = res.data.map((c: any) => ({
                    id: c.id,
                    name: c.title,
                    price: c.price === 0 ? "0₫" : `${c.price.toLocaleString("vi-VN")}₫`,
                    tagline: c.description ? (c.description.length > 120 ? c.description.slice(0, 117) + "..." : c.description) : "",
                    features: [],
                    ctaLabel: "Đăng ký nhận tư vấn",
                }));
                setPlans(mapped);
            }
        }
        load();
    }, []);

    useEffect(() => {
        const key = "lp_traffic_seen"
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, "1")
            track("visit")
        }
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-900">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-gray-200">
                <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                    <a
                        href="#top"
                        className="font-extrabold text-xl text-indigo-600 tracking-tight"
                        onClick={() => handleTrackClick("logo_click")}
                    >
                        English Lab
                    </a>
                    <button
                        onClick={() => handleTrackClick("cta_header_consult", {}, () => setOpenLead(true))}
                        className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium hover:bg-indigo-50 hover:border-indigo-300 transition text-gray-900 cursor-pointer"
                    >
                        Đăng ký nhận tư vấn
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="mx-auto max-w-6xl px-4 pt-20 pb-16 text-center">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                    Nâng trình tiếng Anh của bạn <br /> với <span className="text-indigo-600">English Lab</span>
                </h1>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
                    Lộ trình học thông minh, giảng viên đồng hành, và cam kết kết quả thực tế.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                    <button
                        onClick={() => handleTrackClick("cta_hero_start", {}, () => setOpenLead(true))}
                        className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-md transition cursor-pointer"
                    >
                        Bắt đầu ngay
                    </button>
                    <a
                        href="#pricing"
                        className="px-6 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition"
                        onClick={() => handleTrackClick("cta_hero_view_pricing")}
                    >
                        Xem các gói học
                    </a>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="mx-auto max-w-6xl px-4 py-16">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900">Chọn gói học phù hợp</h2>
                <div className="mt-10 grid md:grid-cols-3 gap-6">
                    {plans.map((p) => (
                        <div key={p.id} className="rounded-2xl border p-6 bg-gray-50 border-gray-200 shadow hover:shadow-lg transition">
                            <div className="flex items-baseline justify-between">
                                <div className="text-lg font-semibold text-gray-800">{p.name}</div>
                                <div className="text-xl font-bold text-gray-900">{p.price}</div>
                            </div>
                            <div className="mt-1 text-sm text-gray-600">{p.tagline}</div>

                            <div className="mt-3 flex items-center gap-2 text-yellow-500">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <span key={i}>★</span>
                                ))}
                                <span className="text-gray-600 text-sm">({Math.floor(Math.random() * 50) + 10} reviews)</span>
                            </div>

                            <ul className="mt-4 space-y-2 text-sm text-gray-700">
                                {p.features.map((f) => (
                                    <li key={f}>• {f}</li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleTrackClick("cta_plan_consult", { plan: p.name }, () => setOpenLead(true))}
                                className="mt-6 w-full px-5 py-3 rounded-xl border border-gray-300 bg-black text-white hover:opacity-90 transition cursor-pointer"
                            >
                                {p.ctaLabel}
                            </button>

                            <button
                                onClick={() => handleTrackClick("cta_plan_buy", { plan: p.name }, () => {
                                    setSelectedCourse(p.id);
                                    setOpenLead(true);
                                })}
                                className="mt-2 w-full px-5 py-3 rounded-xl border border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer"
                            >
                                Đặt mua
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Modal đăng ký tư vấn*/}
            {openLead && <LeadModal onClose={() => {
                track("modal_consult_close")
                setOpenLead(false)
            }} />}

            {/* Modal đặt mua */}
            {openLead && selectedCourse && (
                <OrderLeadModal
                    onClose={() => {
                        track("modal_order_close", { courseId: selectedCourse })
                        setOpenLead(false);
                        setSelectedCourse(null);
                    }}
                    courseId={selectedCourse}
                    setToast={setToast}
                />
            )}

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-black text-white px-4 py-3 shadow-lg flex items-center gap-2">
                    <span>{toast.msg}</span>
                    <button
                        onClick={() => handleTrackClick("toast_close", {}, () => setToast(null))}
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                </div>
            )}
        </div>
    )
}
