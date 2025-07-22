'use client';
import Image from "next/image"
import React, {useState} from "react";
import {FcGoogle} from "react-icons/fc"
import {useAuthStore} from "@/stores/authStore";
import {useRouter} from "next/navigation";
import AuthFormWrapper from "@/components/Auth/AuthFormWrapper";

type CheckEmailResponse = {
    exists: boolean;
    name?: string;
};

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const {setFormData} = useAuthStore();

    const checkEmail = async (email: string): Promise<CheckEmailResponse | null> =>{
        const res = await fetch("/api/auth/check-email", {
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({email})
        })


         if(!res.ok){
            console.log("res", res);
            setError("Something went wrong. Please try again.");
            return null;
        }

        return await res.json();
    }

    async function credLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const result = await checkEmail(email);

        console.log(result, email);

        if(!result) return;

        setFormData({email});
        if(result.exists) router.push("/auth/check-password");
        // else router.push("/auth/email-verification");
        else router.push("/auth/create-password");
    }

    const dAuthLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_DAUTH_CLIENT_ID!;
        const redirectUri = process.env.NEXT_PUBLIC_DAUTH_REDIRECT_URI!;

        const url = `https://auth.delta.nitt.edu/authorize?${new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: "code",
            scope: "profile email user",
            grant_type: "authorization_code",
            state: "1234567890",
            nonce: "1234567890",
            prompt: "consent",
        }).toString()}`;

        window.location.href = url;
    }

    const googleLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
        const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!;

        const url = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: "code",
            scope: "email profile",
            access_type: "offline",
            prompt: "consent",
        }).toString()}`;

        window.location.href = url;
    };

    return (
        <AuthFormWrapper>
            <div className="self-start text-3xl tracking-wide font-semibold">Sign in or create an account</div>
            {/*<div className="self-start text-lg">Book tickets like never before!</div>*/}
            <button onClick={googleLogin} className=" transition-all cursor-pointer duration-200  flex items-center tracking-wide w-full hover:bg-[#0d4eaf] bg-[#1568e3] rounded-lg pl-2 pr-9 py-2 text-white text-lg mt-5">
                <div className="w-11 h-auto self-start bg-white rounded-sm">
                    <FcGoogle className="p-2 w-full h-auto"/>
                </div>
                <div className="w-full flex justify-center">Sign in with Google</div>
            </button>
            <button onClick={dAuthLogin} className=" transition-all cursor-pointer duration-200  flex items-center tracking-wide w-full hover:bg-green-700 bg-green-600 rounded-lg pl-2 pr-9 py-2 text-white text-lg mt-3">
                <div className="w-11 h-auto self-start bg-white rounded-sm">
                    <Image src={"/delta.png"} width={50} height={50} alt="delta logo" className="p-0.5 w-full h-auto"/>
                </div>
                <div className="w-full flex justify-center">Sign in with DAuth</div>
            </button>

            <div className="m-5">OR</div>
            <form onSubmit={credLogin} className="w-full " method="post">
                <input type="email" autoComplete="off" name="email" placeholder="Email" className="placeholder:text-[#222] focus:outline-none focus:ring-2 focus:ring-[#1568e3] w-full border py-3.5 px-4 text-lg tracking-wide border-gray-400 rounded-lg"/>
                <button type="submit" className="w-full cursor-pointer tracking-wider transition-all duration-200 bg-[#5423e7]  rounded-full px-9 py-3.5 text-white hover:bg-purple-800 text-lg font-semibold mt-5">Continue</button>
                {error && <div className="text-red-500 text-sm font-bold mt-2">{error}</div>}
            </form>
        </AuthFormWrapper>
    )
}