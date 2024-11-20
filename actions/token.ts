"use server";
import prisma from "@/prisma";
import { v4 as uuidv4 } from "uuid";
import { changePassword, getUserByEmail } from "./auth";
import { sendEmailVerification, sendPasswordResetEmail } from "./email";
import { Verificarion_purpose as VerificationPurpose } from "@prisma/client";

const PurposeMap: Record<string, VerificationPurpose> = {
  email: VerificationPurpose.EMAIL_VERIFICATION,
  password: VerificationPurpose.PASSWORD_RESET,
};

const emailVerificationTokenExpiration = 1000 * 60 * 60 * 24 * 7; // 7 days
const passwordResetTokenExpiration = 1000 * 60 * 60 * 24; // 24 hours
// 🔍
export async function getTokenByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return { error: "No user found" };
  }

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

// ✅
export async function checkTokenByType(token: string, type: string) {
  const purpose = PurposeMap[type.toLowerCase()];

  const existingToken = await getTokenByToken(token);

  if (!existingToken || "error" in existingToken) {
    return { error: "Invalid token" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken.identifier);

  if ("error" in existingUser) {
    return existingUser;
  }

  if (existingToken.purpose !== purpose) {
    return { error: "Invalid token" };
  }

  if (
    purpose === VerificationPurpose.PASSWORD_RESET &&
    !existingUser.emailVerified
  ) {
    return { error: "User not verified" };
  }

  return { existingToken, existingUser };
}

export async function verifyEmailToken(token: string) {
  const result = await checkTokenByType(token, "email");

  if ("error" in result) {
    return result;
  }

  const { existingToken, existingUser } = result;

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

// 🔒
export async function verifyResetPasswordToken(token: string) {
  const result = await checkTokenByType(token, "password");

  if ("error" in result) {
    return result;
  }

  return { success: "Token verified" };
}

export async function changePasswordByToken(token: string, formData: FormData) {
  const result = await checkTokenByType(token, "password");

  if ("error" in result) {
    return result;
  }
  const { existingUser } = result;

  const response = changePassword(existingUser.id, formData);

  return response;
}

// 🛡️👤
export async function generateVerificationToken(email: string) {
  const user = await getUserByEmail(email);

  if ("error" in user) {
    return user;
  }

  const token = uuidv4();
  const expires = new Date().getTime() + emailVerificationTokenExpiration; // 24 hour

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
export async function generateTokenAndSendEmailVerification(email: string) {
  const verificationToken = await generateVerificationToken(email);

  if ("error" in verificationToken) {
    return verificationToken;
  }
  await sendEmailVerification(email, verificationToken.token);
}
// 🛡️🔒
export async function generatePasswordResetToken(email: string) {
  const user = await getUserByEmail(email);

  if ("error" in user) {
    return user;
  }

  if (user.emailVerified) {
    return { error: "Verify your email" };
  }

  const token = uuidv4();
  const expires = new Date().getTime() + passwordResetTokenExpiration;

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
      purpose: VerificationPurpose.PASSWORD_RESET,
    },
  });
  return verificationToken;
}
export async function generateTokenAndSendPasswordResetEmail(email: string) {
  const verificationToken = await generatePasswordResetToken(email);

  if ("error" in verificationToken) {
    return verificationToken;
  }
  await sendPasswordResetEmail(email, verificationToken.token);
}
