import Image from "next/image";
import React, {ReactNode} from "react";
import {useRouter} from "next/navigation";

export default function AuthFormWrapper({children}:{children:ReactNode}) {
    const router = useRouter();
    const handleClick = () => {
        router.push("/");
    }
    return (
        <div className="flex justify-center items-center">
            <div className="w-[460px]">
                <div className="flex flex-col items-center ">
                    <Image src={"/next.svg"} onClick={handleClick} alt="logo" className="m-9 cursor-pointer mb-25" width={200} height={120} />
                    {children}
                </div>
            </div>
        </div>
    )
}