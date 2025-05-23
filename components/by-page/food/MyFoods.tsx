'use client'

import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import MyFoodRow from './MyFoodRow'
import { IoClose, IoSearchSharp } from 'react-icons/io5'
import { useMemo, useState } from 'react'
import Spinner from '@/components/ui/Spinner'
import { Food } from '@/app/(authenticated)/layout'

export default function MyFoods({
  onCloseModal,
  userFoods,
  isLoading
}: {
  onCloseModal?: () => void
  userFoods: Food[] | [] | undefined
  isLoading: boolean
}) {
  const [search, setSearch] = useState('')

  const emptySearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setSearch('')
  }

  const filteredFoods = useMemo(() => {
    if (!search) return userFoods

    const normalizedSearch = search
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    return userFoods?.filter(food => {
      const normalizedFoodName = food?.name
        ?.toLowerCase()
        ?.normalize('NFD')
        ?.replace(/[\u0300-\u036f]/g, '')

      return normalizedFoodName?.includes(normalizedSearch)
    })
  }, [search, userFoods])

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
          <div className='absolute top-0 right-0 p-3 text-grey50 leading-3'>
            {search ? (
              <button
                type='button'
                onClick={emptySearch}
                className='p-0 m-0 bg-transparent border-none'
              >
                <IoClose />
              </button>
            ) : (
              <div>
                <IoSearchSharp />
              </div>
            )}
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
        <Button size='small' cw='lightred' onClick={() => onCloseModal?.()}>
          Fechar{' '}
        </Button>
      </div>
    </>
  )
}
