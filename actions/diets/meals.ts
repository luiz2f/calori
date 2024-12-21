"use server";

import prisma from "@/prisma";
import { getSessionId } from "../session";

export async function getDietMeals(dietId: string) {
  if (!dietId) {
    return null;
  }
  const dietMeals = await prisma.diet.findUnique({
    where: { id: dietId },
    select: {
      id: true,
      name: true,
      userId: true,
      index: true,
      archived: true,
      meals: {
        select: {
          id: true,
          name: true,
          time: true,
          dietId: true,
          mealList: {
            select: {
              id: true,
              name: true,
              index: true,
              mealListItems: {
                select: {
                  id: true,
                  foodId: true,
                  unityId: true,
                  quantity: true,
                  mealListId: true,
                  index: true,
                  food: {
                    select: {
                      id: true,
                      name: true,
                      carb: true,
                      protein: true,
                      fat: true,
                    },
                  },
                  unity: {
                    select: {
                      id: true,
                      foodId: true,
                      un: true,
                      unitMultiplier: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          time: "asc", // Ordena os meals por time
        },
      },
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

  // revalidatePath("/diets");

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
    // revalidatePath("/diets");
  }

  return;
}
