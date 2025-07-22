import NextAuth, {DefaultSession, DefaultUser} from 'next-auth';

declare module 'next-auth' {
    interface Session{
        user: {
            id: string;
            email: string;
            name?: string;
            method?: string;
            status?: string;
        } & DefaultUser;
    }
}

declare module "next-auth/jwt" {
    interface JWT{
        id: string;
        email: string;
        name?: string;
        method?: string;
        status?: string;
    }
}