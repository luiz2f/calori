'use client'

import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import MyFoodRow from './MyFoodRow'
import { IoSearchSharp } from 'react-icons/io5'
import { useState } from 'react'
import Spinner from '@/components/ui/Spinner'
import { Food } from '@/app/(authenticated)/app'

export default function MyFoods({
  onCloseModal,
  userFoods,
  isLoading
}: {
  onCloseModal: () => void
  userFoods: Food[]
  isLoading: boolean
}) {
  const [search, setSearch] = useState('')

  const filteredFoods = userFoods?.filter(food => {
    const newFood = food?.name?.toLowerCase()?.includes(search.toLowerCase())
    return newFood
  })
  return (
    <>
      <div className='relative'>
        <div className='font-bold text-xl mb-8 text-center'>Meus Alimentos</div>
        <div className='relative w-full mb-4'>
          <input
            placeholder='Pesquisar Alimento'
            value={search}
            disabled={isLoading}
            onChange={e => setSearch(e.target.value)}
            className='p-2 w-full border-1 rounded-lg border-grey-50'
          />
          <div className='absolute top-0 right-0 p-3 text-grey50 line leading-3'>
            <IoSearchSharp />
          </div>
        </div>
        {isLoading ? (
          <div className='my-8'>
            <Spinner />
          </div>
        ) : (
          <>
            <div className='flex flex-col gap-2 mb-2'>
              {!!filteredFoods?.length ? (
                filteredFoods?.map(food => (
                  <MyFoodRow key={food.id} food={food} />
                ))
              ) : (
                <div className='text-center text-lightblack'>
                  Nenhum Alimento encontrado
                </div>
              )}
            </div>
            <Modal.Open opens='create-food'>
              <button
                type='button'
                className='text-darkgreen pl-2 mb-8 flex mx-auto text-bold underline'
              >
                + Criar Alimento
              </button>
            </Modal.Open>
          </>
        )}
        <Button size='small' cw='lightred' onClick={() => onCloseModal()}>
          Fechar{' '}
        </Button>
      </div>
    </>
  )
}
