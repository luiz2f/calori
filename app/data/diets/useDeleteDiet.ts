'use client'
import { deleteDiet as deleteDietAPI } from '@/actions/diets/diets'
import { useDietContext } from '@/app/context/useDietContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export function useDeleteDiet() {
  const [deletedId, setDeletedId] = useState<string>()
  const { selectedDiet, setSelectedDiet } = useDietContext()
  const queryClient = useQueryClient()

  const {
    isPending: isDeleting,
    mutate: deleteDiet,
    isSuccess
  } = useMutation({
    mutationFn: deleteDietAPI,
    onSuccess: data => {
      if (data) {
        const queryKey = `meals-diet-${data}`
        queryClient.removeQueries({ queryKey, exact: true })
        const diets = queryClient.getQueryData(['diets'])

        // select new diet logic
        if (diets && Array.isArray(diets)) {
          if (selectedDiet === data) {
            const selectedIndex = diets.findIndex(
              diet => diet.id === selectedDiet
            )
            if (diets?.length === 1) {
              setSelectedDiet('')
            } else if (selectedIndex >= diets?.length - 1) {
              const newIndex = diets?.length - 2
              setSelectedDiet(diets[newIndex]?.id)
            } else {
              const newIndex = selectedIndex + 1
              setSelectedDiet(diets[newIndex]?.id)
            }
          }
          setDeletedId(data)
        }
      }
    },
    onError: error => {
      console.error('useDeleteDiet', error)
    }
  })

  useEffect(() => {
    // after selecting new diet, remove the old one from the query
    if (!isDeleting && isSuccess && deletedId) {
      const diets = queryClient.getQueryData(['diets'])
      if (diets && Array.isArray(diets)) {
        const newDiets = diets.filter(diet => diet.id !== deletedId) || diets
        queryClient.setQueryData(['diets'], newDiets)
      }
    }
  }, [isDeleting, isSuccess, deletedId, queryClient])

  return { isDeleting, deleteDiet, isSuccess }
}
