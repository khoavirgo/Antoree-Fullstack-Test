"use client"
import React, { useState } from "react"
import { postJSON } from "../../lib/fetcher"
import { showToast } from "../../lib/toast"

interface LeadModalProps {
    onClose: () => void
}

export default function LeadModal({ onClose }: LeadModalProps) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState(false)

    const validate = () => {
        if (!name.trim() || !email.trim()) {
            showToast("Vui lòng nhập đầy đủ thông tin", "error")
            return false
        }
        if (phone && !/^[0-9]{8,15}$/.test(phone)) {
            showToast("Số điện thoại không hợp lệ", "error")
            return false
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            showToast("Email không hợp lệ", "error")
            return false
        }
        return true
    }

    async function submit() {
        if (!validate()) return

        setLoading(true)
        try {
            const payload = { name, email, phone, ts: Date.now(), source: "landing" }
            const res = await postJSON("/api/leads", payload)

            if (res?.ok) {
                showToast("Đăng ký thành công! Vui lòng kiểm tra email.")
                onClose()
            } else {
                showToast("Đăng ký thất bại!", "error")
            }
        } catch (err: any) {
            showToast(`Đăng ký thất bại: ${err.message}`, "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/30">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow">
                <h3 className="text-lg font-semibold text-gray-900">
                    Đăng ký nhận tư vấn miễn phí
                </h3>
                <input
                    className="mt-4 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900"
                    placeholder="Họ và tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className="mt-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                        disabled={loading}
                        className="flex-1 rounded-xl bg-black text-white px-4 py-2 font-medium cursor-pointer disabled:opacity-50"
                    >
                        {loading ? "Đang gửi..." : "Đăng ký"}
                    </button>
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-gray-700 cursor-pointer"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    )
}
