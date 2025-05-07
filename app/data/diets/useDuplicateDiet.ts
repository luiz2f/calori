'use client'
import { duplicateDiet as duplicateDietAPI } from '@/actions/diets/diets'
import { useDietContext } from '@/app/context/useDietContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDuplicateDiet() {
  const queryClient = useQueryClient()
  const { setSelectedDiet } = useDietContext()

  const { isPending: isDuplicating, mutate: duplicateDiet } = useMutation({
    mutationFn: duplicateDietAPI,
    onSuccess: data => {
      if (data) {
        const { newDiet, simplifiedDiet } = data
        const dietId = newDiet.id
        queryClient.setQueryData([`meals-diet-${dietId}`], newDiet)
        queryClient.setQueryData(['diets'], oldDiets => {
          return [simplifiedDiet, ...(Array.isArray(oldDiets) ? oldDiets : [])]
        })
        setSelectedDiet(dietId)
      }
    },
    onError: error => {
      console.error('useDuplicateDiet', error)
    }
  })

  return { isDuplicating, duplicateDiet }
}
