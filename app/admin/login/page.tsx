"use client";

import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen grid place-items-center bg-gray-50 p-6">
            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
