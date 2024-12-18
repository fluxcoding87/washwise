import { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "./db";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: string; // Adding the role field to the session
      hostel_id?: string | null;
    };
  }
  interface User {
    role: string | null;
    hostel_id?: string | null;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    role: string | null; // Adding the role field to the JWT token
    hostel_id?: string | null;
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid Credentials");
        }

        const user: User | null = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user || !user.hashedPassword) {
          throw new Error("Invalid Credentials");
        }
        const isCorrectPassowrd = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassowrd) {
          throw new Error("Invalid Credentials");
        }
        if (user) {
          return user;
        }
        return null;
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.hostel_id = user.hostel_id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.role) {
        session.user.role = token.role;
      }
      if (token.hostel_id) {
        session.user.hostel_id = token.hostel_id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
};
