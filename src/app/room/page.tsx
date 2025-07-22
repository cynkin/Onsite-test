import {Suspense} from "react";
import Room from "@/components/Suspense/Room"

export default function RoomPage() {
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <Room/>
        </Suspense>
    )
}