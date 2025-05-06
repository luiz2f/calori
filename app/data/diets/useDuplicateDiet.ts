'use client'
import { duplicateDiet as duplicateDietAPI } from '@/actions/diets/diets'
import { useDietContext } from '@/app/context/useDietContext'
import { resumeDiet } from '@/utils/resumeDiet'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDuplicateDiet() {
  const { setSelectedDiet } = useDietContext()

  const queryClient = useQueryClient()

  const { isPending: isDuplicating, mutate: duplicateDiet } = useMutation({
    mutationFn: duplicateDietAPI,
    onSuccess: data => {
      if (data) {
        queryClient.setQueryData([`meals-diet-${data?.id}`], data)
        const newDiet = resumeDiet(data)
        queryClient.setQueryData(['diets'], oldDiets => {
          return [newDiet, ...(Array.isArray(oldDiets) ? oldDiets : [])]
        })
        setSelectedDiet(newDiet.id)
      }
    },
    onError: error => {
      console.error('useDuplicateDiet', error)
    }
  })

  return { isDuplicating, duplicateDiet }
}
