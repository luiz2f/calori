"use server";
import { auth } from "@/auth";
import prisma from "@/prisma";

export async function getFoods() {
  const session = await auth();
  const userId = session.userId;

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
  const session = await auth();
  const userId = session.userId;

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

export async function createFood(data, userId) {
  let { name, quantity, unity, carb, prot, fat } = data;

  carb = parseFloat(carb.toFixed(4));
  prot = parseFloat(prot.toFixed(4));
  fat = parseFloat(fat.toFixed(4));
  quantity = parseFloat(quantity.toFixed(4));

  if (!userId) {
    const session = await auth();
    userId = session.userId;
  }
  const foodData = {
    name,
    carb: parseFloat(carb),
    protein: parseFloat(prot),
    fat: parseFloat(fat),
    satFat: 0.0,
    fiber: 0.0,
    userFood: true,
    userId,
  };
  const food = await prisma.food.create({ data: foodData });

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
  });

  const response = { food, unityRecord };
  const newFood = { ...food, unities: [unityRecord] };

  return newFood;
}

export async function deleteFood(foodId) {
  const session = await auth();
  const userId = session.userId;

  const deletedFood = await prisma.food.delete({
    where: {
      id: foodId,
      userFood: true,
      userId: userId,
    },
  });

  return deletedFood;
}

export async function updateFood({ inputs, foodId, unityId }) {
  const unitMultiplier = 1 / inputs.quantity;
  const updatedFood = await prisma.food.update({
    where: {
      id: foodId,
    },
    data: {
      name: inputs.name,
      carb: inputs.carb,
      protein: inputs.prot,
      fat: inputs.fat,
      unities: {
        update: {
          where: {
            id: unityId,
          },
          data: {
            un: inputs.unity,
            unitMultiplier,
          },
        },
      },
    },
    include: {
      unities: true, // Inclui as unities atualizadas no retorno
    },
  });
  return updatedFood;
}
