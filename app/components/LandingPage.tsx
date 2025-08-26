"use client"
import React, { useEffect, useMemo, useState } from "react"

// === Helper: simple fetch wrapper ===
async function postJSON(url: string, data: any) {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        return await res.json().catch(() => ({}))
    } catch (e: any) {
        console.error(e)
        return { ok: false, error: e?.message }
    }
}

// === Lead Modal (client) ===
function LeadModal({ onClose }: { onClose: () => void }) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    async function submit() {
        const payload = { name, email, ts: Date.now(), source: "landing" }
        await postJSON("/api/leads", payload)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/30">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow">
                <h3 className="text-lg font-semibold text-gray-900">Đăng ký nhận tư vấn miễn phí</h3>
                <input
                    className="mt-4 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900"
                    placeholder="Họ và tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className="mt-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="mt-5 flex gap-3">
                    <button
                        onClick={submit}
                        className="flex-1 rounded-xl bg-black text-white px-4 py-2 font-medium"
                    >
                        Gửi
                    </button>
                    <button onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2 text-gray-700">
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    )
}

// === Landing Page component (client) ===
export default function LandingPage() {
    const [openLead, setOpenLead] = useState(false)
    const [toast, setToast] = useState<{ msg: string } | null>(null)

    const plans = useMemo(
        () => [
            {
                name: "Starter",
                price: "0₫",
                tagline: "Dùng thử 7 ngày",
                features: ["2 bài học nền tảng", "1 đề mini test", "Group hỗ trợ cộng đồng"],
                ctaLabel: "Bắt đầu miễn phí",
            },
            {
                name: "Standard",
                price: "1.290.000₫",
                tagline: "Lộ trình TOEIC 700+ trong 8 tuần",
                features: [
                    "32 video bài giảng",
                    "8 đề thi chuẩn + chấm tự động",
                    "Feedback hàng tuần từ mentor",
                    "Flashcard & tracker tiến độ",
                ],
                ctaLabel: "Đăng ký Standard",
                highlighted: true,
            },
            {
                name: "Premium",
                price: "2.890.000₫",
                tagline: "Cam kết hoàn tiền nếu không tăng ≥150 điểm",
                features: [
                    "Mọi tính năng Standard",
                    "1-1 coaching (4 buổi)",
                    "Sửa bài chi tiết + lộ trình cá nhân hóa",
                    "Mock interview + định hướng học thuật",
                ],
                ctaLabel: "Đăng ký Premium",
            },
        ],
        []
    )

    useEffect(() => {
        const key = "lp_traffic_seen"
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, "1")
            postJSON("/api/track", { event: "visit", ts: Date.now(), page: "landing" })
        }
    }, [])

    const track = (event: string, meta: any = {}) => {
        postJSON("/api/track", { event, ts: Date.now(), page: "landing", ...meta })
    }

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
                <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                    <a href="#top" className="font-bold text-lg text-gray-900">
                        English Lab
                    </a>
                    <nav className="hidden md:flex gap-6 text-sm text-gray-700">
                        <a href="/admin" className="hover:text-gray-900">
                            Dashboard
                        </a>
                    </nav>
                    <button
                        onClick={() => setOpenLead(true)}
                        className="rounded-2xl border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 transition text-gray-900"
                    >
                        Đăng ký tư vấn
                    </button>
                </div>
            </header>

            <section id="pricing" className="mx-auto max-w-6xl px-4 py-16">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Chọn gói học phù hợp</h2>
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                    {plans.map((p) => (
                        <div key={p.name} className="rounded-2xl border p-6 bg-gray-50 border-gray-200">
                            <div className="flex items-baseline justify-between">
                                <div className="text-lg font-semibold text-gray-800">{p.name}</div>
                                <div className="text-xl font-bold text-gray-900">{p.price}</div>
                            </div>
                            <div className="mt-1 text-sm text-gray-600">{p.tagline}</div>
                            <ul className="mt-4 space-y-2 text-sm text-gray-700">
                                {p.features.map((f) => (
                                    <li key={f}>{f}</li>
                                ))}
                            </ul>
                            <button
                                onClick={() => {
                                    setOpenLead(true)
                                    track("cta_choose_plan", { plan: p.name })
                                }}
                                className="mt-6 w-full px-5 py-3 rounded-xl border border-gray-300 bg-black text-white hover:opacity-90"
                            >
                                {p.ctaLabel}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {openLead && <LeadModal onClose={() => setOpenLead(false)} />}
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-black text-white px-4 py-2 shadow-lg">
                    {toast.msg}
                </div>
            )}
        </div>
    )
}
