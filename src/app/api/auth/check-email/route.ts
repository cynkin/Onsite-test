import {prisma} from "@/lib/db"
import {NextResponse} from "next/server";

export async function POST(req:Request) {
    const {email} = await req.json();
    console.log(email);

    if(!email) {
        return new Response("Email is required", {status:400})
    }

    try{
        const user = await prisma.user.findUnique({
            where:{email}
        })

        if(!user) return NextResponse.json({exists: false}, {status:200})
        return NextResponse.json({exists: true}, {status:200})
    }
    catch (e){
        return new Response("Error", {status:500})
    }
}