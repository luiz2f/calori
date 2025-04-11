'use client'
import AddRef from './AddRef'
import DietMeal from './DietMeal'
import Modal from '@/components/ui/Modal'
import EditRef from './createEditRef/EditRef'
import UnsavedChanges from '@/components/ui/UnsavedChanges'
import { Meal } from '@/app/(authenticated)/layout'
import DietMealLoading from './DietMealLoading'

export default function DietMealsPage({
  meals,
  dietId,
  isLoading
}: {
  isLoading: boolean
  meals: Meal[]
  dietId: string
}) {
  return (
    <>
      <div className='flex flex-col w-full p-4 gap-12 mt-6 '>
        {isLoading
          ? meals?.map((meal: Meal) => <DietMealLoading key={meal.id} />)
          : meals?.map((meal: Meal) => <DietMeal key={meal.id} meal={meal} />)}
        <AddRef />
      </div>
      <Modal.Open opens={`deleteDiet${dietId}`}>
        <div className='text-center mt-4 mb-4 underline-offset-2 underline cursor-pointer text-darkred'>
          Apagar Dieta
        </div>
      </Modal.Open>
      <Modal.Window name='unsavedChanges'>
        <UnsavedChanges />
      </Modal.Window>
      <Modal.Window name={'createNewMeal'}>
        <EditRef
          creating={true}
          dietFromId={dietId}
          currentIndex={0}
          typeInput='Alimentos'
          modalName='createNewMeal'
        />
      </Modal.Window>
    </>
  )
}
