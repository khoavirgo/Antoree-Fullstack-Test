"use client";

import React, { useEffect, useMemo, useState } from "react";

interface TeacherFormProps {
    teacher?: Teacher | null; // dữ liệu để edit (từ API), chỉ có avatarUrl (string)
    onSave: (data: TeacherFormData) => Promise<void> | void; // gửi dữ liệu có File
    onClose: () => void;
}

export default function TeacherForm({ teacher, onSave, onClose }: TeacherFormProps) {
    const [form, setForm] = useState<TeacherFormData>({
        name: "",
        email: "",
        phone: "",
        education: "",
        achievements: "",
        avatar: null,
    });

    // preview từ file mới chọn, fallback về avatarUrl của teacher
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (teacher) {
            setForm({
                name: teacher.name || "",
                email: teacher.email || "",
                phone: teacher.phone || "",
                education: teacher.education || "",
                achievements: teacher.achievements || "",
                avatar: null, // mặc định chưa chọn file mới
            });
            setPreviewUrl(teacher.avatarUrl || "");
        } else {
            setForm({
                name: "",
                email: "",
                phone: "",
                education: "",
                achievements: "",
                avatar: null,
            });
            setPreviewUrl("");
        }
    }, [teacher]);

    const mustRequireAvatar = useMemo(() => {
        // yêu cầu chọn file khi tạo mới
        // nếu edit thì không bắt buộc, trừ khi bạn muốn ép phải thay avatar mới
        return !teacher;
    }, [teacher]);

    const validate = () => {
        if (!form.name.trim()) {
            setErrors({ name: true });
            return false;
        }
        if (!form.email.trim()) {
            setErrors({ email: true });
            return false;
        }
        if (!form.phone.trim()) {
            setErrors({ phone: true });
            return false;
        }
        if (!form.education.trim()) {
            setErrors({ education: true });
            return false;
        }
        if (!form.achievements.trim()) {
            setErrors({ achievements: true });
            return false;
        }
        if (mustRequireAvatar && !form.avatar) {
            setErrors({ avatar: true });
            return false;
        }

        setErrors({});
        return true;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await onSave(form);
        } catch (err) {
            console.error(err);
            alert("Lỗi khi lưu giáo viên");
        } finally {
            setLoading(false);
        }
    };

    const renderError = (field: keyof (TeacherFormData & { avatar: File | null }), message: string) =>
        errors[field as string] && <p className="text-red-500 text-sm mt-1">{message}</p>;

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg flex flex-col max-h-[90vh]"
            >
                <h2 className="text-2xl font-semibold mb-4">
                    {teacher ? "Edit Teacher" : "Create Teacher"}
                </h2>

                <div className="space-y-4 overflow-y-auto pr-2 flex-1">
                    {/* Name */}
                    <label className="block">
                        Name
                        <input
                            value={form.name}
                            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                            className="mt-1 w-full rounded border px-3 py-2 focus:outline-blue-500"
                            placeholder="Nhập tên giáo viên"
                        />
                        {renderError("name", "Tên giáo viên không được để trống")}
                    </label>

                    {/* Email */}
                    <label className="block">
                        Email
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                            className="mt-1 w-full rounded border px-3 py-2 focus:outline-blue-500"
                            placeholder="Nhập email"
                        />
                        {renderError("email", "Email không được để trống")}
                    </label>

                    {/* Phone */}
                    <label className="block">
                        Phone
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                            className="mt-1 w-full rounded border px-3 py-2 focus:outline-blue-500"
                            placeholder="Nhập số điện thoại"
                        />
                        {renderError("phone", "Số điện thoại không được để trống")}
                    </label>

                    {/* Education */}
                    <label className="block">
                        Education
                        <textarea
                            value={form.education}
                            onChange={(e) => setForm((s) => ({ ...s, education: e.target.value }))}
                            className="mt-1 w-full rounded border px-3 py-2 focus:outline-blue-500"
                            placeholder="Nhập trình độ học vấn"
                        />
                        {renderError("education", "Trình độ học vấn không được để trống")}
                    </label>

                    {/* Achievements */}
                    <label className="block">
                        Achievements
                        <textarea
                            value={form.achievements}
                            onChange={(e) => setForm((s) => ({ ...s, achievements: e.target.value }))}
                            className="mt-1 w-full rounded border px-3 py-2 focus:outline-blue-500"
                            placeholder="Nhập thành tựu"
                        />
                        {renderError("achievements", "Thành tựu không được để trống")}
                    </label>

                    {/* Avatar Upload */}
                    <label className="block">
                        Avatar
                        <div className="flex items-center gap-3 mt-1">
                            <button
                                type="button"
                                onClick={() => document.getElementById("avatarInput")?.click()}
                                className="px-4 py-2 rounded border bg-gray-100 hover:bg-gray-200"
                            >
                                Choose File
                            </button>
                            {previewUrl && (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="h-20 w-20 object-cover rounded-full border"
                                />
                            )}
                        </div>
                        <input
                            id="avatarInput"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setForm((s) => ({ ...s, avatar: file }));
                                if (file) setPreviewUrl(URL.createObjectURL(file));
                            }}
                        />
                        {renderError("avatar", "Vui lòng chọn ảnh đại diện")}
                    </label>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded border hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : teacher ? "Save" : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
}
