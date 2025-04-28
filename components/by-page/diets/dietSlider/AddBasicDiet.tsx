'use client'
import { useCreateBasicDiet } from '@/app/data/diets/useCreateBasicDiets'
import Spinner from '@/components/ui/Spinner'
import { HiOutlinePlus } from 'react-icons/hi'

export default function AddBasicDiet() {
  const { isCreating, createBasicDiet, isSuccess } = useCreateBasicDiet()

  const disabled = isCreating || isSuccess
  return (
    <>
      <button disabled={disabled} onClick={() => createBasicDiet()}>
        <div
          className={`w-44 h-24 flex-shrink-0 rounded-lg shadow-dbde bg-lightgreen text-white ${disabled ? ' bg-grey50' : 'bg-green30'}`}
        >
          <div className='flex flex-col h-full items-center justify-center '>
            <div className='text-sm mb-1 font-medium max-w-32 '>
              {isCreating ? 'Criando dieta padrão' : 'Criar dieta padrão'}
            </div>
            <div>
              {isCreating ? (
                <Spinner white small />
              ) : (
                <HiOutlinePlus className='h-4 w-4 width text-white' />
              )}
            </div>
          </div>
        </div>
      </button>
    </>
  )
}
