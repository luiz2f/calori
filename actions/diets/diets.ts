"use server";

import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import { getSessionId } from "../session";

export async function getUserDiets() {
  const userId = await getSessionId();
  if (userId) {
    const userDiets = await prisma.diet.findMany({
      where: {
        userId: userId,
      },
      orderBy: { index: "asc" },
      select: {
        id: true,
        name: true,
        userId: true,
        index: true,
      },
    });
    return userDiets;
  }
}

interface CreateDietProps {
  dietName: string;
  refs: { name: string; time: string }[];
}

export async function getDietIndex(userId) {
  const maxIndex = await prisma.diet.findFirst({
    where: { userId },
    orderBy: { index: "desc" },
    select: { index: true },
  });

  const newIndex = maxIndex ? maxIndex.index + 1 : 1;

  return newIndex;
}

export async function createDiet({ userId, dietName, refs }) {
  console.log(`[${new Date().toLocaleTimeString()}] createDiet server`);

  const newIndex = await getDietIndex(userId);

  try {
    const newDiet = await prisma.diet.create({
      data: {
        name: dietName,
        userId,
        index: newIndex,
        meals: {
          create: refs.map((ref) => ({
            name: ref.name,
            time: ref.time,
          })),
        },
      },
      include: { meals: true },
    });
    console.log(
      `[${new Date().toLocaleTimeString()}] createDiet server concluído`
    );
    // revalidatePath("/diets");
    return newDiet;
  } catch (error) {
    console.error("Erro ao criar a dieta:", error);
    throw new Error("Erro ao criar a dieta");
  }
}

export async function duplicateDiet(dietId: string) {
  try {
    const dietToDuplicate = await prisma.diet.findUnique({
      where: { id: dietId },
      include: { meals: true },
    });

    if (!dietToDuplicate) {
      throw new Error("Dieta não encontrada");
    }

    const newIndex = await getDietIndex(dietToDuplicate.userId);
    const newDietName = `${dietToDuplicate.name} - Cópia`;

    // Cria a nova dieta com os meals diretamente
    const newDiet = await prisma.diet.create({
      data: {
        name: newDietName,
        userId: dietToDuplicate.userId,
        index: newIndex,
        archived: false,
        meals: {
          create: dietToDuplicate.meals.map((meal) => ({
            name: meal.name,
            time: meal.time,
          })),
        },
      },
      include: { meals: true }, // Inclui os meals no retorno
    });

    return newDiet;
  } catch (error) {
    console.error("Erro ao duplicar dieta:", error);
    throw new Error("Erro ao duplicar dieta");
  }
}

export async function deleteDiet(dietId: string) {
  try {
    const deletedDiet = await prisma.diet.delete({
      where: {
        id: dietId,
      },
    });
    // revalidatePath("/diets");
    return dietId;
  } catch (error) {
    console.error("Erro ao apagar a dieta:", error);
    throw new Error("Erro ao apagar a dieta");
  }
}

// MEALS
