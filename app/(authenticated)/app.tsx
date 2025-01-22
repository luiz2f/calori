'use client'

import { DietProvider } from '@/app/context/useDietContext'
import { MacroProvider } from '@/app/context/useMacroContext'
import Menus from '@/components/ui/Menu'
import Modal from '@/components/ui/Modal'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { DietFromSlider, Food, SelectedDiet } from './layout'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000 * 80 }
  }
})
export type AppProps = {
  defaultDiet: SelectedDiet | null
  diets: DietFromSlider[]
  foods: Food[]
  children: React.ReactNode
}

export default function App({ defaultDiet, diets, foods, children }: AppProps) {
  const id = defaultDiet?.id || null

  useEffect(() => {
    if (diets) {
      queryClient.setQueryData(['diets'], diets)
    }
    if (id && defaultDiet) {
      queryClient.setQueryData([`meals-diet-${id}`], defaultDiet)
    }
    if (foods) {
      queryClient.setQueryData(['foods'], foods)
      queryClient.setQueryData(
        ['userFoods'],
        foods.filter(food => food?.userFood === true)
      )
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <DietProvider initialDiet={id}>
        <MacroProvider>
          <Modal>
            <Menus>{children}</Menus>
          </Modal>
        </MacroProvider>
      </DietProvider>
    </QueryClientProvider>
  )
}
