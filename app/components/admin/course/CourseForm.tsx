import React, { useState, useEffect } from "react";

interface Props {
    course?: Course | null;
    teachers: Teacher[];
    onSave: (data: Partial<Course>) => void;
    onClose: () => void;
}

export function CourseForm({ course, teachers, onSave, onClose }: Props) {
    const [form, setForm] = useState({
        sku: course?.sku || "",
        title: course?.title || "",
        description: course?.description || "",
        price: course?.price || 0,
        active: course?.active ?? true,
        teacherId: course?.teacherId ?? undefined,
    });

    const [errorField, setErrorField] = useState<string | null>(null);

    useEffect(() => {
        if (course) setForm({ ...course });
    }, [course]);

    const validate = () => {
        if (!form.sku.trim()) {
            setErrorField("sku");
            return false;
        }
        if (!form.title.trim()) {
            setErrorField("title");
            return false;
        }
        if (!form.description.trim()) {
            setErrorField("description");
            return false;
        }
        if (!form.teacherId) {
            setErrorField("teacherId");
            return false;
        }
        if (form.price <= 0) {
            setErrorField("price");
            return false;
        }
        setErrorField(null);
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) onSave(form);
    };

    const renderError = (field: string, message: string) => {
        if (errorField === field) {
            return <p className="text-red-600 text-sm mt-1">{message}</p>;
        }
        return null;
    };

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-white rounded-xl p-6 shadow-lg space-y-4"
            >
                <h2 className="text-2xl font-semibold mb-4">
                    {course ? "Edit Course" : "Create Course"}
                </h2>

                {/* SKU */}
                <label className="block">
                    SKU
                    <input
                        value={form.sku}
                        onChange={(e) => setForm((s) => ({ ...s, sku: e.target.value }))}
                        className="mt-1 w-full rounded border px-3 py-2 focus:outline-blue-500"
                        disabled={!!course}
                        placeholder="Nhập mã khóa học"
                    />
                    {renderError("sku", "Mã khóa học không được để trống")}
                </label>

                {/* Title */}
                <label className="block">
                    Title
                    <input
                        value={form.title}
                        onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                        className="mt-1 w-full rounded border px-3 py-2 focus:outline-blue-500"
                        placeholder="Nhập tên khóa học"
                    />
                    {renderError("title", "Tên khóa học không được để trống")}
                </label>

                {/* Description */}
                <label className="block">
                    Description
                    <textarea
                        value={form.description}
                        onChange={(e) =>
                            setForm((s) => ({ ...s, description: e.target.value }))
                        }
                        className="mt-1 w-full rounded border px-3 py-2 focus:outline-blue-500"
                        rows={4}
                        placeholder="Mô tả khóa học..."
                    />
                    {renderError("description", "Mô tả không được để trống")}
                </label>

                {/* Teacher */}
                <label className="block">
                    Teacher
                    <select
                        value={form.teacherId ?? ""}
                        onChange={(e) =>
                            setForm((s) => ({ ...s, teacherId: Number(e.target.value) }))
                        }
                        className="mt-1 w-full rounded border px-3 py-2 focus:outline-blue-500"
                    >
                        <option value="">-- Chọn giáo viên --</option>
                        {teachers.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                    {renderError("teacherId", "Bạn phải chọn một giáo viên")}
                </label>

                {/* Price */}
                <label className="block">
                    Price
                    <div className="mt-1 flex">
                        <input
                            type="number"
                            min={0}
                            step={1000}
                            value={form.price}
                            onChange={(e) =>
                                setForm((s) => ({ ...s, price: Number(e.target.value) || 0 }))
                            }
                            className="w-full rounded-l border px-3 py-2 focus:outline-blue-500"
                        />
                        <span className="bg-gray-100 border border-l-0 rounded-r px-3 py-2 flex items-center text-gray-600">
                            VND
                        </span>
                    </div>
                    {renderError("price", "Giá tiền phải lớn hơn 0")}
                </label>

                {/* Active */}
                <label className="flex items-center gap-2 text-sm mt-2">
                    <input
                        type="checkbox"
                        checked={form.active}
                        onChange={(e) =>
                            setForm((s) => ({ ...s, active: e.target.checked }))
                        }
                        className="accent-blue-600"
                    />
                    Active
                </label>

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
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {course ? "Save" : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
}
