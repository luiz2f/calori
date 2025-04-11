'use client'

import DietName from './selectedDiet/DietName'
import DietMacros from './selectedDiet/Macros/DietMacros'
import DietMealsPage from './selectedDiet/Refs/DietMealsPage'
import { useDietContext } from '@/app/context/useDietContext'
import { useMeals } from '@/app/data/meals/useMeals'
import { useDiets } from '@/app/data/diets/useDiets'
import { useMacroContext } from '@/app/context/useMacroContext'
import { useEffect, useState } from 'react'
import { SelectedDiet as SelectedDietType } from '@/app/(authenticated)/layout'

type selectedDietProps = {
  defaultDiet: SelectedDietType | null
}
export default function SelectedDiet({ defaultDiet }: selectedDietProps) {
  const [firstLoad, setFirstLoad] = useState(true)
  const { selectedDiet: selectedDietContext } = useDietContext()
  const dietId = selectedDietContext || defaultDiet?.id || ''
  const { data: dietData, isLoading, isSuccess } = useMeals(dietId)
  const diet = dietData || defaultDiet

  useEffect(() => {
    if (firstLoad && !isLoading && isSuccess) {
      setFirstLoad(false)
    }
  }, [isLoading, isSuccess, firstLoad])

  const { setDefaultMacro } = useMacroContext()

  useEffect(() => {
    if (diet) {
      setDefaultMacro(diet)
    }
  }, [diet])

  const { data: dietsSlider } = useDiets()
  const selectedDietName = dietsSlider?.filter(obj => obj.id === dietId)[0]
    ?.name
  const name = selectedDietName || diet?.name || ''

  if (dietsSlider?.length === 0) {
    return (
      <div className='w-full flex flex-col h-full text-center'>
        <DietName name='Crie sua primeira dieta para começar' />
      </div>
    )
  }

  if (!diet) {
    return (
      <div className='w-full flex flex-col h-full text-center'>
        <DietName name='Selecione uma dieta' />
      </div>
    )
  }

  return (
    <div className='w-full flex flex-col h-full'>
      <DietName name={name} />
      <DietMacros />
      <DietMealsPage
        isLoading={isLoading && !firstLoad}
        key={dietId}
        meals={diet.meals}
        dietId={dietId}
      />
    </div>
  )
}

// 📌 - DELETAR REFEIÇÃO
// 📌 - CRIAR REFEIÇÃO
