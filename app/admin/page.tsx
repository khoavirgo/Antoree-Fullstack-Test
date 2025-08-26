"use client"
import { useEffect, useState } from "react"

export default function AdminPage() {
    const [key, setKey] = useState("")
    const [stats, setStats] = useState<any>(null)
    const [err, setErr] = useState("")

    async function load() {
        setErr("")
        try {
            const res = await fetch("/api/stats", { headers: { "x-admin-key": key } })
            const json = await res.json()
            if (!json.ok) throw new Error(json.error || "ERR")
            setStats(json.data)
        } catch (e: any) {
            setErr(e.message || "Lỗi")
            setStats(null)
        }
    }

    useEffect(() => {
        const s = localStorage.getItem("admin_key")
        if (s) setKey(s)
    }, [])

    return (
        <div className="min-h-screen bg-white text-gray-900 p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <div className="mt-4 flex gap-2">
                    <input
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="ADMIN_KEY"
                        className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900"
                    />
                    <button
                        onClick={() => {
                            localStorage.setItem("admin_key", key)
                            load()
                        }}
                        className="rounded-xl bg-black text-white px-4"
                    >
                        Xem số liệu
                    </button>
                </div>
                {err && <div className="mt-3 text-sm text-red-500">{err}</div>}
                {stats && (
                    <div className="mt-8 grid grid-cols-2 gap-4">
                        {[
                            { label: "Traffic (visits)", value: stats.visits },
                            { label: "Leads", value: stats.leads },
                            { label: "Orders", value: stats.orders },
                            { label: "Revenue (VND)", value: String(stats.revenue) },
                            { label: "CR Leads/Traffic", value: (stats.crLead * 100).toFixed(2) + "%" },
                            { label: "Rev/Visit (VND)", value: Math.round(stats.crRev).toString() },
                        ].map((x) => (
                            <div key={x.label} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                <div className="text-sm text-gray-500">{x.label}</div>
                                <div className="text-2xl font-semibold mt-1 text-gray-900">{x.value}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
