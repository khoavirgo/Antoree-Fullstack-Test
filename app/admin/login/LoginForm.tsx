import React, { Dispatch, SetStateAction } from "react";

interface LoginFormProps {
    setAdminKey: Dispatch<SetStateAction<string | null>>;
    setLoggedIn: Dispatch<SetStateAction<boolean>>;
}

export function LoginForm({ setAdminKey, setLoggedIn }: LoginFormProps) {
    const [adminKey, setKey] = React.useState("");

    const tryLogin = () => {
        if (!adminKey) return;
        localStorage.setItem("admin_key", adminKey);
        setAdminKey(adminKey);
        setLoggedIn(true);
    };

    return (
        <div className="min-h-screen grid place-items-center bg-gray-50 p-6">
            <div className="w-full max-w-md bg-white p-6 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Admin login</h2>
                <input
                    value={adminKey}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full rounded border px-3 py-2 mb-3"
                    placeholder="Nhập admin key"
                />
                <button onClick={tryLogin} className="px-4 py-2 rounded bg-black text-white">
                    Sign in
                </button>
            </div>
        </div>
    );
}
