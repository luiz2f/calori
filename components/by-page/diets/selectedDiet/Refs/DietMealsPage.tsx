'use client'
import AddRef from './AddRef'
import DietMeal from './DietMeal'
import Modal from '@/components/ui/Modal'
import EditRef from './createEditRef/EditRef'
import { useDeleteDiet } from '@/app/data/diets/useDeleteDiet'
import ConfirmDelete from '@/components/ui/ConfirmDelete'
import UnsavedChanges from '@/components/ui/UnsavedChanges'
import Spinner from '@/components/ui/Spinner'
import { Meal } from '@/actions/diets/meals'

export default function DietMealsPage({
  meals,
  dietId,
  name,
  isLoading
}: {
  isLoading: boolean
  meals: Meal[]
  dietId: string
  name: string
}) {
  const { isDeleting, deleteDiet, isSuccess } = useDeleteDiet()
  const handleDeleteDiet = async () => {
    await deleteDiet(dietId)
  }

  return (
    <>
      {isLoading ? (
        <div className='my-8'>
          <Spinner />
        </div>
      ) : (
        <>
          <div className='flex flex-col w-full p-4 gap-12 mt-6 '>
            {meals?.map((meal: Meal) => (
              <DietMeal key={meal.id} meal={meal} />
            ))}
            <AddRef />
          </div>
          <Modal.Open opens={`deleteDietG${dietId}`}>
            <div className='text-center mt-4 mb-4 underline-offset-2 underline cursor-pointer text-darkred'>
              Apagar Dieta
            </div>
          </Modal.Open>
          <Modal.Window name='unsavedChanges'>
            <UnsavedChanges />
          </Modal.Window>
          <Modal.Window name={`deleteDietG${dietId}`}>
            <ConfirmDelete
              loading={isDeleting}
              loaded={!isDeleting && isSuccess}
              resource='Dieta'
              resourceName={`${name}`}
              onConfirm={handleDeleteDiet}
              modalName={`deleteDietG${dietId}`}
            />
          </Modal.Window>
          <Modal.Window name={'createNewMeal'}>
            <EditRef
              creating={true}
              dietFromId={dietId}
              meal={null}
              currentIndex={0}
              typeInput='Alimentos'
              modalName='createNewMeal'
            />
          </Modal.Window>
        </>
      )}
    </>
  )
}
