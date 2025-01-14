'use client'
import Menus from '@/components/ui/Menu'
import Modal from '@/components/ui/Modal'
import clsx from 'clsx'
import {
  HiDotsHorizontal,
  HiOutlineDuplicate,
  HiOutlinePencilAlt,
  HiOutlineTrash
} from 'react-icons/hi'
import ConfirmDelete from '@/components/ui/ConfirmDelete'
import EditDiet from './dietSlider/createEditModal/EditDiet'
import { useDeleteDiet } from '@/app/data/diets/useDeleteDiet'
import { useDuplicateDiet } from '@/app/data/diets/useDuplicateDiet'
import { BasicDiet } from '@/app/(authenticated)/app'

export const dynamic = 'force-dynamic'

const characterLimit = 36

export default function DietBox({
  name,
  active,
  diet,
  onClick
}: {
  name: string
  active: boolean
  diet: BasicDiet
  onClick: () => void
}) {
  const { isDeleting, deleteDiet, isSuccess } = useDeleteDiet()
  const { duplicateDiet } = useDuplicateDiet()
  const dietId = diet?.id
  // isDuplicating

  const adaptedName =
    name.length > characterLimit ? name.slice(0, characterLimit) + '...' : name

  const borderClass = clsx(
    'flex flex-col cursor-pointer justify-between w-44 h-24 text-left  white flex-shrink-0 rounded-lg p-db ',
    {
      ' shadow-dbbd text-darkgreen': active,
      ' shadow-dbde text-blacklight   ': !active
    }
  )

  const handleDeleteDiet = async () => {
    await deleteDiet(dietId)
  }
  const handleDuplicateDiet = async () => {
    await duplicateDiet(dietId)
  }

  return (
    <div className={borderClass} onClick={onClick}>
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
      </div>
      <div className='font-bold pr-3 w-full align-bottom text-right'></div>
    </div>
  )
}
