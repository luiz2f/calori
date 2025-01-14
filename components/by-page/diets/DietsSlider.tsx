'use client'

import DietBox from './DietBox'
import AddDiet from './dietSlider/AddDiet'
import { useDietContext } from '@/app/context/useDietContext'
import { useDiets } from '@/app/data/diets/useDiets'
import Spinner from '@/components/ui/Spinner'
import { BasicDiet } from '@/app/(authenticated)/app'

type DietSliderProps = {
  initialDataDiets: BasicDiet[]
}

export default function DietsSlider({ initialDataDiets }: DietSliderProps) {
  const { data: diets, isLoading } = useDiets(initialDataDiets)
  const { selectedDiet, setSelectedDiet } = useDietContext()

  const handleDietClick = (dietId: string) => {
    setSelectedDiet(dietId)
  }
  return (
    <>
      <div className='mt-14 flex flex-col w-full pt-8 bg-white z-10'>
        <div className='pl-6'>Minhas Dietas</div>
        <div className='flex w-full overflow-x-auto gap-4 px-6 pt-2 pb-4'>
          {isLoading ? (
            <div className='flex flex-col  justify-center w-44 h-24 text-left  white flex-shrink-0 rounded-lg  shadow-dbde text-blacklight pt-2'>
              <Spinner />
            </div>
          ) : (
            diets?.map(diet => (
              <DietBox
                name={diet?.name}
                diet={diet}
                active={selectedDiet === diet?.id}
                key={diet.id}
                onClick={() => handleDietClick(diet.id)} // Evento de clique para selecionar
              />
            ))
          )}
          <AddDiet />
        </div>
      </div>
    </>
  )
}

// 📌 - DELETAR DIETA
// 📌 - CRIAR REFEIÇÃO
