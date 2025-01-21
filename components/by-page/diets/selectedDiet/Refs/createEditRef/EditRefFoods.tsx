import React, { useState, useEffect, useMemo } from 'react'
import RefSlider from '../RefSlider'
import EditFoodRow from './editFood/EditFoodRow'
import Modal from '@/components/ui/Modal'
import ConfirmDelete from '@/components/ui/ConfirmDelete'
import { useFoods } from '@/app/data/foods/useFoods'
import { calculateMacros } from '@/app/data/meals/useMeals'
import { useQueryClient } from '@tanstack/react-query'
import { Food, MealVar, Unity } from './EditRef'
import { MealVarMacro } from '@/app/context/useMacroContext'

export default function EditRefFoods({
  mealsList,
  currentIndex,
  onDeleteVariation,
  onFoodChange,
  onNameChange,
  setIndex,
  handleAddVariation,
  handleAddFood,
  deleteFoodFromMeal,
  handleDuplicateFood,
  createFood
}: {
  mealsList: MealVar[]
  currentIndex: number
  onDeleteVariation: (id: string) => void
  onFoodChange: (
    variationId: string,
    foodId: string,
    data: {
      foodInfo: Food
      unityInfo: Unity
      quantity: number
    }
  ) => void
  onNameChange: (variationId: string, newName: string) => void
  setIndex: (index: number) => void
  handleAddVariation: (e: React.MouseEvent<HTMLButtonElement>) => void
  handleAddFood: (mealItemId: string) => void
  deleteFoodFromMeal: (mealId: string, foodId: string) => void
  handleDuplicateFood: (mealId: string, foodId: string) => void
  createFood: () => void
}) {
  const queryClient = useQueryClient()
  const currentMeal = mealsList[currentIndex]
  const [variationName, setVariationName] = useState(currentMeal?.name || '')
  const { data: foods, isLoading } = useFoods()
  const modalName = `deleteMeal${currentMeal?.id}`

  const foodOptions = useMemo(
    () => [
      {
        value: 'create-food',
        label: 'Criar Alimento'
      },
      ...(foods?.map(obj => ({
        value: obj.id,
        label: obj.name,
        unities: obj.unities?.map(unit => ({
          value: unit.id,
          label: unit.un
        }))
      })) || [])
    ],
    [foods, isLoading]
  )

  function handleDeleteMeal() {
    onDeleteVariation(currentMeal?.id)
  }
  useEffect(() => {
    setIndex(currentIndex)
    if (currentMeal) {
      setVariationName(currentMeal?.name)
    } else {
      setVariationName('')
    }
  }, [currentIndex, mealsList, setIndex, setVariationName])
  const goLeft = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : mealsList.length - 1
    const newName = mealsList[newIndex]?.name || ''
    setIndex(newIndex)
    setVariationName(newName)
  }
  const goRight = () => {
    const newIndex = currentIndex < mealsList.length - 1 ? currentIndex + 1 : 0
    const newName = mealsList[newIndex]?.name || ''

    setIndex(newIndex)
    setVariationName(newName)
  }
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setVariationName(newName)
    onNameChange(currentMeal?.id, newName)
  }
  const setCreateReturn = (id: string) => {
    queryClient.setQueryData(['createFoodReturn'], {
      foodId: null,
      foodRowId: id
    })
  }
  const cleanReturn = () => {
    queryClient.setQueryData(['createFoodReturn'], null)
  }
  const createFoodReturn = queryClient.getQueryData<{
    foodId: string | null
    foodRowId: string | null
  }>(['createFoodReturn'])

  const handleReturnFood = useMemo(() => {
    return (id: string) => {
      if (
        !createFoodReturn ||
        !createFoodReturn?.foodId ||
        id !== createFoodReturn?.foodRowId
      ) {
        return null
      } else {
        return createFoodReturn?.foodId
      }
    }
  }, [createFoodReturn])

  const refFoods = currentMeal?.mealListItems || []
  const handleFoodChangeWrapper = (
    foodId: string,
    data: {
      foodInfo: Food
      unityInfo: Unity
      quantity: number
    }
  ) => {
    onFoodChange(currentMeal?.id, foodId, data)
  }

  const carb = currentMeal?.macro?.carb || 0
  const prot = currentMeal?.macro?.prot || 0
  const fat = currentMeal?.macro?.fat || 0
  const kcal = currentMeal?.macro?.kcal || 0

  const newMacros = calculateMacros(currentMeal as MealVarMacro)
  return (
    <>
      {!!mealsList.length ? (
        <>
          <RefSlider
            onLeft={goLeft}
            onRight={goRight}
            length={mealsList.length}
            current={currentIndex}
          />
          <div className='flex gap-2 my-1 mt-7'>
            <div className='relative w-full'>
              <label className='absolute top-[-6px] text-grey50 px-1 ml-1 text-sm bg-white line leading-3'>
                Nome da Variação
              </label>
              <input
                value={variationName}
                onChange={handleNameChange}
                className='p-2 w-full border-1 border-grey-50 text-darkgreen rounded-lg'
              />
            </div>
            <div className='grid pl-1 grid-cols-frq gap-3 text-center text-darkgreen'>
              <div className='flex flex-col justify-end align-bottom relative'>
                <div className='grayscale contrast-150 text-xs opacity-50'>
                  🍞
                </div>
                <div>{newMacros?.carb}</div>
                {newMacros?.carb - carb !== 0 && (
                  <div className='absolute top-[-18px] left-0 right-0 text-xs text-grey50'>
                    {newMacros?.carb - carb > 0
                      ? `+${newMacros?.carb - carb}`
                      : newMacros?.carb - carb}
                  </div>
                )}
              </div>
              <div className='flex flex-col justify-end align-bottom relative'>
                <div className='grayscale contrast-150 text-xs opacity-50'>
                  🥩
                </div>
                <div>{newMacros?.prot}</div>
                {newMacros?.prot - prot !== 0 && (
                  <div className='absolute top-[-18px] left-0 right-0 text-xs text-grey50'>
                    {newMacros?.prot - prot > 0
                      ? `+${newMacros?.prot - prot}`
                      : newMacros?.prot - prot}
                  </div>
                )}
              </div>
              <div className='flex flex-col justify-end align-bottom relative'>
                <div className='grayscale contrast-150 text-xs opacity-50'>
                  🥑
                </div>
                <div>{newMacros?.fat}</div>
                {newMacros?.fat - fat !== 0 && (
                  <div className='absolute top-[-18px] left-0 right-0 text-xs text-grey50'>
                    {newMacros?.fat - fat > 0
                      ? `+${newMacros?.fat - fat}`
                      : newMacros?.fat - fat}
                  </div>
                )}
              </div>
              <div className='flex flex-col justify-end align-bottom relative'>
                <div className='text-xs text-grey50'>kcal</div>
                <div>{newMacros?.kcal}</div>
                {newMacros?.kcal - kcal !== 0 && (
                  <div className='absolute top-[-18px] left-0 right-0 text-xs text-grey50'>
                    {newMacros?.kcal - kcal > 0
                      ? `+${newMacros?.kcal - kcal}`
                      : newMacros?.kcal - kcal}
                  </div>
                )}
              </div>
            </div>
          </div>
          {refFoods.length > 0 ? (
            <>
              <div className='grid grid-cols-edref gap-2 pt-3 text-center text-sm text-grey30 mb-1'>
                <div>Quant.</div>
                <div>Un.</div>
                <div>Alimento</div>
                <div></div>
              </div>
              <div
                className={`w-full border-y-1 border-lightgreen text-sm mb-2 flex-1 `}
              >
                <div className='h-[inherit]  w-full py-3 grid grid-cols-edref gap-2'>
                  {refFoods?.map((food, index) => (
                    <EditFoodRow
                      createFood={createFood}
                      mealId={currentMeal?.id}
                      onDeleteFood={deleteFoodFromMeal}
                      key={`${food.id}-${index}-${currentMeal?.id}`}
                      food={food}
                      foods={foods}
                      foodOptions={foodOptions}
                      onFoodChange={handleFoodChangeWrapper}
                      duplicateFood={() =>
                        handleDuplicateFood(currentMeal?.id, food.id)
                      }
                      createReturn={() => setCreateReturn(food.id)}
                      foodReturned={handleReturnFood(food?.id)}
                      cleanReturn={cleanReturn}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            ''
          )}
          <div className='flex justify-between mb-7'>
            <div
              onClick={() => handleAddFood(currentMeal?.id)}
              className={`text-darkgreen text-sm cursor-pointer ml-2 ${
                !refFoods.length && 'underline underline-offset-4'
              }`}
            >
              {!refFoods.length
                ? '+ Adicionar primeiro alimento'
                : '+ Adicionar Alimento'}
            </div>

            <Modal.Open opens={modalName}>
              <button className='text-sm pl-3 text-darkred  cursor-pointer'>
                Apagar variação
              </button>
            </Modal.Open>
            <Modal.Window name={modalName}>
              <ConfirmDelete
                resource='Variação de Refeição'
                resourceName={variationName}
                onConfirm={handleDeleteMeal}
                modalName={modalName}
              />
            </Modal.Window>
          </div>
        </>
      ) : (
        <>
          <div className='text-grey50 text-sm mb-1 pl-2'>Variações</div>
          <div className='flex flex-col mb-3'></div>
          <button
            onClick={e => handleAddVariation(e)}
            className='cursor-pointer text-xl text-center pl-2 mb-6 mt-1 underline  underline-offset-4 text-darkgreen'
          >
            + Adicionar Variação de Refeição
          </button>
        </>
      )}
    </>
  )
}
