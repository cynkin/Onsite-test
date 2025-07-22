'use client';
import socket from "@/lib/socket"
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";

export default function SocketSystem() {
    const {data: session} = useSession();

    useEffect(() => {
        if(!session) return;
        socket.connect();

        socket.emit("auth-user", session.user.id);

        return () => {
            socket.disconnect();
        }
    }, []);



    return(
        <div>

        </div>
    )
}