import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {comparePasswords} from "@/lib/hash";
import {prisma} from "@/lib/db";

export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                email:{label:"Email", type:"email"},
                password:{label:"Password", type:"password"},
            },
            async authorize(credentials){
                console.log("Authorizing Credential Login", credentials);
                if(!credentials?.password || !credentials?.email) return null;

                const user = await prisma.user.findUnique({
                    where:{email:credentials.email}
                })
                if(!user) return null;
                console.log("User", user);

                if(user?.method === 'cred') {
                    if (!user.password) return null;

                    const valid = await comparePasswords(credentials.password, user.password);
                    if (!valid) return null;
                }

                return user;
            }
        })
    ],
    pages:{
      signIn:"/auth/login",
    },
    session:{
        strategy:"jwt",
        maxAge:30 * 24 * 60 * 60,
        updateAge:24 * 60 * 60,
    },
    callbacks:{
        async jwt({token, user, trigger, session}){
            if(user){
                token.id = user.id;
                token.email = user.email!;
                token.name = user.name!;
                token.method = user.method || "cred";
                token.status = user.status || "configured";
            }
            if(trigger === "update"){
                console.log("Updating token", token);
                console.log("Updating session", session);
                if(session.user?.name) token.name = session.user.name;
                if(session.user?.method) token.method = session.user.method;
                if(session.user?.status) token.status = session.user.status;
            }

            if(!token.id && token.sub){
                token.id = token.sub;
            }

            return token;
        },
        async session({session, token}){
            if(token && session.user){
                session.user.email = token.email;
                session.user.method = token.method;
                session.user.status = token.status;
                session.user.id = token.id;
                session.user.name = token.name;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
}