'use client'
import Modal from '@/components/ui/Modal'
import { HiPlus } from 'react-icons/hi'

export default function AddRef() {
  return (
    <Modal.Open opens='createNewMeal'>
      <div className='border-grey10 border-1 cursor-pointer h-20 justify-center rounded-lg flex flex-col w-full relative'>
        <div className='flex items-baseline  gap-1 absolute top-[-16px] bg-white px-1 left-0 '>
          <div className='font-medium text-2xl'>Adicionar Nova Refeição</div>
        </div>
        <HiPlus className='w-7 h-7 mx-auto text-darkgreen' />
      </div>
    </Modal.Open>
  )
}
