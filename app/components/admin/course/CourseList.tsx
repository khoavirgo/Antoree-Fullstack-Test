"use client";
import React from "react";

interface Props {
    courses: Course[];
    onEdit: (c: Course) => void;
    onDelete: (c: Course) => void;
}

export function CourseList({ courses, onEdit, onDelete }: Props) {
    if (!courses.length) {
        return (
            <div className="text-gray-500 text-center py-6 bg-white rounded-xl shadow">
                📚 Chưa có khóa học nào.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {courses.map((c) => (
                <div
                    key={c.id}
                    className="bg-white rounded-xl shadow p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-md transition"
                >
                    {/* Thông tin khóa học */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold">{c.title}</span>
                            <span
                                className={`px-2 py-0.5 text-xs rounded-full ${c.active
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-200 text-gray-600"
                                    }`}
                            >
                                {c.active ? "Hoạt động" : "Ngưng"}
                            </span>
                        </div>

                        {c.description && (
                            <p className="mt-1 text-sm text-gray-600">{c.description}</p>
                        )}

                        <div className="mt-2 text-sm text-gray-700 flex flex-wrap gap-3">
                            <span className="bg-blue-50 px-2 py-0.5 rounded">
                                🆔 SKU: <span className="font-medium">{c.sku}</span>
                            </span>
                            <span className="bg-yellow-50 px-2 py-0.5 rounded">
                                💰 Giá:{" "}
                                <span className="font-medium">
                                    {c.price.toLocaleString("vi-VN")}₫
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="flex gap-2 mt-3 sm:mt-0 sm:ml-4">
                        <button
                            onClick={() => onEdit(c)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                        >
                            ✏️ Sửa
                        </button>
                        <button
                            onClick={() => onDelete(c)}
                            className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
                        >
                            🗑 Xóa
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
