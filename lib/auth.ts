import db from "@/prisma/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { userLoginSchema } from "./zod/userSchema.zod";
import bcrypt from "bcryptjs";

const adapter = PrismaAdapter(db);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
    Github({
      clientId: process.env.AUTH_GITHUB_ID ?? "",
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
    }),
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "email@example.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      authorize: async (credentials) => {
        const { success, data } = userLoginSchema.safeParse(credentials);
        if (!success) throw new Error("Email or password is incorrect");

        // get the user from database
        const user = await db.user.findUnique({
          where: {
            email: data.email,
          },
        });

        if (!user) throw new Error("Email or password is incorrect");

        // check if the password is correct
        const isMatch = bcrypt.compareSync(data.password, user.password || "");

        if (!isMatch) throw new Error("Email or password is incorrect");

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image:
            user.image ||
            "https://cdn-icons-png.flaticon.com/128/6997/6997674.png",
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
});
