'use client'
import {signIn, signOut} from "next-auth/react";
import {CircleUserRound} from "lucide-react";
import {useSession} from "next-auth/react";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";

function capitalize(str: string) {
    if (!str) return "";
    str = str.split(" ")[0];
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function Profile() {
    const {data: session} = useSession();
    const router = useRouter();
    const [drop, setDrop] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const handleLogin = async() =>{
        await signIn("credentials");
    }
    const handleLogout = async() =>{
        await signOut();
    }

    useEffect(() => {
        if(!session) return;

        if(session.user.method === "google" && session.user.status === "pending"){
            console.log(session);
            router.push("/auth/update");
        }

    }, [session])

    useEffect(() => {
        const handleClickOutside = (event:MouseEvent) =>{
            if(profileRef.current && !profileRef.current.contains(event.target as Node)){
                setDrop(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    return(
        <div>
            {session
                ? <div className="flex text-gray-800 items-center space-x-2 cursor-pointer">
                        <div className="flex items-center space-x-2" ref={profileRef} onClick={() => setDrop(!drop)}>
                            <CircleUserRound className=""/>
                            <div className="text-nowrap tracking-wide text-sm font-bold">{session.user.name}</div>
                        </div>
                        <div className="relative">
                        {drop && (
                            <div className="absolute right-0 top-8 w-90 bg-white border border-gray-100 rounded-lg shadow-lg z-10 pb-3">
                                <div className="text-xl text-center mt-5 font-semibold">
                                    Hi, {capitalize(session.user.name || "")}
                                </div>
                                <div className="text-sm font-medium text-center text-gray-900 mb-3">{session.user.email}</div>
                                {/*<div className="text-2xl text-center font-extrabold mb-4">*/}
                                {/*    &#8377; {balance}*/}
                                {/*</div>*/}
                                <hr className="my-2" />

                                <Link
                                    href="#"
                                    className="block text-center text-sm text-gray-700 py-2 rounded hover:bg-gray-100 font-medium"
                                >
                                    Account
                                </Link>

                                <button
                                    onMouseDown={() => handleLogout()}
                                    className="block w-full text-sm text-gray-700 cursor-pointer py-2 rounded hover:bg-gray-100 font-medium text-center"
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                        </div>
                    </div>
                : <button onClick={handleLogin} className="text-nowrap text-sm font-bold cursor-pointer">Sign in</button>
            }
        </div>
    )
}