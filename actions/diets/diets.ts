'use server'

import prisma from '@/prisma'
import { getSessionId } from '../session'

export type Ref = {
  id: string
  name: string
  time: string
  dietId?: string
  createdAt?: Date
  updatedAt?: Date
}
// const selectFullDiet = {
//   select: {
//     id: true,
//     name: true,
//     userId: true,
//     index: true,
//     archived: true,
//     meals: {
//       select: {
//         id: true,
//         name: true,
//         time: true,
//         dietId: true,
//         mealList: {
//           select: {
//             id: true,
//             name: true,
//             index: true,
//             mealListItems: {
//               select: {
//                 id: true,
//                 foodId: true,
//                 unityId: true,
//                 quantity: true,
//                 mealListId: true,
//                 index: true,
//                 food: {
//                   select: {
//                     id: true,
//                     name: true,
//                     carb: true,
//                     protein: true,
//                     fat: true,
//                   },
//                 },
//                 unity: {
//                   select: {
//                     id: true,
//                     foodId: true,
//                     un: true,
//                     unitMultiplier: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//       orderBy: {
//         time: "asc", // Ordena os meals por time
//       },
//     },
//   },
// };
export async function getUserDiets() {
  const userId = await getSessionId()
  if (userId) {
    const userDiets = await prisma.diet.findMany({
      where: {
        userId: userId
      },
      orderBy: { index: 'asc' },
      select: {
        id: true,
        name: true,
        userId: true,
        index: true,
        meals: { orderBy: { time: 'asc' } }
      }
    })

    return userDiets
  }
}

export async function getDietIndex(userId: string) {
  const maxIndex = await prisma.diet.findFirst({
    where: { userId },
    orderBy: { index: 'desc' },
    select: { index: true }
  })

  const newIndex = maxIndex ? maxIndex.index + 1 : 1

  return newIndex
}

type CreateDiet = {
  userId: string
  dietName: string
  refs?: Ref[]
}

export async function createDiet({ userId, dietName, refs }: CreateDiet) {
  const newIndex = await getDietIndex(userId)

  if (!userId) {
    throw new Error('Invalid User ID')
  }

  try {
    const newDiet = await prisma.diet.create({
      data: {
        name: dietName,
        userId,
        index: newIndex,
        meals: {
          create: refs?.map(ref => ({
            name: ref.name,
            time: ref.time
          }))
        }
      },
      include: { meals: true }
    })

    return newDiet
  } catch (error) {
    console.error('Erro ao criar a dieta:', error)
    throw new Error('Erro ao criar a dieta')
  }
}
export async function duplicateDiet(dietId: string) {
  try {
    const dietToDuplicate = await prisma.diet.findUnique({
      where: { id: dietId },
      include: {
        meals: { include: { mealList: { include: { mealListItems: true } } } }
      }
    })

    if (!dietToDuplicate) {
      throw new Error('Dieta não encontrada')
    }

    const newIndex = await getDietIndex(dietToDuplicate.userId)
    const newDietName = `${dietToDuplicate.name} - Cópia`

    const newDiet = await prisma.diet.create({
      data: {
        name: newDietName,
        userId: dietToDuplicate.userId,
        index: newIndex,
        archived: false,
        meals: {
          create: dietToDuplicate.meals.map(meal => ({
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
                    index: itemIndex
                  }))
                }
              }))
            }
          }))
        }
      },
      include: {
        meals: {
          include: {
            mealList: {
              include: {
                mealListItems: { include: { food: true, unity: true } }
              }
            }
          }
        }
      }
    })

    return newDiet
  } catch (error) {
    console.error('Erro ao duplicar dieta:', error)
    throw new Error('Erro ao duplicar dieta')
  }
}
type UpdateDiet = {
  dietId: string
  dietName: string
  refs?: Ref[]
}
export async function updateDiet({ dietId, dietName, refs }: UpdateDiet) {
  if (!dietId) throw new Error('Invalid Diet ID')
  const originalMeals = await prisma.meal.findMany({
    where: { dietId: dietId },
    select: { id: true }
  })

  const originalMealIds = originalMeals.map(meal => meal.id)
  const currentMealIds = refs?.map(meal => meal.id)

  const mealsToDelete = originalMealIds.filter(
    id => !currentMealIds?.includes(id)
  )

  const deletedMeals = mealsToDelete.map(async mealId => {
    await prisma.meal.delete({
      where: { id: mealId }
    })
  })

  await prisma.diet.update({
    where: { id: dietId },
    data: { name: dietName }
  })

  const updatedMeals =
    refs?.map(async meal => {
      // the newrefs id generated by the client are uuidv4
      if (!meal.id.includes('-')) {
        await prisma.meal.update({
          where: { id: meal.id },
          data: {
            name: meal.name,
            time: meal.time
          }
        })
      } else {
        await prisma.meal.create({
          data: {
            name: meal.name,
            time: meal.time,
            dietId: dietId
          }
        })
      }
    }) || []

  await Promise.all([...updatedMeals, ...deletedMeals])
  return { dietId, dietName, refs }
}

export async function deleteDiet(dietId: string) {
  try {
    await prisma.diet.delete({
      where: {
        id: dietId
      }
    })
    return dietId
  } catch (error) {
    console.error('Erro ao apagar a dieta:', error)
    throw new Error('Erro ao apagar a dieta')
  }
}
