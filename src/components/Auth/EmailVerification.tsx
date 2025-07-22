'use client';
import AuthFormWrapper from "@/components/Auth/AuthFormWrapper";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {useAuthStore} from "@/stores/authStore";

const inputStyle = " my-6 placeholder:text-[#222] focus:outline-none focus:ring-2 focus:ring-[#5423e7] w-full border py-3.5 px-4 text-lg tracking-wide border-gray-400 rounded-lg"
const buttonStyle = "w-full transition-all cursor-pointer duration-200 tracking-wider  rounded-full px-9 py-3.5 text-lg font-semibold mt-3 bg-[#5423e7] text-white hover:bg-purple-700"

export default function VerificationPage() {
    const [otp, setOTP] = useState('');
    const router = useRouter();
    const [error, setError] = useState("");

    const {email} = useAuthStore((state) => state.formData);

    useEffect(() => {
        const sendCode = async () => {
            await fetch("/api/otp/send", {
                method: "POST",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify({email})
            })
        }
        sendCode();

    }, [])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const otp = formData.get("otp") as string;

        const res = await fetch("/api/otp/verify", {
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({email, otp})
        })

        if(!res.ok){
            setError("Invalid code");
            return;
        }
        router.push("/auth/create-password");
    }

    return (
        <AuthFormWrapper>
            <div className="self-start text-3xl tracking-wide font-semibold">Let&#39;s confirm your email</div>
            <div className="mt-2 pl-2 self-start text-gray-700 text-md">
                <div>To continue, enter the secure code sent to {email}. Check junk mail if it’s not in your inbox.</div>
                <div className="tracking-wide text-lg"></div>
            </div>


            <form onSubmit={handleSubmit} className="w-full " method="post">
                <input type="text" name="otp" placeholder="6-digit code" className={inputStyle}
                       value={otp} onChange={(e) => {setOTP(e.target.value); setError("");}}/>

                <button type="submit"
                        className={buttonStyle}>
                    Continue</button>
                {error && <div className="text-lg text-red-500 mt-4 transition-all duration-400">{error}</div>}
            </form>
        </AuthFormWrapper>
    )
}