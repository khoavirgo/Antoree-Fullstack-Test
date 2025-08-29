"use client";

import { useState } from "react";
import { CourseList } from "../components/admin/course/CourseList";
import { CourseForm } from "../components/admin/course/CourseForm";
import { useCourses } from "../components/admin/course/useCourse";
import { TeacherList } from "../components/admin/teacher/TeacherList";
import TeacherForm from "../components/admin/teacher/TeacherForm";
import { useTeachers } from "../components/admin/teacher/useTeacher";
import { LoginForm } from "./login/LoginForm";
import DashboardChart from "../components/admin/Dashboard";

export default function AdminPage() {
    const [adminKey, setAdminKey] = useState<string | null>(() =>
        typeof window !== "undefined" ? localStorage.getItem("admin_key") : null
    );
    const [loggedIn, setLoggedIn] = useState<boolean>(() => !!adminKey);

    const { courses, loadCourses, createCourse, updateCourse, deleteCourse } = useCourses(adminKey);
    const { teachers, loadTeachers, createTeacher, updateTeacher, deleteTeacher } = useTeachers(adminKey);

    const [tab, setTab] = useState<"dashboard" | "courses" | "teachers">("dashboard");


    const [openCourseForm, setOpenCourseForm] = useState(false);
    const [editCourse, setEditCourse] = useState<Course | null>(null);
    const [deleteTargetCourse, setDeleteTargetCourse] = useState<Course | null>(null);

    const [openTeacherForm, setOpenTeacherForm] = useState(false);
    const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
    const [deleteTargetTeacher, setDeleteTargetTeacher] = useState<Teacher | null>(null);

    const handleConfirmDeleteTeacher = async () => {
        if (!deleteTargetTeacher) return;
        await deleteTeacher(deleteTargetTeacher.id);
        setDeleteTargetTeacher(null);
        await loadTeachers();
    };

    const handleConfirmDeleteCourse = async () => {
        if (!deleteTargetCourse) return;
        await deleteCourse(deleteTargetCourse.id);
        setDeleteTargetCourse(null);
        await loadCourses();
    };

    if (!loggedIn) return <LoginForm setAdminKey={setAdminKey} setLoggedIn={setLoggedIn} />;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-indigo-600">Admin Dashboard</h1>
                    <button
                        className="px-4 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 shadow transition"
                        onClick={() => {
                            localStorage.removeItem("admin_key");
                            setLoggedIn(false);
                        }}
                    >
                        Logout
                    </button>
                </header>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b">
                    <button
                        className={`px-5 py-2 font-medium rounded-t-lg transition ${tab === "courses"
                            ? "bg-indigo-50 border-t-2 border-indigo-600 text-indigo-700"
                            : "text-gray-600 hover:text-gray-800"
                            }`}
                        onClick={() => setTab("courses")}
                    >
                        Courses
                    </button>
                    <button
                        className={`px-5 py-2 font-medium rounded-t-lg transition ${tab === "teachers"
                            ? "bg-indigo-50 border-t-2 border-indigo-600 text-indigo-700"
                            : "text-gray-600 hover:text-gray-800"
                            }`}
                        onClick={() => setTab("teachers")}
                    >
                        Teachers
                    </button>

                    <button
                        className={`px-5 py-2 font-medium rounded-t-lg transition ${tab === "dashboard"
                            ? "bg-indigo-50 border-t-2 border-indigo-600 text-indigo-700"
                            : "text-gray-600 hover:text-gray-800"
                            }`}
                        onClick={() => setTab("dashboard")}
                    >
                        Dashboard
                    </button>
                </div>

                {/* Content */}
                {tab === "courses" && (
                    <div>
                        <div className="flex justify-end mb-4">
                            <button
                                className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow transition"
                                onClick={() => {
                                    setEditCourse(null);
                                    setOpenCourseForm(true);
                                }}
                            >
                                New Course
                            </button>
                        </div>

                        <CourseList
                            courses={courses}
                            onEdit={(c) => {
                                setEditCourse(c);
                                setOpenCourseForm(true);
                            }}
                            onDelete={(c) => setDeleteTargetCourse(c)}
                        />

                        {openCourseForm && (
                            <CourseForm
                                course={editCourse}
                                teachers={teachers || []}
                                onSave={async (data) => {
                                    if (editCourse) await updateCourse(editCourse.id, data);
                                    else await createCourse(data);
                                    setOpenCourseForm(false);
                                    await loadCourses();
                                }}
                                onClose={() => setOpenCourseForm(false)}
                            />
                        )}

                        {deleteTargetCourse && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                                <div className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center">
                                    <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                                    <p className="mb-6">Are you sure you want to delete <span className="font-medium">{deleteTargetCourse.title}</span>?</p>
                                    <div className="flex justify-center gap-4">
                                        <button
                                            onClick={() => setDeleteTargetCourse(null)}
                                            className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleConfirmDeleteCourse}
                                            className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {tab === "teachers" && (
                    <div>
                        <div className="flex justify-end mb-4">
                            <button
                                className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow transition"
                                onClick={() => {
                                    setEditTeacher(null);
                                    setOpenTeacherForm(true);
                                }}
                            >
                                New Teacher
                            </button>
                        </div>

                        <TeacherList
                            teachers={teachers}
                            onEdit={(t) => {
                                setEditTeacher(t);
                                setOpenTeacherForm(true);
                            }}
                            onDelete={(t) => setDeleteTargetTeacher(t)}
                        />

                        {openTeacherForm && (
                            <TeacherForm
                                teacher={editTeacher}
                                onSave={async (data) => {
                                    if (editTeacher) await updateTeacher(editTeacher.id, data);
                                    else await createTeacher(data);
                                    setOpenTeacherForm(false);
                                    await loadTeachers();
                                }}
                                onClose={() => setOpenTeacherForm(false)}
                            />
                        )}

                        {deleteTargetTeacher && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                                <div className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center">
                                    <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                                    <p className="mb-6">Are you sure you want to delete <span className="font-medium">{deleteTargetTeacher.name}</span>?</p>
                                    <div className="flex justify-center gap-4">
                                        <button
                                            onClick={() => setDeleteTargetTeacher(null)}
                                            className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleConfirmDeleteTeacher}
                                            className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {tab === "dashboard" && <DashboardChart />}
            </div>
        </div>
    );
}
