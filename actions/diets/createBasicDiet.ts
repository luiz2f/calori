'use server'

import prisma from '@/prisma'
import { getSessionId } from '../session'
import { getDietIndex } from './diets'
import { BASIC_DIET } from './basic'

export async function createBasicDiet() {
  const userId = await getSessionId()
  if (!userId) throw new Error('Usuário não autenticado')

  try {
    const newDiet = await prisma.diet.create({
      data: {
        name: BASIC_DIET.name,
        userId,
        index: await getDietIndex(userId),
        meals: {
          create: BASIC_DIET.meals.map(meal => ({
            name: meal.name,
            time: meal.time,
            mealList: {
              create: meal.mealLists.map((list, listIndex) => ({
                name: list.name,
                index: listIndex + 1,
                mealListItems: {
                  create: list.items.map((item, idx) => ({
                    foodId: item.foodId,
                    unityId: item.unityId,
                    quantity: item.quantity,
                    index: idx + 1
                  }))
                }
              }))
            }
          }))
        }
      },
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

    const simplifiedDiet = {
      id: newDiet.id,
      name: newDiet.name,
      userId: newDiet.userId,
      index: newDiet.index,
      meals: newDiet.meals.map(meal => ({
        id: meal.id,
        name: meal.name,
        time: meal.time
      }))
    }

    return { newDiet, simplifiedDiet }
  } catch (error) {
    console.error('Erro ao criar dieta básica:', error)
    throw new Error('Erro ao criar dieta básica')
  }
}
