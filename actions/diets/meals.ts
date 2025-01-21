'use server'

import { MealVar } from '@/components/by-page/diets/selectedDiet/Refs/createEditRef/EditRef'
import prisma from '@/prisma'

export async function getDietMeals(dietId: string) {
  if (!dietId) {
    return null
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
                      fat: true
                    }
                  },
                  unity: {
                    select: {
                      id: true,
                      foodId: true,
                      un: true,
                      unitMultiplier: true
                    }
                  }
                },
                orderBy: {
                  quantity: 'desc'
                }
              }
            }
          }
        },
        orderBy: {
          time: 'asc'
        }
      }
    }
  })

  return dietMeals
}

export async function deleteMeal(mealId: string) {
  const mealToDelete = await prisma.meal.findUnique({
    where: {
      id: mealId
    },
    select: {
      dietId: true
    }
  })

  await prisma.meal.delete({
    where: {
      id: mealId
    }
  })
  return mealToDelete?.dietId
}
// type Macro = {
//   carb: number
//   prot: number
//   fat: number
//   kcal: number
// }
// type Food = {
//   carb: number
//   protein: number
//   fat: number
//   id: string
//   name: string
//   unities?: Unity[]
//   erro?: boolean
// }
// type Unity = {
//   foodId: string
//   id: string
//   un: string
//   unitMultiplier: number
//   erro?: boolean
// }
// export type MealItem = {
//   id: string
//   foodId: string
//   unityId: string
//   quantity: number
//   mealListId?: string
//   index?: number
//   food: Food
//   unity: Unity
// }
// export type Meal = {
//   id: string
//   name: string
//   index?: number
//   mealListItems: MealItem[]
//   macro?: Macro
// }

type updateMeal = {
  mealId: string
  mealName: string
  mealTime: string
  refs: MealVar[]
}
export async function updateMeal({
  mealId,
  mealName,
  mealTime,
  refs
}: updateMeal) {
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
              mealListId: true
            }
          }
        }
      }
    }
  })

  await prisma.meal.update({
    where: { id: mealId },
    data: {
      name: mealName,
      time: mealTime
    }
  })

  const originalMealLists = mealToUpdate?.mealList.map(list => list.id)
  const currentMealLists = refs.map(list => list.id)

  const listsToDelete = originalMealLists?.filter(
    id => !currentMealLists?.includes(id)
  )

  const deleteMealLists =
    listsToDelete?.map(async listId => {
      await prisma.mealList.delete({
        where: { id: listId }
      })
    }) || []

  const updateOrCreateMealLists = refs?.map(async list => {
    if (!list.id?.includes('-')) {
      await prisma.mealList.update({
        where: { id: list.id },
        data: {
          name: list.name
        }
      })

      const originalItemIds =
        mealToUpdate?.mealList
          ?.find(ml => ml.id === list.id)
          ?.mealListItems?.map(item => item.id) || []

      const currentItemIds = list.mealListItems?.map(item => item.id)
      const itemsToDelete = originalItemIds?.filter(
        id => !currentItemIds?.includes(id)
      )

      const deleteItems = itemsToDelete?.map(async itemId => {
        await prisma.mealListItem.delete({
          where: { id: itemId }
        })
      })

      const updateOrCreateItems =
        list.mealListItems?.map(async item => {
          if (!item.id.includes('-')) {
            await prisma.mealListItem.update({
              where: { id: item.id },
              data: {
                foodId: item.foodId,
                unityId: item.unityId,
                quantity: toNumber(item.quantity)
              }
            })
          } else {
            await prisma.mealListItem.create({
              data: {
                foodId: item.foodId,
                unityId: item.unityId,
                quantity: toNumber(item.quantity),
                mealListId: list.id,
                index: 0
              }
            })
          }
        }) || []

      await Promise.all(updateOrCreateItems)
      await Promise.all(deleteItems)
    } else {
      await prisma.mealList.create({
        data: {
          name: list.name,
          mealId: mealId,
          index: 1,
          mealListItems: {
            create: list.mealListItems?.map(item => ({
              foodId: item.foodId,
              unityId: item.unityId,
              quantity: toNumber(item.quantity),
              index: 1
            }))
          }
        }
      })
    }
  })

  await Promise.all([...updateOrCreateMealLists, ...deleteMealLists])

  return mealToUpdate?.dietId
}

type createMeal = {
  mealName: string
  mealTime: string
  refs: MealVar[]
  dietId: string
}
export async function createMeal({
  mealName,
  mealTime,
  refs,
  dietId
}: createMeal) {
  const newMeal = await prisma.meal.create({
    data: {
      name: mealName,
      time: mealTime,
      dietId: dietId
    }
  })

  if (refs) {
    const createMealLists = refs?.map(async list => {
      await prisma.mealList.create({
        data: {
          name: list.name,
          mealId: newMeal.id,
          index: 1,
          mealListItems: {
            create: list.mealListItems?.map(item => ({
              foodId: item.foodId,
              unityId: item.unityId,
              quantity: toNumber(item.quantity),
              index: 1
            }))
          }
        }
      })
    })

    await Promise.all(createMealLists)
  }

  return dietId
}

function toNumber(number: string | number) {
  if (typeof number === 'string') {
    number = number.replace(/,/g, '')
  }
  return parseFloat(number.toString())
}
