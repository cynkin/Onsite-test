'use client';
import {useRouter} from "next/navigation";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {useAuthStore} from "@/stores/authStore";
import AuthFormWrapper from "@/components/Auth/AuthFormWrapper";

const inputStyle = " mt-6 mb-2 placeholder:text-[#222] focus:outline-none focus:ring-2 focus:ring-[#5423e7] w-full border py-3.5 px-4 text-lg tracking-wide border-gray-400 rounded-lg"
const buttonStyle = "w-full transition-all cursor-pointer duration-200 tracking-wider  rounded-full px-9 py-3.5 text-lg font-semibold mt-7 bg-[#5423e7] text-white hover:bg-purple-700"

export default function LoginPage() {

    const [password, setPassword] = useState('');
    const router = useRouter();
    const [error, setError] = useState("");

    const { email } = useAuthStore((state) => state.formData);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password
        });

        if (res?.error) {
            setError("Invalid credentials");
        } else {
            router.push("/");
        }

    }

    return (
        <AuthFormWrapper>
            <div className="self-start text-3xl tracking-wide font-semibold">Enter your password</div>
            <div className="mt-2 pl-4 self-start text-md">
                {/*<div>Email</div>*/}
                <div className="tracking-wide text-lg">{email}</div>
            </div>


            <form onSubmit={handleSubmit} className="w-full " method="post">
                <input type="password" name="password" placeholder="Password" className={inputStyle}
                       value={password} onChange={(e) => {setPassword(e.target.value); setError("");}}/>

                <Link href="#" className="text-lg text-blue-500">Forgot password?</Link>
                <button type="submit"
                        className={buttonStyle}>
                    Sign in</button>
                {error && <div className="text-lg text-red-500 mt-4 transition-all duration-400">{error}</div>}
            </form>
        </AuthFormWrapper>
    )
}