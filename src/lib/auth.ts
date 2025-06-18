import { getDb } from "@/lib/db";
import { LoginSchema } from "@/lib/schemas";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
   interface User {
      role: "customer" | "restaurant_manager" | "delivery_man";
      restaurant_id?: number;
   }
   interface Session {
      user: {
         id: string;
         email: string;
         name: string;
         role: "customer" | "restaurant_manager" | "delivery_man";
         restaurant_id?: number;
      };
   }
}

interface DbUser {
   id: number;
   email: string;
   password: string;
   name: string;
   role: "customer" | "restaurant_manager" | "delivery_man";
   restaurant_id?: number;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
   providers: [
      CredentialsProvider({
         name: "credentials",
         credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
         },
         async authorize(credentials) {
            try {
               const { email, password } = LoginSchema.parse(credentials);

               const db = getDb();
               const [rows] = (await db.execute(
                  "SELECT id, email, password, name, role, restaurant_id FROM users WHERE email = ? AND is_active = true",
                  [email]
               )) as [unknown[], unknown];

               if (!(rows as unknown[]).length) {
                  return null;
               }

               const user = (rows as DbUser[])[0];
               const passwordMatch = await bcrypt.compare(
                  password,
                  user.password
               );

               if (!passwordMatch) {
                  return null;
               }

               return {
                  id: user.id.toString(),
                  email: user.email,
                  name: user.name,
                  role: user.role,
                  restaurant_id: user.restaurant_id,
               };
            } catch (error) {
               console.error("Auth error:", error);
               return null;
            }
         },
      }),
   ],
   pages: {
      signIn: "/auth/signin",
   },
   callbacks: {
      async jwt({ token, user }) {
         if (user) {
            token.role = user.role;
            token.restaurant_id = user.restaurant_id;
         }
         return token;
      },
      async session({ session, token }) {
         if (token) {
            session.user.id = token.sub!;
            session.user.role = token.role as
               | "customer"
               | "restaurant_manager"
               | "delivery_man";
            session.user.restaurant_id = token.restaurant_id as
               | number
               | undefined;
         }
         return session;
      },
   },
   secret: process.env.NEXTAUTH_SECRET,
});
