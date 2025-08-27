"use client";
import React, { useEffect, useState } from "react";

type Course = {
    id: number;
    sku: string;
    title: string;
    description?: string | null;
    price: number;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
};

function adminFetch(url: string, opts: RequestInit = {}) {
    const key = typeof window !== "undefined" ? localStorage.getItem("admin_key") : "";
    const headers = { ...(opts.headers || {}), "Content-Type": "application/json" } as any;
    if (key) headers["x-admin-key"] = key;
    return fetch(url, { ...opts, headers, credentials: "same-origin" });
}

export default function AdminPage() {
    const [adminKey, setAdminKey] = useState<string | null>(() =>
        typeof window !== "undefined" ? localStorage.getItem("admin_key") : null
    );
    const [loggedIn, setLoggedIn] = useState<boolean>(() => !!(typeof window !== "undefined" && localStorage.getItem("admin_key")));
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [openForm, setOpenForm] = useState(false);
    const [editCourse, setEditCourse] = useState<Course | null>(null);
    const [form, setForm] = useState({ sku: "", title: "", description: "", price: 0, active: true });

    useEffect(() => {
        if (loggedIn) loadCourses();
    }, [loggedIn]);

    async function tryLogin() {
        if (!adminKey) return setError("Nhập admin key");
        localStorage.setItem("admin_key", adminKey);
        setError(null);
        try {
            const res = await adminFetch("/api/courses");
            if (!res.ok) {
                localStorage.removeItem("admin_key");
                setLoggedIn(false);
                setError("Key không hợp lệ (server trả " + res.status + ")");
                return;
            }
            const json = await res.json().catch(() => ({}));
            if (json?.ok === false) {
                localStorage.removeItem("admin_key");
                setLoggedIn(false);
                setError(json.error || "Không thể xác thực");
                return;
            }
            setLoggedIn(true);
            setError(null);
        } catch (e: any) {
            localStorage.removeItem("admin_key");
            setLoggedIn(false);
            setError(e?.message || "Lỗi kết nối");
        }
    }

    async function loadCourses() {
        setLoading(true);
        setError(null);
        try {
            const res = await adminFetch("/api/courses");
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j?.error || `Failed to load (${res.status})`);
            }
            const json = await res.json();
            if (!json?.ok) throw new Error(json?.error || "Invalid response");
            setCourses(json.data || []);
        } catch (e: any) {
            setError(e?.message || "Load error");
        } finally {
            setLoading(false);
        }
    }

    function openCreate() {
        setEditCourse(null);
        setForm({ sku: "", title: "", description: "", price: 0, active: true });
        setOpenForm(true);
    }

    function openEdit(c: Course) {
        setEditCourse(c);
        setForm({ sku: c.sku, title: c.title, description: c.description ?? "", price: c.price, active: c.active });
        setOpenForm(true);
    }

    async function handleSave(e?: React.FormEvent) {
        e?.preventDefault();
        setError(null);
        try {
            if (editCourse) {
                const res = await adminFetch(`/api/courses/${editCourse.id}`, {
                    method: "PUT",
                    body: JSON.stringify(form),
                });
                if (!res.ok) {
                    const j = await res.json().catch(() => ({}));
                    throw new Error(j?.error || `Update failed ${res.status}`);
                }
            } else {
                const res = await adminFetch(`/api/courses`, {
                    method: "POST",
                    body: JSON.stringify({
                        sku: form.sku,
                        title: form.title,
                        description: form.description,
                        price: Math.round(Number(form.price) || 0),
                        active: form.active,
                    }),
                });
                if (!res.ok) {
                    const j = await res.json().catch(() => ({}));
                    throw new Error(j?.error || `Create failed ${res.status}`);
                }
            }
            setOpenForm(false);
            await loadCourses();
        } catch (err: any) {
            setError(err?.message || "Save error");
        }
    }

    async function handleDelete(c: Course) {
        if (!confirm(`Xóa khoá học "${c.title}"?`)) return;
        setError(null);
        try {
            const res = await adminFetch(`/api/courses/${c.id}`, { method: "DELETE" });
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j?.error || `Delete failed ${res.status}`);
            }
            await loadCourses();
        } catch (err: any) {
            setError(err?.message || "Delete error");
        }
    }

    if (!loggedIn) {
        return (
            <div className="min-h-screen grid place-items-center bg-gray-50 p-6">
                <div className="w-full max-w-md bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Admin login</h2>
                    <label className="block mb-3">
                        <div className="text-sm mb-1">Admin key</div>
                        <input
                            value={adminKey ?? ""}
                            onChange={(e) => setAdminKey(e.target.value)}
                            className="w-full rounded border px-3 py-2"
                            placeholder="Nhập admin key"
                        />
                    </label>
                    {error && <div className="text-red-600 mb-3">{error}</div>}
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setAdminKey("dev123")} className="px-3 py-2 rounded border text-sm">
                            Fill dev key
                        </button>
                        <button onClick={tryLogin} className="px-4 py-2 rounded bg-black text-white">
                            Sign in
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Admin — Courses</h1>
                    <div className="flex items-center gap-3">
                        <button onClick={openCreate} className="rounded-lg border px-4 py-2 text-sm">
                            New Course
                        </button>
                        <button onClick={() => { localStorage.removeItem("admin_key"); setLoggedIn(false); }} className="rounded-lg border px-4 py-2 text-sm text-red-600">
                            Logout
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    {error && <div className="text-red-600 mb-3">{error}</div>}
                    <div className="rounded-lg border p-4 bg-gray-50">
                        {loading ? (
                            <div>Loading...</div>
                        ) : courses.length === 0 ? (
                            <div>No courses yet</div>
                        ) : (
                            <div className="space-y-3">
                                {courses.map((c) => (
                                    <div key={c.id} className="bg-white p-4 rounded-md shadow-sm">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="text-lg font-semibold">{c.title}</div>
                                                {c.description ? <div className="mt-1 text-sm text-gray-700">{c.description}</div> : null}
                                                <div className="mt-2 text-sm text-gray-600">
                                                    SKU: {c.sku} • Price: {c.price.toLocaleString("vi-VN")}₫ • {c.active ? "Active" : "Inactive"}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <button onClick={() => openEdit(c)} className="px-3 py-1 rounded border text-sm">Edit</button>
                                                <button onClick={() => handleDelete(c)} className="px-3 py-1 rounded border text-sm text-red-600">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal form */}
                {openForm && (
                    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
                        <form onSubmit={handleSave} className="w-full max-w-lg bg-white rounded-xl p-6 shadow-lg">
                            <h2 className="text-lg font-semibold mb-4">{editCourse ? "Edit Course" : "Create Course"}</h2>

                            <label className="text-sm block mb-2">
                                SKU
                                <input
                                    value={form.sku}
                                    onChange={(e) => setForm((s) => ({ ...s, sku: e.target.value }))}
                                    className="mt-1 w-full rounded border px-3 py-2"
                                    disabled={!!editCourse}
                                />
                            </label>

                            <label className="text-sm block mb-2">
                                Title
                                <input
                                    value={form.title}
                                    onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                                    className="mt-1 w-full rounded border px-3 py-2"
                                />
                            </label>

                            <label className="text-sm block mb-2">
                                Description
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                                    className="mt-1 w-full rounded border px-3 py-2"
                                    rows={4}
                                />
                            </label>

                            <label className="text-sm block mb-2">
                                Price (VND)
                                <input
                                    type="number"
                                    value={form.price}
                                    onChange={(e) => setForm((s) => ({ ...s, price: Number(e.target.value) }))}
                                    className="mt-1 w-full rounded border px-3 py-2"
                                />
                            </label>

                            <label className="flex items-center gap-2 text-sm mt-2">
                                <input
                                    type="checkbox"
                                    checked={form.active}
                                    onChange={(e) => setForm((s) => ({ ...s, active: e.target.checked }))}
                                />
                                Active
                            </label>

                            <div className="mt-4 flex gap-3 justify-end">
                                <button type="button" onClick={() => setOpenForm(false)} className="px-4 py-2 rounded border">
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 rounded bg-black text-white">
                                    {editCourse ? "Save" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
