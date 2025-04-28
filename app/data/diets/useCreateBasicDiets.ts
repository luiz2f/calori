'use client'
import { createBasicDiet as createBasicDietAPI } from '@/actions/diets/createBasicDiet'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { resumeDiet } from './useDuplicateDiet'
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
      queryClient.setQueryData([`meals-diet-${data?.id}`], data)
      const newDiet = resumeDiet(data)
      queryClient.setQueryData(['diets'], oldDiets => {
        return [newDiet, ...(Array.isArray(oldDiets) ? oldDiets : [])]
      })
      setSelectedDiet(newDiet.id)
    },
    onError: error => {
      console.error('useCreateBasicDiet', error)
    }
  })

  return { isCreating, createBasicDiet, isSuccess }
}
