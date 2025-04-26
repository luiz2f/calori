'use client'
import { useCreateBasicDiet } from '@/app/data/diets/useCreateBasicDiets'
import { HiOutlinePlus } from 'react-icons/hi'

export default function AddBasicDiet() {
  const { isCreating, createBasicDiet, isSuccess } = useCreateBasicDiet()

  const disabled = isCreating || isSuccess
  return (
    <>
      <button disabled={disabled} onClick={() => createBasicDiet()}>
        <div
          className={`w-44 h-24 flex-shrink-0 rounded-lg shadow-dbde text-white ${disabled ? ' bg-grey50' : 'bg-darkgreen'}`}
        >
          <div className='flex flex-col h-full items-center justify-center '>
            <div className='text-sm mb-1 font-medium max-w-32 '>
              Criar dieta padrão
            </div>
            <div>
              <HiOutlinePlus className='h-4 w-4 width text-white' />
            </div>
          </div>
        </div>
      </button>
    </>
  )
}
