"use client";

import { useCallback, useEffect, useState } from "react";

export function useTeachers(adminKey: string | null) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teachers", { cache: "no-store" });
      const json = await res.json();
      if (json.ok) setTeachers(json.data as Teacher[]);
      else throw new Error(json.error || "Failed to load teachers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  const createTeacher = async (data: TeacherFormData) => {
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("email", data.email);
    fd.append("phone", data.phone);
    fd.append("education", data.education);
    fd.append("achievements", data.achievements);
    if (data.avatar) fd.append("avatar", data.avatar);

    const res = await fetch("/api/teachers", {
      method: "POST",
      body: fd,
      headers: adminKey ? { "x-admin-key": adminKey } : undefined,
    });

    const json = await res.json();
    if (!res.ok || !json.ok) throw new Error(json.error || "Create failed");
  };

  const updateTeacher = async (id: number, data: TeacherFormData) => {
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("email", data.email);
    fd.append("phone", data.phone);
    fd.append("education", data.education);
    fd.append("achievements", data.achievements);
    if (data.avatar) fd.append("avatar", data.avatar);

    const res = await fetch(`/api/teachers/${id}`, {
      method: "PUT",
      body: fd,
      headers: adminKey ? { "x-admin-key": adminKey } : undefined,
    });

    const json = await res.json();
    if (!res.ok || !json.ok) throw new Error(json.error || "Update failed");
  };

  const deleteTeacher = async (id: number) => {
    const res = await fetch(`/api/teachers/${id}`, {
      method: "DELETE",
      headers: adminKey ? { "x-admin-key": adminKey } : undefined,
    });
    const json = await res.json();
    if (!res.ok || !json.ok) throw new Error(json.error || "Delete failed");
  };

  return {
    teachers,
    loading,
    loadTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
  };
}
