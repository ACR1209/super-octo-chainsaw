import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient, User } from "@prisma/client";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";

const loginUserSchema = z.object({
  username: z.string().regex(/^[a-zA-Z0-9_]{3,20}$/, "Invalid username"),
  password: z.string().min(5, "Password should be minimum 5 characters"),
});
const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        username: { type: "text", placeholder: "aea" },
        password: { type: "password", placeholder: "Pa$$w0rd" },
      },
      async authorize(credentials, req) {
        const { username, password } = loginUserSchema.parse(credentials);
        const user = await prisma.user.findUnique({
          where: { username },
        });
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return null;

        await prisma.user.update({
          where: { username },
          data: { last_loged: new Date() },
        });

        return user;
      },
    }),
  ],
  callbacks: {
    session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.name = token.name;
      return session;
    },
    jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.username = (user as User).username;
        token.name = (user as User).name;
        console.log(user);
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
