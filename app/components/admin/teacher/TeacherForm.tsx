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

    useEffect(() => { if (teacher) setForm({ ...teacher }); }, [teacher]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-4">{teacher ? "Edit Teacher" : "Create Teacher"}</h2>
                <label className="text-sm block mb-2">
                    Name
                    <input
                        value={form.name}
                        onChange={e => setForm(s => ({ ...s, name: e.target.value }))}
                        className="mt-1 w-full rounded border px-3 py-2"
                    />
                </label>
                <label className="text-sm block mb-2">
                    Email
                    <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(s => ({ ...s, email: e.target.value }))}
                        className="mt-1 w-full rounded border px-3 py-2"
                    />
                </label>
                <div className="mt-4 flex gap-3 justify-end">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded bg-black text-white">{teacher ? "Save" : "Create"}</button>
                </div>
            </form>
        </div>
    );
}
