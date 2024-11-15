"use server";

import { signIn, signOut } from "@/auth";
import prisma from "@/prisma";
import { NextApiResponse } from "next";
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
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
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
