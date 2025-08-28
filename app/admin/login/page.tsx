"use client";

import { SetStateAction, Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen grid place-items-center bg-gray-50 p-6">
            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm setAdminKey={function (value: SetStateAction<string | null>): void {
                    throw new Error("Function not implemented.");
                }} setLoggedIn={function (value: SetStateAction<boolean>): void {
                    throw new Error("Function not implemented.");
                }} />
            </Suspense>
        </div>
    );
}
