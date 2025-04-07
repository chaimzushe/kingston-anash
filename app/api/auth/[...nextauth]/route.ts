import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hash } from "bcrypt";
import { sanityClient } from "@/lib/sanity";

// This is a simplified version - in a real app, you'd use a proper database
// We're using Sanity to store user data for this example
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user in Sanity
          const user = await sanityClient.fetch(
            `*[_type == "user" && email == $email][0]`,
            { email: credentials.email }
          );

          if (!user) {
            return null;
          }

          // Check if user is verified
          if (!user.isVerified) {
            throw new Error("Account not verified. Please contact an administrator.");
          }

          // Verify password
          const isPasswordValid = await compare(credentials.password, user.password);
          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
            role: user.role || "member"
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error(error instanceof Error ? error.message : "Authentication failed");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isVerified = user.isVerified;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.isVerified = token.isVerified;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
