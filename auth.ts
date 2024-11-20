import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { saltAndHashPassword } from "./utils/helper";
import { FormError } from "./app/models/FormError";
import {
  generateTokenAndSendEmailVerification,
  generateVerificationToken,
} from "./actions/token";
import { sendEmailVerification } from "./actions/email";
import { revalidatePath } from "next/cache";

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
            // usuario existe, mas não tem senha
          } else if (!user.hashedPassword) {
            user = await prisma.user.update({
              where: { email },
              data: { hashedPassword: hash },
            });
            ////// Update user hashedpassword + token de verificação
            await generateTokenAndSendEmailVerification(email);
            throw new CustomError("Token sent");

            // usuario existe, tem senha, mas não verificou o token
          } else if (!user.emailVerified) {
            await generateTokenAndSendEmailVerification(email);
            throw new CustomError("Token sent");
            // usuario existe, tem senha, verificou o token
          } else {
            throw new CustomError("User already exists");
            //// client options : fazer login ou recuperar senha
          }
        } else {
          if (!user) {
            throw new CustomError("Invalid credentials");
          } else if (!user.hashedPassword) {
            throw new CustomError("Invalid credentials");
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
});

// console.log("W");
// if (!user) {
//   user = await prisma.user.create({
//     data: {
//       email,
//       hashedPassword: hash,
//     },
//   });
// } else if (!user.hashedPassword) {
//   user = await prisma.user.update({
//     where: { email },
//     data: { hashedPassword: hash },
//   });
// } else {
//   throw new Error("User already exists");
// }
