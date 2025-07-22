import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/db";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code");
    if (!code) return NextResponse.redirect("http://localhost:3000/auth/login");
    console.log("Code", code);

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code",
        }),
    });

    console.log("Token Response", tokenRes);
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) return NextResponse.redirect("http://localhost:3000/auth/login");

    console.log("Access token", accessToken);
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const googleUser = await userInfoRes.json();

    console.log("Google user", googleUser);
    const { email, name, id: google_id, picture } = googleUser;

    if (!email) return NextResponse.redirect("http://localhost:3000/auth/login");

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                email,
                name,
                method:"google",
                status:"pending",
            },
        });
    }
    return NextResponse.redirect(`http://localhost:3000/oAuth/google?email=${encodeURIComponent(email)}`);
}

