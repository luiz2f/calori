'use client'
import Modal from '@/components/ui/Modal'
import { HiOutlinePlus } from 'react-icons/hi'
import EditDiet from './createEditModal/EditDiet'

export default function AddDiet({
  isFirstDiet = false
}: {
  isFirstDiet?: boolean
}) {
  return (
    <>
      <Modal.Open opens='new-diet'>
        <button>
          <div className='w-44 h-24  flex-shrink-0 rounded-lg shadow-dbde text-blacklight'>
            <div className='flex flex-col h-full items-center justify-center '>
              <div className='text-sm mb-1 font-medium max-w-32 '>
                {isFirstDiet ? (
                  <>
                    Começar do zero <br />
                  </>
                ) : (
                  'Criar Nova Dieta'
                )}
              </div>
              <div>
                <HiOutlinePlus className='h-4 w-4 width text-darkgreen' />
              </div>
            </div>
          </div>
        </button>
      </Modal.Open>
      <Modal.Window name='new-diet'>
        <EditDiet modalName='new-diet' creating={true} />
      </Modal.Window>
    </>
  )
}
