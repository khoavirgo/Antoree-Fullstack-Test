"use client";

import { useState } from "react";
import { CourseList } from "../components/admin/course/CourseList";
import { CourseForm } from "../components/admin/course/CourseForm";
import { useCourses } from "../components/admin/course/useCourse";
import { TeacherList } from "../components/admin/teacher/TeacherList";
import TeacherForm from "../components/admin/teacher/TeacherForm";
import { useTeachers } from "../components/admin/teacher/useTeacher";
import { LoginForm } from "./login/LoginForm";

export default function AdminPage() {
    const [adminKey, setAdminKey] = useState<string | null>(() =>
        typeof window !== "undefined" ? localStorage.getItem("admin_key") : null
    );
    const [loggedIn, setLoggedIn] = useState<boolean>(() => !!adminKey);

    const { courses, loadCourses, createCourse, updateCourse, deleteCourse } = useCourses(adminKey);
    const { teachers, loadTeachers, createTeacher, updateTeacher, deleteTeacher } = useTeachers(adminKey);

    const [tab, setTab] = useState<"courses" | "teachers">("courses");

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
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <header className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <button
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                        onClick={() => {
                            localStorage.removeItem("admin_key");
                            setLoggedIn(false);
                        }}
                    >
                        Logout
                    </button>
                </header>

                {/* Tabs */}
                <div className="flex gap-4 mb-4 border-b">
                    <button
                        className={`px-4 py-2 font-medium ${tab === "courses" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
                            }`}
                        onClick={() => setTab("courses")}
                    >
                        Courses
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ${tab === "teachers" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
                            }`}
                        onClick={() => setTab("teachers")}
                    >
                        Teachers
                    </button>
                </div>

                {/* Content */}
                {tab === "courses" && (
                    <div>
                        <div className="flex justify-end mb-3">
                            <button
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
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
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                                <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                                    <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
                                    <p className="mb-4">Bạn có chắc muốn xóa {deleteTargetCourse.title} không?</p>
                                    <div className="flex justify-end gap-3">
                                        <button onClick={() => setDeleteTargetCourse(null)} className="px-4 py-2 rounded border">
                                            Hủy
                                        </button>
                                        <button
                                            onClick={handleConfirmDeleteCourse}
                                            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {tab === "teachers" && (
                    <div>
                        <div className="flex justify-end mb-3">
                            <button
                                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
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
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                                <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                                    <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
                                    <p className="mb-4">Bạn có chắc muốn xóa {deleteTargetTeacher.name} không?</p>
                                    <div className="flex justify-end gap-3">
                                        <button onClick={() => setDeleteTargetTeacher(null)} className="px-4 py-2 rounded border">
                                            Hủy
                                        </button>
                                        <button
                                            onClick={async () => {
                                                await handleConfirmDeleteTeacher();
                                            }}
                                            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
