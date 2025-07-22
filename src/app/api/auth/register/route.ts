import {prisma} from "@/lib/db"
import {NextResponse} from "next/server";
import {hashPassword} from "@/lib/hash";

export async function POST(req:Request) {
    const {email, password, name} = await req.json();
    console.log(email, password, name);

    const hashed = await hashPassword(password);
    try{
        const user = await prisma.user.create({
            data:{
                email,
                password:hashed,
                name,
                method:"cred",
                status:"configured"
            }
        });

        return NextResponse.json(user, {status:200})
    }
    catch (e){
        return NextResponse.json({error:e}, {status:500})
    }
}