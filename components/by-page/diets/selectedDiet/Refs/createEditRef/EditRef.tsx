'use client'
import React, { useState, useContext, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { ModalContext } from '@/components/ui/Modal'
import EditRefList from './EditRefList'
import EditRefFoods from './EditRefFoods'
import Toogle from '@/components/ui/Toogle'
import { useDiets } from '@/app/data/diets/useDiets'
import { v4 as uuidv4 } from 'uuid'
import { useUpdateMeal } from '@/app/data/meals/useUpdateMeal'
import { useCreateMeal } from '@/app/data/meals/useCreateMeal'
import Spinner from '@/components/ui/Spinner'
import { Meal } from '../DietMeal'
import { Macro } from '@/app/(authenticated)/app'

export type Unity = {
  foodId: string
  id: string
  un: string
  unitMultiplier: number
  erro?: boolean
}
export type Food = {
  carb: number
  protein: number
  fat: number
  id: string
  name: string
  unities?: Unity[]
  erro?: boolean
}
export type MealItem = {
  id: string
  foodId: string
  unityId: string
  quantity: number | string
  mealListId?: string
  index?: number
  food: Food
  unity: Unity
}
export type MealVar = {
  id: string
  name: string
  index?: number
  mealListItems: MealItem[]
  macro?: Macro
}
const creatingMeal: MealVar[] = [
  {
    id: '3660bc22-f82f-4cc7-b2a5-970fc66fxxx',
    name: 'Nova Variação',
    index: 0,
    mealListItems: [
      {
        id: 'fafd01e0-ca8e-4296-b0c8-ec39167dexxx',
        food: {
          carb: 0,
          protein: 0,
          fat: 0,
          id: '',
          name: ''
        },
        unity: {
          foodId: '',
          id: '',
          un: '',
          unitMultiplier: 0
        },
        quantity: 0,
        foodId: '',
        unityId: ''
      }
    ]
  }
]

type CreateOrEditProps =
  | {
      creating: true
      currentIndex: 0
      createFood: boolean
      createVariation: boolean
      meal: never
      typeInput: 'Alimentos'
    }
  | {
      meal: Meal
      currentIndex: number
      createFood?: boolean
      createVariation?: boolean
      creating?: boolean
      typeInput?: 'Alimentos' | 'Lista' | (() => 'Alimentos' | 'Lista')
    }
export default function EditRef({
  creating = false,
  createVariation = false,
  createFood = false,
  typeInput = 'Lista',
  meal,
  currentIndex,
  dietFromId,
  modalName,
  onCloseModal
}: CreateOrEditProps & {
  dietFromId?: string
  modalName: string
  onCloseModal?: () => void
}) {
  const name = creating ? 'Nova Refeição' : meal?.name
  const time = creating ? '23:00' : meal?.time
  const dMeal = creating ? creatingMeal : (meal?.mealList as MealVar[])
  const { data: diets } = useDiets()
  const [type, setType] = useState<'Lista' | 'Alimentos'>(typeInput)
  const [selectedVariation, setSelectedVariation] = useState(currentIndex)
  const { unsavedChanges, open, closeLast } = useContext(ModalContext)
  const [mealName, setMealName] = useState(name)
  const [mealTime, setMealTime] = useState(time)
  const [mealList, setMealList] = useState<MealVar[]>(dMeal)
  const [originalMealList, setOriginalMealList] = useState(dMeal)
  const [isModified, setIsModified] = useState(creating ? true : false)
  const [errors, setErrors] = useState({ name: '', time: '', food: false })
  const disabled = !!errors?.name || !!errors?.time
  const dietId = dietFromId || meal?.dietId
  const diet = diets?.filter(obj => obj?.id === dietId)[0]
  const {
    isUpdating,
    updateMeal,
    isSuccess: isSuccessU,
    reset
  } = useUpdateMeal()
  const { isCreating, createMeal, isSuccess: isSuccessC } = useCreateMeal()
  const isLoading = creating ? isCreating : isUpdating
  const isSuccess = creating ? isSuccessC : isSuccessU

  const isDisabled = !isModified || disabled || isLoading

  useEffect(() => {
    if (isModified) {
      unsavedChanges(modalName)
    } else {
      unsavedChanges('')
    }
  }, [unsavedChanges, modalName, isModified])

  useEffect(() => {
    if (isSuccess && !isLoading) {
      if (creating) {
        closeLast(true)
      } else if (!creating) {
        setOriginalMealList(mealList)
        setIsModified(false)
        reset()
      }
    }
  }, [closeLast, creating, isCreating, isLoading, isSuccess, mealList, reset])

  useEffect(() => {
    if (meal?.mealList) {
      setMealList(meal?.mealList as MealVar[])
      setOriginalMealList(meal?.mealList as MealVar[])
    }
  }, [meal?.mealList])

  useEffect(() => {
    if (!creating) {
      const isModified =
        JSON.stringify(mealList) !== JSON.stringify(originalMealList) ||
        mealName !== name ||
        mealTime !== time
      setIsModified(isModified)
    }
  }, [mealList, mealName, mealTime, originalMealList, name, time, creating])

  const toggleType = (type: 'Lista' | 'Alimentos') => {
    setType(type)
  }

  const handleMealChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e?.target?.value
    setMealName(value)
    setErrors(prevErrors => ({
      ...prevErrors,
      name: value?.trim() === '' ? 'O nome não pode estar vazio.' : ''
    }))
  }

  const handleTimeBlur = () => {}

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMealTime(e.target.value)
  }

  const handleAddVariation = (e: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation()
    newVariation()
  }

  const newVariation = () => {
    const mealId = uuidv4()
    setMealList([
      ...mealList,
      {
        id: mealId,
        name: 'Nova Variação',
        index: 0,
        macro: { carb: 0, prot: 0, fat: 0, kcal: 0 },
        mealListItems: []
      }
    ])

    handleAddFood(mealId)
  }

  const handleDuplicateVariation = (id: string) => {
    const variationToDuplicate = mealList?.find(meal => meal?.id === id)
    if (!variationToDuplicate) {
      console.error('Variação não encontrada')
      return
    }
    const newVar = {
      ...variationToDuplicate,
      id: uuidv4(),
      name: `${variationToDuplicate?.name} - (Cópia)`
    }

    setMealList(prevMealList => [...prevMealList, newVar])
  }

  const handleDeleteVariation = (id: string) => {
    const length = mealList?.length
    if (selectedVariation + 1 === length && length > 1) {
      setSelectedVariation(length - 2)
    }
    setMealList(prevMealList => prevMealList?.filter(meal => meal?.id !== id))
  }

  const handleNameChange = (variationId: string, newName: string) => {
    setMealList(prevMealList =>
      prevMealList?.map(variation =>
        variation?.id === variationId
          ? { ...variation, name: newName }
          : variation
      )
    )
  }

  const deleteFoodFromMeal = (mealId: string, foodId: string) => {
    setMealList(prevMealList =>
      prevMealList?.map(meal =>
        meal?.id === mealId
          ? {
              ...meal,
              mealListItems: meal?.mealListItems?.filter(
                item => item?.id !== foodId
              )
            }
          : meal
      )
    )
  }

  const handleAddFood = (mealItemId: string) => {
    setMealList(prevMealList =>
      prevMealList?.map(variation =>
        variation?.id === mealItemId
          ? {
              ...variation,
              mealListItems: [
                ...variation?.mealListItems,
                {
                  id: uuidv4(),
                  food: {
                    carb: 0,
                    protein: 0,
                    fat: 0,
                    id: '',
                    name: ''
                  },
                  unity: {
                    foodId: '',
                    id: '',
                    un: '',
                    unitMultiplier: 0
                  },
                  quantity: 0,
                  index: 0,
                  foodId: '',
                  unityId: ''
                }
              ]
            }
          : variation
      )
    )
  }
  const handleDuplicateFood = (mealId: string, foodId: string) => {
    // Encontre a refeição que contém o alimento a ser duplicado
    const mealToUpdate = mealList?.find(meal => meal?.id === mealId)
    if (!mealToUpdate) {
      console.error('Refeição não encontrada')
      return
    }

    // Encontre o alimento dentro da refeição
    const foodToDuplicate = mealToUpdate?.mealListItems?.find(
      item => item?.id === foodId
    )
    if (!foodToDuplicate) {
      console?.error('Alimento não encontrado')
      return
    }

    // Criação da cópia do alimento
    const duplicatedFood = {
      ...foodToDuplicate,
      id: uuidv4(), // Novo id para o alimento duplicado
      food: { ...foodToDuplicate?.food },
      unity: { ...foodToDuplicate?.unity }
    }

    // Encontre o índice do alimento original
    const foodIndex = mealToUpdate?.mealListItems?.findIndex(
      item => item?.id === foodId
    )

    // Crie uma nova lista de mealListItems, inserindo a cópia logo após o original
    const updatedMealListItems = [
      ...mealToUpdate?.mealListItems?.slice(0, foodIndex + 1), // Todos os itens até o original
      duplicatedFood, // O alimento duplicado
      ...mealToUpdate?.mealListItems?.slice(foodIndex + 1) // Todos os itens depois do original
    ]

    // Atualiza a refeição com o novo alimento duplicado na posição correta
    setMealList(prevMealList =>
      prevMealList?.map(meal =>
        meal?.id === mealId
          ? { ...meal, mealListItems: updatedMealListItems } // Atualiza a refeição com a nova lista
          : meal
      )
    )
  }
  const createUserFood = () => {
    open('create-food-return')
  }

  useEffect(() => {
    if (createVariation) {
      newVariation()
    }
    if (createFood) {
      handleAddFood(mealList[currentIndex]?.id)
    }
  }, [])

  const handleSave = async () => {
    let error = false
    const updatedMealList = mealList?.map(list => ({
      ...list,
      mealListItems: list?.mealListItems?.map(item => {
        if (!item?.food?.id) {
          item.food.erro = true
          error = true // Marca que existe um erro
        }
        if (!item?.unity?.id) {
          item.unity.erro = true
          error = true // Marca que existe um erro
        }
        return item
      })
    }))
    console.log(updatedMealList)

    setMealList(updatedMealList)
    if (error) {
      return
    }
    if (!creating) {
      await updateMeal({
        mealId: meal?.id,
        mealName,
        mealTime,
        refs: updatedMealList
      })
    } else {
      await createMeal({
        dietId,
        mealName,
        mealTime,
        refs: updatedMealList
      })
    }
  }

  const selectVariation = (index: number) => {
    setType('Alimentos')
    setSelectedVariation(index)
  }

  const handleFoodChange = (
    variationId: string,
    foodId: string,
    data: {
      foodInfo: Food
      unityInfo: Unity
      quantity: number | string
    }
  ) => {
    const { foodInfo, unityInfo, quantity } = data
    console.log(quantity)
    console.log(typeof quantity)
    setMealList(prevMealList =>
      prevMealList?.map(variation =>
        variation?.id === variationId
          ? {
              ...variation,
              mealListItems: variation?.mealListItems?.map(item =>
                item?.id === foodId
                  ? {
                      ...item,
                      foodId: foodInfo?.id,
                      unityId: unityInfo?.id,
                      quantity,
                      food: {
                        id: foodInfo?.id,
                        name: foodInfo?.name,
                        carb: foodInfo?.carb,
                        protein: foodInfo?.protein,
                        fat: foodInfo?.fat
                      },
                      unity: {
                        id: unityInfo?.id,
                        foodId: foodInfo?.id,
                        un: unityInfo?.un,
                        unitMultiplier: unityInfo?.unitMultiplier
                      }
                    }
                  : item
              )
            }
          : variation
      )
    )
  }

  return (
    <>
      <div id='editref' className='relative flex flex-col h-full'>
        <div className='font-bold text-xl text-center'>
          {creating ? 'Criar Refeição' : 'Editar Refeição'}
        </div>
        <div className='text-base mb-3 text-grey50 text-center'>
          Dieta - {diet?.name}
        </div>
        <Toogle
          options={['Lista', 'Alimentos']}
          value={type}
          onChange={toggleType}
          className='mb-7'
        />

        <div className='flex gap-2 mb-3'>
          <div className='relative w-full'>
            <label
              className={`absolute top-[-6px] text-grey50 px-1 ml-1 text-sm bg-white line leading-3 ${
                errors?.name
                  ? '!text-darkred !bg-half-lightred-transparent'
                  : ''
              }`}
            >
              Nome da Refeição
            </label>
            <input
              value={mealName}
              onChange={handleMealChange}
              // onBlur={handleNameBlur}
              className={`p-2 w-full border-1 rounded-lg ${
                errors?.name
                  ? 'border-darkred bg-lightred text-darkred'
                  : 'border-grey-50'
              }`}
            />
          </div>
          <div className='relative'>
            <label
              className={`absolute top-[-6px] text-grey50 px-1 ml-1 text-sm bg-white line leading-3 ${
                errors?.time
                  ? '!text-darkred !bg-half-lightred-transparent'
                  : ''
              }`}
            >
              Horário
            </label>
            <input
              value={mealTime}
              type='time'
              onChange={handleTimeChange}
              onBlur={handleTimeBlur}
              className={`font-medium p-2 w-22 border-1 text-darkgreen text-center rounded-lg ${
                errors?.time
                  ? 'border-darkred bg-lightred text-darkred'
                  : 'border-grey-50'
              }`}
            />
          </div>
        </div>

        {type === 'Lista' ? (
          <EditRefList
            mealsList={mealList}
            onSelectVariation={selectVariation}
            onDeleteVariation={handleDeleteVariation}
            onAddVariation={handleAddVariation}
            onDuplicateVariation={handleDuplicateVariation}
          />
        ) : (
          <EditRefFoods
            mealsList={mealList}
            onDeleteVariation={handleDeleteVariation}
            currentIndex={selectedVariation}
            setIndex={setSelectedVariation}
            onFoodChange={handleFoodChange}
            onNameChange={handleNameChange}
            handleAddVariation={handleAddVariation}
            handleAddFood={handleAddFood}
            deleteFoodFromMeal={deleteFoodFromMeal}
            handleDuplicateFood={handleDuplicateFood}
            createFood={createUserFood}
          />
        )}

        <div className='flex gap-4 px-1'>
          <Button size='small' cw='lightred' onClick={onCloseModal}>
            Cancelar
          </Button>
          <Button size='small' onClick={handleSave} disabled={isDisabled}>
            Salvar
          </Button>
        </div>
        {isLoading && (
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-white w-full h-full bg-opacity-80'>
            <Spinner />
          </div>
        )}
      </div>
    </>
  )
}
