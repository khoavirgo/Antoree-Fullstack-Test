import { useState, useEffect } from "react";

export function useTeachers(adminKey: string | null) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function adminFetch(url: string, opts: RequestInit = {}) {
    const headers = {
      ...(opts.headers || {}),
      "Content-Type": "application/json",
    } as any;
    if (adminKey) headers["x-admin-key"] = adminKey;
    return fetch(url, { ...opts, headers, credentials: "same-origin" });
  }

  const loadTeachers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch("/api/teachers");
      if (!res.ok) throw new Error(`Failed to load teachers (${res.status})`);
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Invalid response");
      setTeachers(json.data || []);
    } catch (e: any) {
      setError(e?.message || "Load error");
    } finally {
      setLoading(false);
    }
  };

  const createTeacher = async (data: Partial<Teacher>) => {
    try {
      const res = await adminFetch("/api/teachers", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Create failed ${res.status}`);
      await loadTeachers();
    } catch (e: any) {
      setError(e?.message || "Create error");
    }
  };

  const updateTeacher = async (id: number, data: Partial<Teacher>) => {
    try {
      const res = await adminFetch(`/api/teachers/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Update failed ${res.status}`);
      await loadTeachers();
    } catch (e: any) {
      setError(e?.message || "Update error");
    }
  };

  const deleteTeacher = async (id: number) => {
    try {
      const res = await adminFetch(`/api/teachers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed ${res.status}`);
      await loadTeachers();
    } catch (e: any) {
      setError(e?.message || "Delete error");
    }
  };

  useEffect(() => {
    if (adminKey) loadTeachers();
  }, [adminKey]);

  return {
    teachers,
    loading,
    error,
    loadTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
  };
}
