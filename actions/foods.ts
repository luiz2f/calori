import prisma from "@/prisma";

export async function getFoods() {
  const foods = await prisma.food.findMany({
    select: {
      id: true,
      name: true,
      carb: true,
      protein: true,
      fat: true,
      satFat: true,
      fiber: true,
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
  return foods;
}
