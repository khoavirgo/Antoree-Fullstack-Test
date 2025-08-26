"use client"
import React, { useState } from "react"
import { postJSON } from "../../lib/fetcher"

export default function LeadModal({ onClose }: { onClose: () => void }) {
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
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-gray-700"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    )
}
