"use server";

import { auth, signIn, signOut } from "@/auth";
import prisma from "@/prisma";
import { saltAndHashPassword } from "@/utils/helper";
import { User } from "@prisma/client";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export const login = async (provider: string) => {
  const user = await signIn(provider, { redirectTo: "/" });
  revalidatePath("/diets");
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
  revalidatePath("/");
};

// 📌 SEGURANÇA - NAO DEIXAR BUSCAR A HASHED, APENAS  ID NOME EMAIL IMAGEM
export const getUserByEmail = async (
  email: string
): Promise<User | { error: string }> => {
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

export const changePasswordByEmail = async (
  userEmail: string,
  formData: FormData
) => {
  const session = await auth();
  const user = await getUserByEmail(userEmail);

  if (!user || "error" in user) {
    console.log(2);
    return { error: "An unexpected error occurred" };
  }
  const { currentPassword, newPassword, confirmNewPassword } =
    Object.fromEntries(formData) as Record<string, string>;

  const isMatch = bcrypt.compareSync(
    currentPassword as string,
    user.hashedPassword!
  );

  if (!isMatch) {
    return { error: "Invalid current password" };
  }

  if (newPassword !== confirmNewPassword) {
    return { error: "New passwords do not match" };
  }
  if (session?.user?.email !== userEmail) {
    return { error: "An unexpected error occurred" };
  }

  const newHash = saltAndHashPassword(newPassword);

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword: newHash },
    });
    return { success: "Password successfully changed" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to change password" };
  }
};

export const updateUser = async (
  userID: string,
  name: string,
  image: string
) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userID },
      data: { name, image },
    });
    return updatedUser;
  } catch (error) {
    console.error(error);
    return null;
  }
};
