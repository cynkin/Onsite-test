import {prisma} from "@/lib/db"
import {NextResponse} from "next/server";

export default async function GET(req:Request) {
    const {email} = await req.json();
    console.log(email);

    if(!email) {
        return NextResponse.json({error: "Missing data"}, {status:400});
    }

    const user = await prisma.user.findUnique({
        where:{email}
    })
    if(!user){
        return NextResponse.json({error: "User not Found!"}, {status:400});
    }
    return NextResponse.json({user}, {status:200});
}