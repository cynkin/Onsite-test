"use client"
import Google from "@/components/Auth/OAuthSuccess/Google"
import { Suspense } from "react";
export default function GoogleAuthSuccessPage() {

    return (
        <Suspense>
            <Google/>
        </Suspense>
    )
}
