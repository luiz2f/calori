'use client'
import { useContext } from 'react'
import Table from './RefTableModel'
import RefSlider from './RefSlider'
import { ModalContext } from '@/components/ui/Modal'
import { MealVarMacro, useMacroContext } from '@/app/context/useMacroContext'
import { transformFoodData } from '@/utils/transformFoodData'

export default function RefTable({
  mealId,
  currentIndex,
  goLeft,
  goRight,
  mealsList,
  selectedMeal
}: {
  mealId: string
  currentIndex: number
  goLeft: () => void
  goRight: () => void
  mealsList: MealVarMacro[] | []
  selectedMeal: MealVarMacro
}) {
  const { open } = useContext(ModalContext)
  const { columns } = useMacroContext()

  if (!mealsList || mealsList.length === 0) {
    return (
      <div role='table' className='flex flex-col w-full p-2 mb-2'>
        <div
          role='row'
          style={{ gridTemplateColumns: '1fr 32px 32px 32px 32px' }}
          className='grid mt-4 pr-1 text-darkgreen'
        >
          <div
            className='text-left align-bottom text-xl font-normal self-end pl-1 underline underline-offset-2 cursor-pointer'
            onClick={handleClickNoVar}
          >
            + Adicionar variação de refeição
          </div>
          <div className='text-center font-normal align-bottom opacity-30'>
            <div className='grayscale contrast-150 text-xs opacity-30'>🍞</div>
            <div>0</div>
          </div>
          <div className='text-center font-normal align-bottom opacity-30'>
            <div className='grayscale contrast-150 text-xs opacity-30'>🥩</div>
            <div>0</div>
          </div>
          <div className='text-center font-normal align-bottom opacity-30'>
            <div className='grayscale contrast-150 text-xs opacity-30'>🥑</div>
            <div>0</div>
          </div>
          <div className='text-right font-normal align-bottom opacity-30'>
            <div className='text-xs text-grey50'>kcal</div> <div>0</div>
          </div>
        </div>
      </div>
    )
  }
  const meal = mealsList[currentIndex]
  const macro = selectedMeal?.macro

  function handleOpenVar() {
    open(`editMealAlimento${mealId}`)
  }

  function handleClickNoFood() {
    open(`editMealAlimentoCreate${mealId}`)
  }

  function handleClickNoVar() {
    open(`editMealVarCreate${mealId}`)
  }
  const simplifiedData = transformFoodData(meal?.mealListItems)
  const defaultColumns = '1fr 32px 32px 32px 32px'
  const gridColumn = columns || defaultColumns

  return (
    <Table columns={gridColumn}>
      <Table.Header
        onClick={handleOpenVar}
        name={meal?.name}
        carbo={macro?.carb || 0}
        prot={macro?.prot || 0}
        fat={macro?.fat || 0}
        kcal={macro?.kcal || 0}
      />
      <Table.Body>
        {simplifiedData?.length ? (
          simplifiedData.map((item, index) => (
            <Table.Row
              key={index}
              quantity={item.quantity}
              unit={item.unit}
              name={item.name}
              carbo={item.carb}
              prot={item.prot}
              fat={item.fat}
              kcal={item.kcal}
            />
          ))
        ) : (
          <Table.NoFood onClick={handleClickNoFood} />
        )}
      </Table.Body>
      <RefSlider
        onLeft={goLeft}
        onRight={goRight}
        length={mealsList?.length}
        current={currentIndex}
      />
    </Table>
  )
}
