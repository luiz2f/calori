"use server";

import prisma from "@/prisma";
import { getSessionId } from "../session";
import { revalidatePath } from "next/cache";

export async function getDietMeals(dietId: string) {
  if (!dietId) {
    return null;
  }
  const dietMeals = await prisma.meal.findMany({
    where: {
      dietId,
    },
    orderBy: {
      time: "asc",
    },
  });

  return dietMeals;
}

export async function deleteMeal(mealId: string) {
  const userId = await getSessionId();

  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
    include: { diet: { select: { userId: true } } },
  });

  if (meal?.diet.userId !== userId) {
    return null;
  }

  const deletedMeal = await prisma.meal.delete({
    where: {
      id: mealId,
    },
  });

  revalidatePath("/diets");

  return;
}

export async function createMeal(dietId, meal) {
  try {
    const newMeal = await prisma.meal.create({
      data: {
        name: meal.name,
        time: meal.time,
        dietId,
      },
    });
  } catch (error) {
    console.error("Erro ao criar refeição:", error);
  } finally {
    revalidatePath("/diets");
  }

  return;
}
