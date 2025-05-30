'use client'
import Menus from '@/components/ui/Menu'
import {
  HiDotsHorizontal,
  HiOutlinePencilAlt,
  HiOutlineTrash
} from 'react-icons/hi'
import Modal from '@/components/ui/Modal'
import ConfirmDelete from '@/components/ui/ConfirmDelete'
import EditRef from './createEditRef/EditRef'
import { useEffect, useState } from 'react'
import RefTable from './RefTable'
import { useDeleteMeal } from '@/app/data/meals/useDeleteMeal'
import { MealMacro, useMacroContext } from '@/app/context/useMacroContext'

export default function DietMeal({ meal }: { meal: MealMacro }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [defaultIndex, setDefaultIndex] = useState(true)
  const { isDeleting, deleteMeal, isSuccess } = useDeleteMeal()
  const { updateMacroForMeal } = useMacroContext()
  const selectedMeal = meal?.mealList[currentIndex] || {}
  const goLeft = () => {
    setCurrentIndex(prevIndex =>
      prevIndex > 0 ? prevIndex - 1 : meal?.mealList?.length - 1
    )
  }
  const goRight = () => {
    setCurrentIndex(prevIndex =>
      prevIndex < meal?.mealList?.length - 1 ? prevIndex + 1 : 0
    )
  }
  const handleDeleteMeal = async () => {
    await deleteMeal(meal.id)
  }

  useEffect(() => {
    if (currentIndex === 0 && defaultIndex) {
      return
    }
    setDefaultIndex(false)
    const macro = selectedMeal?.macro
    updateMacroForMeal(meal.id, macro)
  }, [currentIndex, meal, defaultIndex, selectedMeal?.macro]) // Agora depende de `isFirstLoad`

  const deleteModalName = `deleteMeal${meal.id}`

  return (
    <div>
      <div className='border-grey10 border-1 rounded-lg flex flex-col w-full relative'>
        <div className='flex items-baseline gap-1 absolute top-[-16px] bg-white mx-1 px-[0.15rem] left-0 '>
          <Modal.Open opens={`editMeal${meal.id}`}>
            <button className='font-medium text-2xl cursor-pointer'>
              {meal.name}
            </button>
          </Modal.Open>
          <div className='text-darkgreen'>{meal.time}</div>
        </div>
        <Menus.Menu className='bg-white p-1 rounded-lg border-grey10 border-1  absolute top-[-12px] right-1 text-grey50'>
          <Menus.Toggle id={`MealToogle${meal.id}`}>
            <HiDotsHorizontal />
          </Menus.Toggle>

          <Menus.List id={`MealToogle${meal.id}`}>
            <Modal.Open opens={`editMeal${meal.id}`}>
              <Menus.Button icon={<HiOutlinePencilAlt />}>
                Editar refeição
              </Menus.Button>
            </Modal.Open>
            <Modal.Open opens={deleteModalName}>
              <Menus.Button icon={<HiOutlineTrash />}>
                Apagar refeição
              </Menus.Button>
            </Modal.Open>
          </Menus.List>
          <Modal.Window name={`editMeal${meal.id}`}>
            <EditRef
              meal={meal}
              setCurrentIndex={setCurrentIndex}
              currentIndex={currentIndex}
              modalName={`editMeal${meal.id}`}
            />
          </Modal.Window>
          <Modal.Window name={`editMealAlimento${meal.id}`}>
            <EditRef
              meal={meal}
              setCurrentIndex={setCurrentIndex}
              currentIndex={currentIndex}
              typeInput='Alimentos'
              modalName={`editMealAlimento${meal.id}`}
            />
          </Modal.Window>
          <Modal.Window name={`editMealAlimentoCreate${meal.id}`}>
            <EditRef
              createFood={true}
              meal={meal}
              setCurrentIndex={setCurrentIndex}
              currentIndex={currentIndex}
              typeInput='Alimentos'
              modalName={`editMealAlimentoCreate${meal.id}`}
            />
          </Modal.Window>
          <Modal.Window name={`editMealVarCreate${meal.id}`}>
            <EditRef
              createVariation={true}
              meal={meal}
              setCurrentIndex={setCurrentIndex}
              currentIndex={currentIndex}
              typeInput='Alimentos'
              modalName={`editMealVarCreate${meal.id}`}
            />
          </Modal.Window>
          <Modal.Window name={deleteModalName}>
            <ConfirmDelete
              loading={isDeleting}
              loaded={!isDeleting && isSuccess}
              resource='Refeição'
              resourceName={`${meal.name} - ${meal.time}`}
              onConfirm={handleDeleteMeal}
              modalName={deleteModalName}
            />
          </Modal.Window>
        </Menus.Menu>
        <RefTable
          mealId={meal?.id}
          currentIndex={currentIndex}
          goLeft={goLeft}
          goRight={goRight}
          mealsList={meal?.mealList}
          selectedMeal={selectedMeal}
        />
      </div>
    </div>
  )
}
