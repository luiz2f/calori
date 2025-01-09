import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { saltAndHashPassword } from "./utils/helper";
import { generateTokenAndSendEmailVerification } from "./actions/token";
import { getUserByEmail, updateUser } from "./actions/auth";
import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    userId: string;
  }
}

class CustomError extends CredentialsSignin {
  code = "custom";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
        isRegistering: {
          label: "Registering",
          type: "boolean",
          optional: true,
        },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Invalid credentials");
        }

        const email = credentials.email as string;
        const hash = saltAndHashPassword(credentials.password);

        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (credentials.isRegistering) {
          // usuario não existe
          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                hashedPassword: hash,
              },
            });
            await generateTokenAndSendEmailVerification(email);
            throw new CustomError("Token sent");
          } else if (!user.hashedPassword) {
            user = await prisma.user.update({
              where: { email },
              data: { hashedPassword: hash },
            });
            await generateTokenAndSendEmailVerification(email);
            throw new CustomError("Token sent");
          } else if (!user.emailVerified) {
            await generateTokenAndSendEmailVerification(email);
            throw new CustomError("Token sent");
          } else {
            throw new CustomError("User already exists");
          }
        } else {
          if (!user) {
            throw new CustomError("Invalid credentials");
          } else if (!user.hashedPassword) {
            throw new CustomError("Invalid credentials");
          } else if (!user.emailVerified) {
            await generateTokenAndSendEmailVerification(email);
            throw new CustomError("Token sent");
          } else {
            const isMatch = bcrypt.compareSync(
              credentials.password as string,
              user.hashedPassword
            );
            if (!isMatch) {
              throw new CustomError("Invalid credentials");
            }
          }
        }
        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const existingUser = user?.email
          ? await getUserByEmail(user.email)
          : null;
        if (existingUser && "id" in existingUser) {
          if (existingUser.name && existingUser.image) {
            return true;
          }
          const name = existingUser.name || profile?.name || "";
          const image = existingUser.image || profile?.picture || "";

          await updateUser(existingUser.id, name, image);
        } else if (!profile) {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // Se o user existir (ex.: durante o login), adiciona o userId ao token
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Inclui o userId na sessão, disponível no client-side

      if (token.userId) {
        session.userId = token.userId as string;
      }
      return session;
    },
  },
});
