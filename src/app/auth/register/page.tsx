'use client';
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react";
import AuthFormWrapper from "@/components/Auth/AuthFormWrapper";
import {useAuthStore} from "@/stores/authStore";

const inputStyle = " my-2 placeholder:text-[#222] focus:outline-none focus:ring-2 focus:ring-[#5423e7] w-full border py-3.5 px-4 text-lg tracking-wide border-gray-400 rounded-lg"

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const {email, password} = useAuthStore((state) => state.formData);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const role = formData.get("role") as string;

        if(name.length < 3){
            setError("Name must be at least 3 characters long");
            return;
        }
        console.log(name, role);
        console.log(email, password);
        if(!email || !password || !name || !role) router.push("/auth/login");

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({email, name, role, password})
        })

        console.log("USER REGISTERED");
        if(res?.ok){
            const response = await signIn("credentials", {
                redirect: false,
                email,
                password
            });

            if (response?.error) {
                setError("UNABLE TO SIGN IN AFTER ERROR");
                console.log(response.error);
            } else {
                router.push("/");
            }
        }
    }

    return (
        <>
            {loading
                ?
                <></>
                :
                    <AuthFormWrapper>
                        <div className="self-start text-3xl tracking-wide font-semibold">How do we contact you?</div>
                        <div className="self-start text-lg mb-6">Match your full name to the name you use on official documents, like passport or AADHAR.</div>

                        <form onSubmit={handleSubmit} className="w-full " method="post">
                            <input type="text" name="name" placeholder="Name" className={inputStyle} onChange={()=>setError("")}/>

                            <select
                                name="role"
                                id="role"
                                className="mt-2 block w-full py-3.5 px-4 rounded-lg border border-gray-400 text-lg font-medium text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-[#5423e7]"
                            >
                                <option value="user">User</option>
                                <option value="vendor">Vendor</option>

                            </select>

                            <button type="submit" className="w-full tracking-wider transition-all duration-200 bg-[#5423e7] cursor-pointer hover:bg-purple-700 rounded-full px-9 py-3.5 text-white text-lg font-semibold mt-10">Continue</button>
                            {error && <div className="text-red-500 mt-2">{error}</div>}
                        </form>
                    </AuthFormWrapper>
            }
        </>
    )
}