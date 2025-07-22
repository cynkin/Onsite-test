'use client';
import socket from "@/lib/socket";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function RoomPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const [status, setStatus] = useState("Connecting...");

    const createPeerConnection = () => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice-candidate", event.candidate, code);
            }
        };

        pc.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        return pc;
    };

    const setupMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            if (pcRef.current) {
                stream.getTracks().forEach(track => {
                    pcRef.current?.addTrack(track, stream);
                });
            }
        } catch (error) {
            console.error("Error accessing media devices:", error);
            setStatus("Failed to access camera/microphone");
        }
    };

    const startCall = async (isInitiator: boolean) => {
        pcRef.current = createPeerConnection();
        await setupMedia();

        if (isInitiator) {
            try {
                const offer = await pcRef.current.createOffer();
                await pcRef.current.setLocalDescription(offer);
                socket.emit("offer", offer, code);
                setStatus("Waiting for peer to join...");
            } catch (error) {
                console.error("Error creating offer:", error);
            }
        }
    };

    useEffect(() => {
        if (!code) {
            router.push("/");
            return;
        }

        socket.connect();
        setStatus("Joining room...");

        console.log("before");
        socket.emit("join-room", code);
        console.log("after");

        socket.on("created", () => {
            setStatus("Room created. Waiting for peer...");
        });

        socket.on("joined", async() => {
            // setStatus("Peer found. Starting call...");
            await startCall(false);
        });

        socket.on("ready", async() => {
            setStatus("Starting call...");
            await startCall(true);
        });

        socket.on("offer", async (offer) => {
            if (!pcRef.current) return;

            try {
                await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await pcRef.current.createAnswer();
                await pcRef.current.setLocalDescription(answer);
                socket.emit("answer", answer, code);
            } catch (error) {
                console.error("Error handling offer:", error);
            }
        });

        socket.on("answer", async (answer) => {
            if (!pcRef.current) return;

            try {
                await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            } catch (error) {
                console.error("Error handling answer:", error);
            }
        });

        socket.on("ice-candidate", async (candidate) => {
            if (!pcRef.current) return;

            try {
                await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
                console.error("Error adding ICE candidate:", error);
            }
        });

        return () => {
            socket.off();
            socket.disconnect();
            if (pcRef.current) {
                pcRef.current.close();
            }
        };
    }, [code]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Room: {code}</h1>
            <p className="mb-4">{status}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h2 className="text-xl font-semibold mb-2">Your Video</h2>
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full rounded-lg border border-gray-300"
                    />
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">Remote Video</h2>
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full rounded-lg border border-gray-300"
                    />
                </div>
            </div>
        </div>
    );
}