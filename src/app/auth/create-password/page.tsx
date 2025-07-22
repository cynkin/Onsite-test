'use client';
import {useRouter} from "next/navigation";
import React, { useState } from "react";
import AuthFormWrapper from "@/components/Auth/AuthFormWrapper";
import {useAuthStore} from "@/stores/authStore";

const inputStyle = " mt-6 placeholder:text-[#222] focus:outline-none focus:ring-2 focus:ring-[#5423e7] w-full border py-3.5 px-4 text-lg tracking-wide border-gray-400 rounded-lg"
const buttonStyle = "w-full transition-all duration-200 tracking-wider  rounded-full px-9 py-3.5 text-lg font-semibold mt-2 "
const listStyle = " px-2.5 text-base";

export default function CreatePasswordPage() {
    const router = useRouter();
    // const [error, setError] = useState("");
    const [password, setCurrentPassword] = useState('');
    const {setFormData} = useAuthStore();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;
        setFormData({password});

        router.push("/auth/register");
    }

    const getStrength = (pwd: string) => {
        let score = 0;
        if (pwd.length >= 6) score++;
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
        if (/\d/.test(pwd)) score++;
        if (/[\W_]/.test(pwd)) score++;
        return score;
    };

    const strength = getStrength(password);
    const isStrong = strength >= 2;
    const strengthLabel = ['Weak', 'Fair', 'Strong', 'Very Strong'][strength - 1] || 'Weak';
    const progressColors = ['bg-gray-400', 'bg-yellow-300', 'bg-green-500', 'bg-green-500'];

    return (
        <AuthFormWrapper>
            <div className="self-start text-3xl tracking-wide font-semibold">Create a password</div>
            <div className="mt-2 self-start text-lg">You can use this password to sign in</div>

            <form onSubmit={handleSubmit} className="w-full " method="post">
                <input type="password" name="password" placeholder="Password" className={inputStyle}
                       value={password} onChange={(e) => setCurrentPassword(e.target.value)}/>

                <div className="flex justify-between text-sm text-gray-600 mt-2 mb-0.5">
                    <span>Password strength</span>
                    <span className="font-bold">{strengthLabel}</span>
                </div>

                <div className="h-2 rounded-full bg-gray-200 overflow-hidden mt-2 mb-5">
                    <div
                        className={` h-full transition-all duration-300 ${progressColors[strength - 1] || 'bg-gray-300'}`}
                        style={{ width: `${(strength / 4) * 100}%` }}
                    />
                </div>

                <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1 mb-6">
                    {password.length < 6  && <li className={listStyle}>Includes 6-64 characters</li>}
                    {(!/\d/.test(password) || !/[a-zA-Z]/.test(password)) && <li className={listStyle}>Combines letters and numbers</li>}
                    {!(/[\W_]/.test(password)) && <li className={listStyle}>A special character ~ # @ $ % & ! * _ ? ^ -</li>}

                </ul>

                <button type="submit" disabled={!isStrong}
                        className={`${buttonStyle} ${isStrong ?
                            'bg-[#5423e7] text-white hover:bg-purple-700' : 'bg-purple-200 text-white cursor-not-allowed' }`}>
                    Continue</button>
                {/*{error && <div className="text-red-500 mt-2">{error}</div>}*/}
            </form>
        </AuthFormWrapper>
    )
}