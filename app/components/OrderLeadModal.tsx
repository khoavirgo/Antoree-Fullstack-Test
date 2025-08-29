"use client";

import React, { useState } from "react";
import { postJSON } from "@/lib/fetcher";
import { X } from "lucide-react";

interface LeadModalProps {
  onClose: () => void;
  courseId?: number; // id của khóa học muốn đặt mua
  setToast: (toast: { msg: string } | null) => void;
}

export default function OrderLeadModal({ onClose, courseId, setToast }: LeadModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const showToast = (msg: string, duration = 2500) => {
    setToast({ msg });
    setTimeout(() => setToast(null), duration); // tự động ẩn sau 2.5 giây
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !courseId) {
      showToast("Vui lòng nhập đủ thông tin");
      return;
    }

    setLoading(true);
    try {
      const res = await postJSON("/api/order", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        courseId,
      });

      if (res?.ok) {
        showToast(`Đặt mua thành công khóa học!`);
        onClose();
      } else {
        showToast(`Đặt mua thất bại: ${res.error}`);
      }
    } catch (err: any) {
      showToast(`Đặt mua thất bại: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg flex flex-col"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Đặt mua khóa học</h2>
          <button type="button" onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <label className="block mb-3">
          Họ tên
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded border px-3 py-2 focus:outline-blue-500"
            required
          />
        </label>

        <label className="block mb-3">
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 w-full rounded border px-3 py-2 focus:outline-blue-500"
            required
          />
        </label>

        <label className="block mb-3">
          Số điện thoại
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mt-1 w-full rounded border px-3 py-2 focus:outline-blue-500"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
        >
          {loading ? "Đang xử lý..." : "Thanh toán"}
        </button>
      </form>
    </div>
  );
}
