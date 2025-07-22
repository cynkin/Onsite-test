import EmailVerification from "@/components/Auth/EmailVerification";
import {Suspense} from "react";

export default function EmailVerificationPage() {
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <EmailVerification/>
        </Suspense>
    )
}