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
            },
            orderBy: {
              createdAt: 'asc'
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

type updateMeal = {
  dietId: string
  mealId: string
  mealName: string
  mealTime: string
  refs: MealVar[]
}
export async function updateMeal({
  dietId,
  mealId,
  mealName,
  mealTime,
  refs
}: updateMeal) {
  // Busca o estado atual do meal no banco de dados
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
          index: true,
          mealListItems: {
            select: {
              id: true,
              foodId: true,
              unityId: true,
              quantity: true,
              index: true
            },
            orderBy: { index: 'asc' }
          }
        },
        orderBy: { index: 'asc' }
      }
    }
  })

  if (!mealToUpdate) {
    throw new Error('Meal not found')
  }

  // Atualiza os dados básicos da refeição
  await prisma.meal.update({
    where: { id: mealId },
    data: { name: mealName, time: mealTime }
  })

  // Identifica listas para remover
  const originalMealListIds = mealToUpdate.mealList.map(list => list.id)
  const currentMealListIds = refs.map(list => list.id)
  const listsToDelete = originalMealListIds.filter(
    id => !currentMealListIds.includes(id)
  )

  // Deleta listas removidas
  for (const listId of listsToDelete) {
    await prisma.mealList.delete({ where: { id: listId } })
  }

  // Processa cada lista de refeição em ordem
  for (const [listIndex, list] of refs.entries()) {
    if (!list.id.includes('-')) {
      // Atualiza lista existente
      const originalList = mealToUpdate.mealList.find(ml => ml.id === list.id)

      // Atualiza dados da lista
      await prisma.mealList.update({
        where: { id: list.id },
        data: {
          name: list.name,
          index: listIndex
        }
      })

      // Processa itens da lista
      const originalItems = originalList?.mealListItems || []
      const currentItems = list.mealListItems || []

      // Identifica itens para remover
      const itemsToDelete = originalItems
        .filter(item => !currentItems.some(ci => ci.id === item.id))
        .map(item => item.id)

      // Remove itens excluídos
      for (const itemId of itemsToDelete) {
        await prisma.mealListItem.delete({ where: { id: itemId } })
      }

      // Atualiza ou cria itens em ordem
      for (const [itemIndex, item] of currentItems.entries()) {
        if (!item.id.includes('-')) {
          // Atualiza item existente
          await prisma.mealListItem.update({
            where: { id: item.id },
            data: {
              foodId: item.foodId,
              unityId: item.unityId,
              quantity: toNumber(item.quantity),
              index: itemIndex
            }
          })
        } else {
          // Cria novo item
          await prisma.mealListItem.create({
            data: {
              foodId: item.foodId,
              unityId: item.unityId,
              quantity: toNumber(item.quantity),
              mealListId: list.id,
              index: itemIndex
            }
          })
        }
      }
    } else {
      // Cria nova lista com todos os itens
      await prisma.mealList.create({
        data: {
          name: list.name,
          mealId: mealId,
          index: listIndex,
          mealListItems: {
            create: list.mealListItems.map((item, itemIndex) => ({
              foodId: item.foodId,
              unityId: item.unityId,
              quantity: toNumber(item.quantity),
              index: itemIndex
            }))
          }
        }
      })
    }
  }

  return dietId
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
    for (const [listIndex, list] of refs.entries()) {
      await prisma.mealList.create({
        data: {
          name: list.name,
          mealId: newMeal.id,
          index: listIndex,
          mealListItems: {
            create: list.mealListItems?.map((item, itemIndex) => ({
              foodId: item.foodId,
              unityId: item.unityId,
              quantity: toNumber(item.quantity),
              index: itemIndex
            }))
          }
        }
      })
    }
  }

  return dietId
}

function toNumber(number: string | number) {
  if (typeof number === 'string') {
    number = number.replace(/,/g, '')
  }
  return parseFloat(number.toString())
}
