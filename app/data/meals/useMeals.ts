'use client'
import { getDietMeals } from '@/actions/diets/meals'
import { calculateMacros } from '@/utils/calculateMacros'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

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
