"use client"
import React, { useState } from "react"
import { postJSON } from "@/lib/fetcher"
import { showToast } from "@/lib/toast"

interface OrderLeadModalProps {
  onClose: () => void
  courseId?: number
}

export default function OrderLeadModal({ onClose, courseId }: OrderLeadModalProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" })
  const [loading, setLoading] = useState(false)

  const validate = () => {
    if (!form.name.trim() || !form.email.trim()) {
      showToast("Vui lòng nhập đầy đủ thông tin!", "error")
      return false
    }
    if (form.phone && !/^[0-9]{8,15}$/.test(form.phone)) {
      showToast("Số điện thoại không hợp lệ", "error")
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      showToast("Email không hợp lệ", "error")
      return false
    }
    if (!courseId) {
      showToast("Thiếu thông tin khóa học", "error")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const res = await postJSON("/api/order", { ...form, courseId })
      if (res?.ok) {
        showToast("Đặt mua thành công!")
        onClose()
      } else {
        showToast(`Đặt mua thất bại: ${res.error || "Có lỗi xảy ra"}`, "error")
      }
    } catch (err: any) {
      showToast(`Đặt mua thất bại: ${err.message}`, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Đặt mua khóa học
        </h3>

        <input
          className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900"
          placeholder="Họ và tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="tel"
          className="mt-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900"
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          type="email"
          className="mt-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          onInvalid={(e) => {
            e.preventDefault();
            showToast("Email không hợp lệ", "error");
          }}
        />

        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-xl bg-black text-white px-4 py-2 font-medium cursor-pointer disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Thanh toán"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-gray-700 cursor-pointer"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  )
}
