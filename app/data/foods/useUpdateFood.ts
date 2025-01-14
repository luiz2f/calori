'use client'

import { updateFood as updateFoodAPI } from '@/actions/foods'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { calculateMacros } from '../meals/useMeals'
import { Diet, Food } from '@/app/(authenticated)/app'

export function useUpdateFood() {
  const queryClient = useQueryClient()
  const {
    isPending: isUpdating,
    isSuccess,
    mutate: updateFood,
    reset
  } = useMutation({
    mutationFn: updateFoodAPI,
    onSuccess: data => {
      queryClient.setQueryData<Food[]>(['foods'], oldFoods => {
        return oldFoods?.map(food =>
          food.id === data.id ? { ...food, ...data } : food
        )
      })
      queryClient.setQueryData<Food[]>(['userFoods'], oldUserFoods => {
        return oldUserFoods?.map(food =>
          food.id === data.id ? { ...food, ...data } : food
        )
      })

      const allMealsQueries = queryClient
        .getQueriesData({})
        .filter(
          ([queryKey]) =>
            Array.isArray(queryKey) &&
            queryKey[0]?.toString().startsWith('meals')
        )
      // Atualiza os dados de cada query
      allMealsQueries.forEach(([queryKey, queryData]) => {
        const updatedMeals = (queryData as Diet).meals?.map(meal => ({
          ...meal,
          mealList: meal.mealList?.map(mealItem => ({
            ...mealItem,
            mealListItems: mealItem.mealListItems?.map(item => {
              if (item.foodId === data.id) {
                // Substitui as informações do item na query
                const updatedFood = { ...item.food, ...data }
                return {
                  ...item,
                  food: updatedFood,
                  unity: data.unities[0] // Substitui a unidade
                }
              }
              return item
            }),
            macro: calculateMacros(mealItem) // Recalcula os macros aqui
          }))
        }))

        // Atualiza a query com as refeições modificadas
        queryClient.setQueryData(queryKey, {
          ...(queryData as object),
          meals: updatedMeals
        })
      })
    },
    onError: error => {
      console.error('useUpdateFood', error)
    }
  })

  return { isUpdating, isSuccess, updateFood, reset }
}
