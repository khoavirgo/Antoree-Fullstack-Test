"use client";
import React, { useState, useMemo } from "react";
import { Search, Edit2, Trash2, Calendar, Award, GraduationCap } from "lucide-react";

interface Props {
    teachers: Teacher[];
    onEdit: (t: Teacher) => void;
    onDelete: (t: Teacher) => void;
}

export function TeacherList({ teachers, onEdit, onDelete }: Props) {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"createdAt" | "name-asc" | "name-desc">("createdAt");

    const filteredTeachers = useMemo(() => {
        let list = [...teachers];
        if (search.trim()) {
            list = list.filter(
                (t) =>
                    t.name.toLowerCase().includes(search.toLowerCase()) ||
                    t.email.toLowerCase().includes(search.toLowerCase())
            );
        }
        switch (sortBy) {
            case "name-asc":
                list.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                list.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "createdAt":
                list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
        }
        return list;
    }, [teachers, search, sortBy]);

    if (!teachers?.length) {
        return (
            <p className="text-gray-500 text-center py-6">Chưa có giáo viên nào.</p>
        );
    }

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên hoặc email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                    <option value="createdAt">Mới nhất</option>
                    <option value="name-asc">Tên A → Z</option>
                    <option value="name-desc">Tên Z → A</option>
                </select>
            </div>

            {/* Teacher cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredTeachers.map((t) => (
                    <div
                        key={t.id}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={t.avatarUrl || "https://via.placeholder.com/100?text=Avatar"}
                                alt={t.name}
                                className="w-24 h-24 rounded-full object-cover border"
                            />
                            <div>
                                <h3 className="font-bold text-lg">{t.name}</h3>
                                <p className="text-sm text-gray-600">{t.email}</p>
                                {t.phone && <p className="text-sm text-gray-600">📞 {t.phone}</p>}
                            </div>
                        </div>

                        <div className="mt-4 text-sm flex-1 space-y-2">
                            {t.education && (
                                <p className="flex items-start gap-2">
                                    <GraduationCap className="w-4 h-4 text-blue-500 mt-0.5" /> {t.education}
                                </p>
                            )}
                            {t.achievements && (
                                <p className="flex items-start gap-2">
                                    <Award className="w-4 h-4 text-yellow-500 mt-0.5" /> {t.achievements}
                                </p>
                            )}
                        </div>

                        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(t.createdAt).toLocaleDateString("vi-VN")}
                        </p>

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => onEdit(t)}
                                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1"
                            >
                                <Edit2 className="w-4 h-4" /> Sửa
                            </button>
                            <button
                                onClick={() => onDelete(t)}
                                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 flex items-center gap-1"
                            >
                                <Trash2 className="w-4 h-4" /> Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
