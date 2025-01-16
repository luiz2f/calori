'use client'

import { DietProvider } from '@/app/context/useDietContext'
import { MacroProvider } from '@/app/context/useMacroContext'
import Menus from '@/components/ui/Menu'
import Modal from '@/components/ui/Modal'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { useEffect } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000 * 7 }
  }
})
export type Macro = {
  carb: number
  prot: number
  fat: number
  kcal: number
}
export type Food = {
  id: string
  name: string
  carb: number
  protein: number
  fat: number
  satFat?: number
  fiber?: number
  userFood?: boolean
  unities: Unity[]
}
export type BasicFood = {
  id: string
  name: string
  carb: number
  protein: number
  fat: number
  satFat?: number
  fiber?: number
}
export type Unity = {
  id: string
  foodId: string
  un: string
  unitMultiplier: number
}
export type MealListItem = {
  id: string
  foodId: string
  unityId: string
  quantity: number
  mealListId: string
  index?: number
  food?: BasicFood
  unity?: Unity
}
export type MealList = {
  id: string
  name: string
  index?: number
  mealListItems: MealListItem[]
  macro?: Macro
}
export type Meal = {
  id: string
  name: string
  time: string
  dietId: string
  mealList?: MealList[]
  createdAt?: Date
  updatedAt?: Date
}
export type Diet = {
  id: string
  name: string
  userId: string
  index: number
  archived?: boolean
  meals: Meal[]
} | null
export type BasicMeal = {
  id: string
  name: string
  time: string
  dietId: string
  createdAt?: Date
  updatedAt?: Date
}
export type BasicDiet = {
  id: string
  name: string
  userId: string
  index: number
  meals: BasicMeal[]
}

export type AppProps = {
  defaultDiet: Diet
  diets: BasicDiet[]
  foods: Food[]
  children: React.ReactNode
}

export default function App({ defaultDiet, diets, foods, children }: AppProps) {
  const id = defaultDiet?.id || ''

  useEffect(() => {
    if (diets) {
      queryClient.setQueryData(['diets'], diets)
      queryClient.setQueryData([`meals-diet-${id}`], defaultDiet)
      queryClient.setQueryData(['foods'], foods)
      queryClient.setQueryData(
        ['userFoods'],
        foods.filter(food => food?.userFood === true)
      )
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
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
