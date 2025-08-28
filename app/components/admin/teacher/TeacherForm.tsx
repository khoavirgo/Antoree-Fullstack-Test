import React, { useState, useEffect } from "react";

interface Props {
    teacher?: Teacher | null;
    onSave: (data: Partial<Teacher>) => void;
    onClose: () => void;
}

export function TeacherForm({ teacher, onSave, onClose }: Props) {
    const [form, setForm] = useState({
        name: teacher?.name || "",
        email: teacher?.email || "",
    });

    const [errorField, setErrorField] = useState<string | null>(null);

    useEffect(() => {
        if (teacher) setForm({ ...teacher });
    }, [teacher]);

    const validate = () => {
        if (!form.name.trim()) {
            setErrorField("name");
            return false;
        }
        if (!form.email.trim()) {
            setErrorField("email");
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
                className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg space-y-4"
            >
                <h2 className="text-2xl font-semibold mb-4">
                    {teacher ? "Edit Teacher" : "Create Teacher"}
                </h2>

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
                        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                    >
                        {teacher ? "Save" : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
}
