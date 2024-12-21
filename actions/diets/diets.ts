"use server";

import prisma from "@/prisma";
import { getSessionId } from "../session";

const selectFullDiet = {
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
};
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
        meals: { orderBy: { time: "asc" } },
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

    // revalidatePath("/diets");
    return newDiet;
  } catch (error) {
    console.error("Erro ao criar a dieta:", error);
    throw new Error("Erro ao criar a dieta");
  }
}
export async function duplicateDiet(dietId: string) {
  console.log(1);
  try {
    const dietToDuplicate = await prisma.diet.findUnique({
      where: { id: dietId },
      include: {
        meals: { include: { mealList: { include: { mealListItems: true } } } },
      },
    });
    console.log(2);

    if (!dietToDuplicate) {
      throw new Error("Dieta não encontrada");
    }

    const newIndex = await getDietIndex(dietToDuplicate.userId);
    const newDietName = `${dietToDuplicate.name} - Cópia`;

    console.log(3);
    const newDiet = await prisma.diet.create({
      data: {
        name: newDietName,
        userId: dietToDuplicate.userId,
        index: newIndex,
        archived: false,
        meals: {
          create: dietToDuplicate.meals.map((meal, mealIndex) => ({
            name: meal.name,
            time: meal.time,
            mealList: {
              create: meal.mealList.map((mealList, mealListIndex) => ({
                name: mealList.name,
                index: mealListIndex,
                mealListItems: {
                  create: mealList.mealListItems.map((item, itemIndex) => ({
                    foodId: item.foodId,
                    unityId: item.unityId,
                    quantity: item.quantity,
                    index: itemIndex,
                  })),
                },
              })),
            },
          })),
        },
      },
      include: {
        meals: {
          include: {
            mealList: {
              include: {
                mealListItems: { include: { food: true, unity: true } },
              },
            },
          },
        },
      },
    });
    console.log(4);

    return newDiet;
  } catch (error) {
    console.error("Erro ao duplicar dieta:", error);
    throw new Error("Erro ao duplicar dieta");
  }
}

export async function updateDiet({ dietId, dietName, refs }) {
  const originalMeals = await prisma.meal.findMany({
    where: { dietId: dietId },
    select: { id: true },
  });

  const originalMealIds = originalMeals.map((meal) => meal.id);
  const currentMealIds = refs.map((meal) => meal.id);

  const mealsToDelete = originalMealIds.filter(
    (id) => !currentMealIds.includes(id)
  );

  // Deletar refeições
  const deletedMeals = mealsToDelete.map(async (mealId) => {
    await prisma.meal.delete({
      where: { id: mealId },
    });
  });

  await prisma.diet.update({
    where: { id: dietId },
    data: { name: dietName },
  });

  // Atualizar ou criar refeições
  const updatedMeals = refs.map(async (meal) => {
    // the newrefs id generated by the client are uuidv4
    if (!meal.id.includes("-")) {
      await prisma.meal.update({
        where: { id: meal.id },
        data: {
          name: meal.name,
          time: meal.time,
        },
      });
    } else {
      // Criar novas refeições
      await prisma.meal.create({
        data: {
          name: meal.name,
          time: meal.time,
          dietId: dietId, // Não inclui mealList, pois não será alterada
        },
      });
    }
  });

  // Aguardar todas as operações assíncronas serem concluídas
  await Promise.all([...updatedMeals, ...deletedMeals]);
  return;
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
