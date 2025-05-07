'use client'
import { createBasicDiet as createBasicDietAPI } from '@/actions/diets/createBasicDiet'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDietContext } from '@/app/context/useDietContext'

export function useCreateBasicDiet() {
  const queryClient = useQueryClient()
  const { setSelectedDiet } = useDietContext()

  const {
    isPending: isCreating,
    isSuccess,
    mutate: createBasicDiet
  } = useMutation({
    mutationFn: createBasicDietAPI,
    onSuccess: data => {
      const { newDiet, simplifiedDiet } = data
      const dietId = newDiet.id
      queryClient.setQueryData([`meals-diet-${dietId}`], newDiet)
      queryClient.setQueryData(['diets'], oldDiets => {
        return [simplifiedDiet, ...(Array.isArray(oldDiets) ? oldDiets : [])]
      })
      setSelectedDiet(dietId)
    },
    onError: error => {
      console.error('useCreateBasicDiet', error)
    }
  })

  return { isCreating, createBasicDiet, isSuccess }
}
