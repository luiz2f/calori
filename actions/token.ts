"use server";

import prisma from "@/prisma";
import { v4 as uuidv4 } from "uuid";
import { getUserByEmail } from "./auth";
import { sendEmailVerification } from "./email";

export async function getTokenByEmail(email: string) {
  const verificationToken = await prisma.verificationRequest.findFirst({
    where: { identifier: email },
  });

  if (!verificationToken) {
    return { error: "No token found" };
  }

  return verificationToken;
}

export async function getTokenByToken(token: string) {
  const verificationToken = await prisma.verificationRequest.findFirst({
    where: { token: token },
  });

  if (!verificationToken) {
    return { error: "No token found" };
  }

  return verificationToken;
}

export async function newVerification(token: string) {
  const existingToken = await getTokenByToken(token);

  if (!existingToken || "error" in existingToken) {
    return { error: "Invalid token" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken.identifier);

  if (!existingUser) {
    return { error: "User not found" };
  }

  await prisma.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.identifier,
    },
  });

  await prisma.verificationRequest.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email verified" };
}

export async function generateVerificationToken(email: string) {
  const token = uuidv4();
  const expires = new Date().getTime() + 1000 * 60 * 60 * 1; // 1 hour

  const existingToken = await getTokenByEmail(email);

  if (existingToken && "id" in existingToken) {
    await prisma.verificationRequest.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await prisma.verificationRequest.create({
    data: {
      identifier: email,
      token,
      expires: new Date(expires),
    },
  });
  return verificationToken;
}

export async function generateTokenAndSentEmailVerification(email: string) {
  const verificationToken = await generateVerificationToken(email);
  if (!verificationToken.token) {
    return { error: "Error generating token" };
  }
  await sendEmailVerification(email, verificationToken.token);
}
