import React from "react";

interface Props {
    courses: Course[];
    onEdit: (c: Course) => void;
    onDelete: (c: Course) => void;
}

export function CourseList({ courses, onEdit, onDelete }: Props) {
    if (courses.length === 0) return <div>No courses yet</div>;
    return (
        <div className="space-y-3">
            {courses.map(c => (
                <div key={c.id} className="bg-white p-4 rounded-md shadow-sm flex items-start justify-between">
                    <div className="flex-1">
                        <div className="text-lg font-semibold">{c.title}</div>
                        {c.description && <div className="mt-1 text-sm text-gray-700">{c.description}</div>}
                        <div className="mt-2 text-sm text-gray-600">
                            SKU: {c.sku} • Price: {c.price.toLocaleString("vi-VN")}₫ • {c.active ? "Active" : "Inactive"}
                        </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                        <button onClick={() => onEdit(c)} className="px-3 py-1 rounded border text-sm">Edit</button>
                        <button onClick={() => onDelete(c)} className="px-3 py-1 rounded border text-sm text-red-600">Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
