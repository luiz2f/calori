'use client'
import { getDietMeals } from '@/actions/diets/meals'
import { MealVarMacro } from '@/app/context/useMacroContext'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export const calculateMacros = (variation: MealVarMacro) => {
  let carb = 0
  let prot = 0
  let fat = 0
  let kcal = 0
  if (!!variation?.mealListItems?.length) {
    variation.mealListItems.forEach(item => {
      carb +=
        (item?.food?.carb ?? 0) *
        item.quantity *
        (item?.unity?.unitMultiplier ?? 0)
      prot +=
        (item?.food?.protein ?? 0) *
        item.quantity *
        (item?.unity?.unitMultiplier ?? 0)
      fat +=
        (item?.food?.fat ?? 0) *
        item.quantity *
        (item?.unity?.unitMultiplier ?? 0)
    })

    carb = Math.round(carb)
    prot = Math.round(prot)
    fat = Math.round(fat)
    kcal = Math.round((carb + prot) * 4 + fat * 9)
  }

  return { carb, prot, fat, kcal }
}

export function useMeals(dietId: string) {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: [`meals-diet-${dietId}`],
    queryFn: () => getDietMeals(dietId)
  })

  const mealsWithMacros = useMemo(() => {
    if (data?.meals) {
      return {
        ...data,
        meals: data?.meals?.map(meal => ({
          ...meal,
          mealList: meal?.mealList?.map(variation => ({
            ...variation,
            macro: calculateMacros(variation)
          }))
        }))
      }
    }
    return data
  }, [data])

  return { data: mealsWithMacros, isLoading, isSuccess }
}
