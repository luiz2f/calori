'use client'
import { duplicateDiet as duplicateDietAPI } from '@/actions/diets/diets'
import { Diet } from '@/app/(authenticated)/app'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const filterData = (data: Diet) => {
  return {
    id: data?.id,
    name: data?.name,
    userId: data?.userId,
    index: data?.index,
    meals: data?.meals
      .filter(meal => meal.hasOwnProperty('mealList'))
      .map(meal => ({
        id: meal.id,
        name: meal.name,
        time: meal.time,
        dietId: meal.dietId
      }))
  }
}
export function useDuplicateDiet() {
  const queryClient = useQueryClient()

  const { isPending: isDuplicating, mutate: duplicateDiet } = useMutation({
    mutationFn: duplicateDietAPI,
    onSuccess: data => {
      if (data) {
        queryClient.setQueryData([`meals-diet-${data?.id}`], data)
        const newDiet = filterData(data)
        queryClient.setQueryData(['diets'], oldDiets => {
          return [...(Array.isArray(oldDiets) ? oldDiets : []), newDiet]
        })
      }
    },
    onError: error => {
      console.error('useDuplicateDiet', error)
    }
  })

  return { isDuplicating, duplicateDiet }
}
