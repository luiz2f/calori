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
  console.log("fetch");
  return dietMeals;
}

export async function deleteMeal(mealId: string) {
  const mealToDelete = await prisma.meal.findUnique({
    where: {
      id: mealId,
    },
    select: {
      dietId: true, // Seleciona apenas o campo dietId
    },
  });

  await prisma.meal.delete({
    where: {
      id: mealId,
    },
  });
  return mealToDelete?.dietId;
}

export async function updateMeal({ mealId, mealName, mealTime, refs }) {
  // Busca os dados existentes da refeição e suas listas
  console.log(1);
  const mealToUpdate = await prisma.meal.findUnique({
    where: { id: mealId },
    select: {
      id: true,
      name: true,
      time: true,
      dietId: true,
      mealList: {
        select: {
          id: true,
          name: true,
          mealListItems: {
            select: {
              id: true,
              foodId: true,
              unityId: true,
              quantity: true,
              mealListId: true,
            },
          },
        },
      },
    },
  });

  console.log(2);
  // básico da refeição
  await prisma.meal.update({
    where: { id: mealId },
    data: {
      name: mealName,
      time: mealTime,
    },
  });

  console.log(3);
  const originalMealLists = mealToUpdate?.mealList.map((list) => list.id);
  const currentMealLists = refs.map((list) => list.id);

  // Identificar listas a serem deletadas
  const listsToDelete = originalMealLists?.filter(
    (id) => !currentMealLists?.includes(id)
  );
  console.log(4);

  const deleteMealLists = listsToDelete?.map(async (listId) => {
    await prisma.mealList.delete({
      where: { id: listId },
    });
  });

  console.log(5);
  const updateOrCreateMealLists = refs?.map(async (list) => {
    if (!list.id?.includes("-")) {
      // Atualiza lista existente
      await prisma.mealList.update({
        where: { id: list.id },
        data: {
          name: list.name,
        },
      });
      console.log(223);

      // Atualiza ou cria itens da lista
      const originalItemIds =
        mealToUpdate?.mealList
          .find((ml) => ml.id === list.id)
          ?.mealListItems?.map((item) => item.id) || [];

      const currentItemIds = list.mealListItems?.map((item) => item.id);
      const itemsToDelete = originalItemIds?.filter(
        (id) => !currentItemIds.includes(id)
      );
      console.log(323);

      // Deleta itens não mais presentes
      const deleteItems = itemsToDelete?.map(async (itemId) => {
        await prisma.mealListItem.delete({
          where: { id: itemId },
        });
      });
      console.log(7);

      // Atualiza ou cria itens
      const updateOrCreateItems = list.mealListItems?.map(async (item) => {
        if (!item.id.includes("-")) {
          console.log(2112);
          await prisma.mealListItem.update({
            where: { id: item.id },
            data: {
              foodId: item.foodId,
              unityId: item.unityId,
              quantity: toNumber(item.quantity),
            },
          });
        } else {
          console.log(22422222243);
          await prisma.mealListItem.create({
            data: {
              foodId: item.foodId,
              unityId: item.unityId,
              quantity: toNumber(item.quantity),
              mealListId: list.id,
              index: 0,
            },
          });
        }
      });

      // Aguardar todas as operações de itens
      await Promise.all(updateOrCreateItems);
      await Promise.all(deleteItems);
    } else {
      console.log(224443);
      await prisma.mealList.create({
        data: {
          name: list.name,
          mealId: mealId,
          index: 1,
          mealListItems: {
            create: list.mealListItems?.map((item) => ({
              foodId: item.foodId,
              unityId: item.unityId,
              quantity: toNumber(item.quantity),
              index: 1,
            })),
          },
        },
      });
    }
  });

  // Aguardar todas as operações assíncronas
  await Promise.all([...updateOrCreateMealLists, ...deleteMealLists]);

  console.log(252);

  return mealToUpdate?.dietId;
}

export async function createMeal({ mealName, mealTime, refs, dietId }) {
  // Criação básica da refeição
  const newMeal = await prisma.meal.create({
    data: {
      name: mealName,
      time: mealTime,
      dietId: dietId,
    },
  });

  if (refs) {
    const createMealLists = refs?.map(async (list) => {
      await prisma.mealList.create({
        data: {
          name: list.name,
          mealId: newMeal.id,
          index: 1,
          mealListItems: {
            create: list.mealListItems?.map((item) => ({
              foodId: item.foodId,
              unityId: item.unityId,
              quantity: toNumber(item.quantity),
              index: 1,
            })),
          },
        },
      });
    });

    await Promise.all(createMealLists);
  }
  // Aguardar todas as operações assíncronas

  return dietId;
}

function toNumber(number) {
  if (typeof number === "string") {
    // Remove as vírgulas, se houver
    number = number.replace(/,/g, "");
  }

  // Converte para número
  return parseFloat(number);
}
