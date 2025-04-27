'use client'

import DietBox from './DietBox'
import AddDiet from './dietSlider/AddDiet'
import { useDietContext } from '@/app/context/useDietContext'
import { useDiets } from '@/app/data/diets/useDiets'
import Spinner from '@/components/ui/Spinner'
import { DietFromSlider } from '@/app/(authenticated)/layout'
import AddBasicDiet from './dietSlider/AddBasicDiet'
import { useDuplicateDiet } from '@/app/data/diets/useDuplicateDiet'
import { useMemo } from 'react'

type DietSliderProps = {
  initialDataDiets: DietFromSlider[]
}

export default function DietsSlider({ initialDataDiets }: DietSliderProps) {
  const { data: diets, isLoading } = useDiets(initialDataDiets)
  const { isDuplicating, duplicateDiet } = useDuplicateDiet()

  const { selectedDiet, setSelectedDiet } = useDietContext()
  const isEmpty = !diets || diets.length === 0

  const handleDietClick = (dietId: string) => {
    setSelectedDiet(dietId)
  }

  // Memoriza o mapeamento das DietBox
  const renderedDiets = useMemo(() => {
    return diets?.map(diet => (
      <DietBox
        name={diet?.name}
        diet={diet}
        active={selectedDiet === diet?.id}
        key={diet.id}
        duplicateDiet={() => duplicateDiet(diet.id)}
        onClick={() => handleDietClick(diet.id)}
      />
    ))
  }, [diets, selectedDiet])

  return (
    <>
      <div className='mt-14 flex flex-col w-full pt-8 bg-white z-10'>
        <div className='pl-6'>
          {isEmpty ? 'Você ainda não tem nenhuma dieta' : 'Minhas Dietas'}
        </div>
        <div className='flex w-full overflow-x-auto gap-4 px-6 pt-2 pb-4'>
          {isLoading ? (
            <div className='flex flex-col justify-center w-44 h-24 text-left white flex-shrink-0 rounded-lg shadow-dbde text-blacklight pt-2'>
              <Spinner />
            </div>
          ) : isEmpty ? (
            <AddBasicDiet />
          ) : (
            <>
              {isDuplicating ? (
                <div
                  className={`flex flex-col cursor-pointer justify-between w-44 h-24 text-left  white flex-shrink-0 rounded-lg p-db shadow-dbde text-blacklight`}
                >
                  <div className=''>
                    <div className='text-sm font-medium max-w-32 overflow-hidden ellipsis h-14 pt-2'>
                      Duplicando Dieta
                    </div>
                  </div>
                  <Spinner small />
                  <div className='font-bold pr-3 w-full align-bottom text-right'></div>
                </div>
              ) : null}
              {renderedDiets}
            </>
          )}
          <AddDiet isFirstDiet={isEmpty} />
        </div>
      </div>
    </>
  )
}
