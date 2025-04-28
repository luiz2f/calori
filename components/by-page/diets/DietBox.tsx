'use client'
import Menus from '@/components/ui/Menu'
import Modal from '@/components/ui/Modal'
import {
  HiDotsHorizontal,
  HiOutlineDuplicate,
  HiOutlinePencilAlt,
  HiOutlineTrash
} from 'react-icons/hi'
import ConfirmDelete from '@/components/ui/ConfirmDelete'
import EditDiet from './dietSlider/createEditModal/EditDiet'
import { useDeleteDiet } from '@/app/data/diets/useDeleteDiet'
import { DietFromSlider } from '@/app/(authenticated)/layout'

export const dynamic = 'force-dynamic'

const characterLimit = 36

export default function DietBox({
  name,
  active,
  diet,
  duplicateDiet,
  onClick
}: {
  name: string
  active: boolean
  diet: DietFromSlider
  duplicateDiet: () => void
  onClick: () => void
}) {
  const { isDeleting, deleteDiet, isSuccess } = useDeleteDiet()
  const dietId = diet?.id

  const adaptedName =
    name.length > characterLimit ? name.slice(0, characterLimit) + '...' : name

  const handleDeleteDiet = async () => {
    await deleteDiet(dietId)
  }
  const handleDuplicateDiet = async () => {
    await duplicateDiet()
  }

  return (
    <>
      <div
        className={`flex flex-col cursor-pointer justify-between w-44 h-24 text-left  white flex-shrink-0 rounded-lg p-db ${active ? 'shadow-dbbd text-darkgreen' : 'shadow-dbde text-blacklight'}`}
        onClick={onClick}
      >
        <div className='flex justify-between w-full'>
          <div className='text-sm font-medium max-w-32 overflow-hidden ellipsis h-14 pt-2'>
            {adaptedName}
          </div>
          <Menus.Menu className='!items-baseline'>
            <Menus.Toggle id={`DietToogle${dietId}`} className='p-3'>
              <HiDotsHorizontal />
            </Menus.Toggle>

            <Menus.List id={`DietToogle${dietId}`}>
              <Modal.Open opens={`editDiet${dietId}`}>
                <Menus.Button icon={<HiOutlinePencilAlt />}>
                  Editar dieta
                  {/* modal🐥 */}
                </Menus.Button>
              </Modal.Open>
              <Menus.Button
                icon={<HiOutlineDuplicate />}
                onClick={handleDuplicateDiet}
              >
                Duplicar dieta
                {/* action 🐥 */}
              </Menus.Button>
              <Modal.Open opens={`deleteDiet${dietId}`}>
                <Menus.Button icon={<HiOutlineTrash />}>
                  Apagar dieta
                  {/* confirm ⛔ */}
                  {/* action 🐥 */}
                </Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>
        </div>
        <div className='font-bold pr-3 w-full align-bottom text-right'></div>
      </div>
      <Modal.Window name={`deleteDiet${dietId}`}>
        <ConfirmDelete
          loading={isDeleting}
          loaded={!isDeleting && isSuccess}
          resource='Dieta'
          resourceName={`${name}`}
          onConfirm={handleDeleteDiet}
          modalName={`deleteDiet${dietId}`}
        />
      </Modal.Window>
      <Modal.Window name={`editDiet${dietId}`}>
        <EditDiet diet={diet} modalName={`editDiet${dietId}`} />
      </Modal.Window>
    </>
  )
}
