'use client'
import { createDiet as createDietAPI } from '@/actions/diets/diets'
import { useDietContext } from '@/app/context/useDietContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { resumeDiet } from '@/utils/resumeDiet'

export function useCreateDiet() {
  const queryClient = useQueryClient()
  const { setSelectedDiet } = useDietContext()

  const {
    isPending: isCreating,
    isSuccess,
    mutate: createDiet
  } = useMutation({
    mutationFn: createDietAPI,
    onSuccess: data => {
      const newDiet = resumeDiet(data)
      queryClient.setQueryData(['diets'], oldDiets => {
        return [newDiet, ...(Array.isArray(oldDiets) ? oldDiets : [])]
      })
      setSelectedDiet(newDiet.id)
    },
    onError: error => {
      console.error('useCreateDiet', error)
    }
  })

  return { isCreating, createDiet, isSuccess }
}
