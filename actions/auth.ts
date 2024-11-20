"use server";

import { auth, signIn, signOut } from "@/auth";
import prisma from "@/prisma";
import { saltAndHashPassword } from "@/utils/helper";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

export const login = async (provider: string) => {
  await signIn(provider, { redirectTo: "/" });
  revalidatePath("/");
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
  revalidatePath("/");
};

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return { error: "User not found" };
  }
  return user;
};

export const loginWithCredentials = async (formData: FormData) => {
  const rawFormData = {
    email: formData.get("email"),
    password: formData.get("password"),
    role: "USER",
    redirectTo: "/",
    redirect: false,
  };

  try {
    await signIn("credentials", rawFormData);
  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CallbackRouteError" || "CredentialsSignin":
          return { error: error.message };
        default:
          return { error: error.message };
      }
    }

    throw error;
  }
  //📌 sera que da bom se logar com conta existente normal?
  revalidatePath("/");
};

export const registerWithCredentials = async (formData: FormData) => {
  const rawFormData = {
    email: formData.get("email"),
    password: formData.get("password"),
    role: "USER",
    redirect: false,
    isRegistering: true,
  };

  try {
    await signIn("credentials", rawFormData);
  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CallbackRouteError" || "CredentialsSignin":
          return { error: error.message };
        default:
          return { error: error.message };
      }
    }

    throw error;
  }
  revalidatePath("/");
};

export const changePassword = async (userID: string, formData: FormData) => {
  const session = await auth();

  const newPassword = {
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  if (newPassword.password !== newPassword.confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (session?.user?.id === userID) {
    return { error: "An unexpected error occurred" };
  }

  const hash = saltAndHashPassword(newPassword.password);

  try {
    await prisma.user.update({
      where: { id: userID },
      data: { hashedPassword: hash },
    });
    return { success: "Password successfully changed" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to change password" };
  }
};
