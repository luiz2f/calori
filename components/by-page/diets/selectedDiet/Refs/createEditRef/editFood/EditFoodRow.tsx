'use client'
import ConfirmDelete from '@/components/ui/ConfirmDelete'
import Menus from '@/components/ui/Menu'
import Modal from '@/components/ui/Modal'
import React, { useState, useEffect, useCallback, CSSProperties } from 'react'
import {
  HiDotsVertical,
  HiOutlineDuplicate,
  HiOutlineTrash
} from 'react-icons/hi'
import Select from 'react-select'
import { Food, MealItem, Unity } from '../EditRef'
type UnityOption = {
  value: string
  label: string
}
type FoodOption = {
  value: string
  label: string
  unities: UnityOption[]
}
export default function EditFoodRow({
  createFood,
  createReturn,
  cleanReturn,
  mealId,
  food,
  foods,
  onFoodChange,
  onDeleteFood,
  duplicateFood,
  foodReturned,
  foodOptions
}: {
  createFood: () => void
  createReturn: () => void
  cleanReturn: () => void
  mealId: string
  food: MealItem
  foods: Food[]
  onFoodChange: (
    foodId: string,
    data: {
      foodInfo: Food
      unityInfo: Unity
      quantity: number
    }
  ) => void
  onDeleteFood: (mealId: string, foodId: string) => void
  duplicateFood: () => void
  foodReturned: string | null
  foodOptions: FoodOption[]
}) {
  const unityDefault = {
    value: food.unity.id,
    label: food.unity.un
  }
  const foodDefault = {
    value: food.food.id,
    label: food.food.name
  }

  const [selectedFood, setSelectedFood] = useState(foodDefault || null)
  const [selectedUnity, setSelectedUnity] = useState(unityDefault || null)
  const foodInfo = foods?.find(obj => obj?.id === selectedFood?.value)
  const unityInfo =
    foodInfo?.unities?.find(unity => unity?.foodId === selectedFood?.value) ||
    {}
  const [quantity, setQuantity] = useState(food.quantity || 0)
  const unityOptions =
    foodOptions?.find(obj => obj.value === selectedFood?.value)?.unities || []
  useEffect(() => {
    if (selectedFood.value) {
      onFoodChange(food.id, { foodInfo, unityInfo, quantity })
    }
  }, [selectedFood, selectedUnity, quantity, food.id])

  const handleFoodChange = useCallback(
    (selected: FoodOption) => {
      if (selected.value === 'create-food') {
        createFood()
        createReturn()
      } else {
        setSelectedFood(selected)
        setSelectedUnity(selected.unities[0])
      }
    },
    [createFood, createReturn, setSelectedFood, setSelectedUnity]
  )

  const handleUnityChange = (selected: UnityOption) => {
    setSelectedUnity(selected)
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      setQuantity(parseFloat(value))
    }
  }

  useEffect(() => {
    if (foodReturned) {
      const created = foodOptions?.find(obj => obj.value === foodReturned)
      if (created) {
        handleFoodChange(created)
        cleanReturn()
      }
    }
  }, [foodReturned, handleFoodChange, foodOptions, cleanReturn])

  const selectStyle = {
    indicatorsContainer: (base: CSSProperties) => ({
      ...base
    }),
    indicatorSeparator: (base: CSSProperties) => ({
      ...base,
      display: 'none'
    }),
    dropdownIndicator: (base: CSSProperties) => ({
      ...base,
      padding: '0 4px 0 0',
      width: '18px'
    }),
    control: (base: CSSProperties) => ({
      ...base,
      borderColor: '#d1d1d1',
      borderWidth: '1px',
      padding: '0',
      textAlign: 'center',
      minHeight: '25px',
      width: '100%'
    }),
    singleValue: (base: CSSProperties) => ({
      ...base,
      textAlign: 'center'
    }),
    menu: (base: CSSProperties) => ({
      ...base,
      borderRadius: '8px',
      borderColor: '#d1d1d1',
      top: 'auto',
      bottom: '100%',
      zIndex: 6000
    }),
    menuPortal: (base: CSSProperties) => ({
      ...base,
      zIndex: 6000,
      transform: 'translateX(-4vw)'
    }),
    option: (
      base: CSSProperties,
      state: { isSelected: boolean; isFocused: boolean }
    ) => ({
      ...base,
      borderRadius: state.isSelected ? '4px' : '0',

      backgroundColor: state.isSelected
        ? '#76C163'
        : state.isFocused
        ? '#f9f9f9'
        : 'transparent',
      textAlign: 'center'
    })
  }
  const modalName = `deletereffood${food?.id}`
  const error = {
    food: food?.food?.erro || false,
    unity: food?.unity?.erro || false
  }
  return (
    <>
      <input
        type='number'
        value={quantity}
        onChange={e => handleQuantityChange(e)}
        className={`border-1 py-[2px] text-center rounded-lg  ${
          quantity === ''
            ? 'bg-lightred border-darkred text-darkred'
            : 'border-grey10'
        }`}
      />

      <Select
        options={unityOptions}
        value={selectedUnity}
        onChange={handleUnityChange}
        placeholder=''
        isDisabled={!selectedFood}
        // menuPortalTarget={document.querySelector("#editref")}
        // menuPosition="fixed"
        // menuPlacement="auto"
        styles={{
          ...selectStyle,
          control: base => ({
            ...base,
            transition: '200ms all ease',
            borderColor: error?.unity ? '#7B3232' : '#d1d1d1',
            backgroundColor: error?.unity ? '#FFEDED' : 'white',
            color: error?.unity ? '#7B3232' : 'inherit',
            borderRadius: '8px'
          })
        }}
      />
      <Select
        options={foodOptions}
        value={selectedFood}
        placeholder='Selecionar Alimento'
        onChange={handleFoodChange}
        // menuPortalTarget={document.querySelector("#editref")}
        // menuPosition="fixed"
        // menuPlacement="auto"
        styles={{
          ...selectStyle,
          control: base => ({
            ...base,
            borderColor: error?.food ? '#7B3232' : '#d1d1d1',
            backgroundColor: error?.food ? '#FFEDED' : 'white',
            color: error?.food ? '#7B3232' : 'inherit',
            borderRadius: '8px'
          })
        }}
        noOptionsMessage={() => 'Nenhum alimento encontrado'}
      />

      <Menus.Menu>
        <Menus.Toggle
          id={`editreffood${food?.id}`}
          className='rounded-lg items-center'
        >
          <HiDotsVertical />
        </Menus.Toggle>

        <Menus.List id={`editreffood${food?.id}`}>
          <Menus.Button icon={<HiOutlineDuplicate />} onClick={duplicateFood}>
            Duplicar alimento
          </Menus.Button>
          <Modal.Open opens={modalName}>
            <Menus.Button icon={<HiOutlineTrash />}>
              Apagar alimento
            </Menus.Button>
          </Modal.Open>
        </Menus.List>
      </Menus.Menu>
      <Modal.Window name={modalName}>
        <ConfirmDelete
          resource='Alimento'
          resourceName={food.food.name}
          onConfirm={() => onDeleteFood(mealId, food?.id)}
          modalName={modalName}
        />
      </Modal.Window>
    </>
  )
}
