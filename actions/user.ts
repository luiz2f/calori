"use server";

import { auth } from "@/auth";
import prisma from "@/prisma";

export async function getUserDiets(userId: string) {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      diets: true,
    },
  });
}
