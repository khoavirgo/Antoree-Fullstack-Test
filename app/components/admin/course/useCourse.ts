import { useState, useEffect } from "react";

export function useCourses(adminKey: string | null) {
  const [courses, setCourses] = useState<Course[]>([]);
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

  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch("/api/courses");
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Invalid response");
      setCourses(json.data || []);
    } catch (e: any) {
      setError(e?.message || "Load error");
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (data: Partial<Course>) => {
    try {
      const res = await adminFetch("/api/courses", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Create failed ${res.status}`);
      await loadCourses();
    } catch (e: any) {
      setError(e?.message || "Create error");
    }
  };

  const updateCourse = async (id: number, data: Partial<Course>) => {
    try {
      const res = await adminFetch(`/api/courses/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Update failed ${res.status}`);
      await loadCourses();
    } catch (e: any) {
      setError(e?.message || "Update error");
    }
  };

  const deleteCourse = async (id: number) => {
    try {
      const res = await adminFetch(`/api/courses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed ${res.status}`);
      await loadCourses();
    } catch (e: any) {
      setError(e?.message || "Delete error");
    }
  };

  useEffect(() => {
    if (adminKey) loadCourses();
  }, [adminKey]);

  return {
    courses,
    loading,
    error,
    loadCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  };
}
