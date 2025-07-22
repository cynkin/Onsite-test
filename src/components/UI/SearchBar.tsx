'use client'
import {Search} from "lucide-react";
import React from "react";
import {useRouter} from "next/navigation";

export default function SearchBar(){
    const router = useRouter();
    const search = (e:any) =>{
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const q = formData.get("q") as string;
        router.push(`/search?q=${q}`);
    }

    return(
        <div className="w-full">
            <form onSubmit={search} className="flex">
                <div className="relative flex mx-5 items-center w-full">
                    <input type="text"
                           name="q"
                           placeholder="Search for events...."
                           className="w-full border my-2 py-3 pl-12 text-sm tracking-wide border-gray-300 rounded-3xl
                           shadow-xs focus:outline-none focus:ring-2 focus:ring-[#5423e7] hover:shadow-md focus:shadow-xl
                           focus:border-transparent transition-all duration-200"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2"/>
                    <button type="submit" className="h-fit ml-2 rounded-3xl text-sm cursor-pointer text-white px-4 py-3 bg-primary">Search</button>
                </div>
            </form>
        </div>
    )
}