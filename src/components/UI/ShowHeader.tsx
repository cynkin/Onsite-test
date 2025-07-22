'use client'
import {usePathname} from "next/navigation";
import {ReactNode} from "react";

export default function ShowHeader({children}:{children:ReactNode}){
    const pathname = usePathname();
    console.log(pathname);
    const hideHeaders = ["/auth/register", "/auth/update", "/room", "/auth/login", "/auth/create-password", "/auth/email-verification", "/auth/check-password"];
    console.log(hideHeaders.includes(pathname));

    if(hideHeaders.includes(pathname)) return (<></>);
    return (<>{children}</>);
}