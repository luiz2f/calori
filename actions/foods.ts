"use server";
import prisma from "@/prisma";
import { getSessionId } from "./session";

type FoodInput = {
  name: string;
  quantity: number;
  unity: string;
  carb: number;
  prot: number;
  fat: number;
};

export async function getFoods() {
  const userId = await getSessionId();

  const defaultFoods = await prisma.food.findMany({
    select: {
      id: true,
      name: true,
      carb: true,
      protein: true,
      fat: true,
      satFat: true,
      fiber: true,
      userFood: true,
      unities: {
        select: {
          id: true,
          foodId: true,
          un: true,
          unitMultiplier: true,
        },
      },
    },
    where: {
      userFood: false, // Filtra apenas os registros onde userFood é false
    },
  });

  if (!userId) {
    return defaultFoods;
  }

  const userFoods = await prisma.food.findMany({
    select: {
      id: true,
      name: true,
      carb: true,
      protein: true,
      fat: true,
      satFat: true,
      fiber: true,
      userFood: true,
      unities: {
        select: {
          id: true,
          foodId: true,
          un: true,
          unitMultiplier: true,
        },
      },
    },
    where: {
      userFood: true,
      userId: userId,
    },
  });

  const foods = [...defaultFoods, ...userFoods];

  return foods;
}

export async function getUserFoods() {
  const userId = await getSessionId();

  const userFoods = await prisma.food.findMany({
    select: {
      id: true,
      name: true,
      carb: true,
      protein: true,
      fat: true,
      satFat: true,
      fiber: true,
      userFood: true,
      unities: {
        select: {
          id: true,
          foodId: true,
          un: true,
          unitMultiplier: true,
        },
      },
    },
    where: {
      userFood: true,
      userId: userId,
    },
  });

  return userFoods;
}

export async function createFood(data: FoodInput, userId: string) {
  {
    const { name, unity } = data;
    let { quantity, carb, prot, fat } = data;
    let idUser = userId;
    carb = parseFloat(carb.toFixed(4));
    prot = parseFloat(prot.toFixed(4));
    fat = parseFloat(fat.toFixed(4));
    quantity = parseFloat(quantity.toFixed(4));

    if (!idUser) {
      idUser = await getSessionId();
    }
    const foodData = {
      name,
      carb,
      protein: prot,
      fat,
      satFat: 0.0,
      fiber: 0.0,
      userFood: true,
      userId: idUser,
    };
    const food = await prisma.food.create({
      data: foodData,
      select: {
        id: true,
        name: true,
        carb: true,
        protein: true,
        fat: true,
        satFat: true,
        fiber: true,
        userFood: true,
      },
    });

    if (!food) {
      return { error: "Error returning food" };
    }

    const unitMultiplier = parseFloat((1 / quantity).toFixed(6));

    const unityRecord = await prisma.unity.create({
      data: {
        foodId: food.id,
        un: unity,
        unitMultiplier,
      },
      select: {
        id: true,
        foodId: true,
        un: true,
        unitMultiplier: true,
      },
    });

    const newFood = { ...food, unities: [unityRecord] };

    return newFood;
  }
}

export async function deleteFood(foodId: string) {
  const userId = await getSessionId();

  const deletedFood = await prisma.food.delete({
    where: {
      id: foodId,
      userFood: true,
      userId: userId,
    },
  });

  return deletedFood;
}

export async function updateFood({
  inputs,
  foodId,
  unityId,
}: {
  inputs: FoodInput;
  foodId: string;
  unityId: string;
}) {
  const { name, unity } = inputs;
  let { quantity, carb, prot, fat } = inputs;

  carb = parseFloat(carb.toFixed(4));
  prot = parseFloat(prot.toFixed(4));
  fat = parseFloat(fat.toFixed(4));
  quantity = parseFloat(quantity.toFixed(4));
  const unitMultiplier = parseFloat((1 / quantity).toFixed(6));

  const updatedFood = await prisma.food.update({
    where: {
      id: foodId,
    },
    data: {
      name,
      carb,
      protein: prot,
      fat,
      unities: {
        update: {
          where: {
            id: unityId,
          },
          data: {
            un: unity,
            unitMultiplier,
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      carb: true,
      protein: true,
      fat: true,
      satFat: true,
      fiber: true,
      userFood: true,
      unities: {
        select: {
          id: true,
          foodId: true,
          un: true,
          unitMultiplier: true,
        },
      },
    },
  });

  return updatedFood;
}
