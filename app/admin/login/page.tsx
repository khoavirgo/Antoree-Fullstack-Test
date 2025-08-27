"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
    const [key, setKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const router = useRouter();
    const params = useSearchParams();
    const next = params?.get("next") || "/admin";

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setErr(null);
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key }),
            });

            const ct = res.headers.get("content-type") || "";
            if (!res.ok) {
                if (ct.includes("application/json")) {
                    const json = await res.json();
                    setErr(json?.error || "Invalid key");
                } else {
                    setErr("Unexpected non-JSON response from server");
                }
                setLoading(false);
                return;
            }

            if (ct.includes("application/json")) {
                const json = await res.json();
                if (json.ok) {
                    router.push(next);
                } else {
                    setErr(json.error || "Invalid key");
                }
            } else {
                setErr("Unexpected non-JSON response from server");
            }
        } catch (e: any) {
            setErr(e?.message || "Server error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen grid place-items-center bg-gray-50 p-6">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Admin login</h2>
                <label className="block mb-2 text-sm">
                    Admin key
                    <input
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        className="mt-1 block w-full rounded border px-3 py-2"
                        placeholder="Enter admin key"
                    />
                </label>
                {err && <div className="text-red-600 mb-2">{err}</div>}
                <div className="flex justify-end gap-3">
                    <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-black text-white">
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </div>
            </form>
        </div>
    );
}
