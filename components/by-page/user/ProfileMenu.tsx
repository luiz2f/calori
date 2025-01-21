'use client'

import { useOutsideClick } from '@/hooks/useOutsideClick'
import { HiMiniLockClosed } from 'react-icons/hi2'
import { IoScale } from 'react-icons/io5'
import { TbSoupFilled } from 'react-icons/tb'
import Modal from '../../ui/Modal'
import Link from 'next/link'

export default function ProfileMenu({
  username,
  handler
}: {
  username: string
  handler: () => void
}) {
  const ref = useOutsideClick<HTMLDivElement>(handler, false)

  const buttonStyle = `flex gap-2 cursor-pointer items-center px-4 p-2 transition duration-fast 
  hover:bg-ulgrey 
  active:bg-greylight `
  return (
    <>
      <div
        ref={ref}
        className='absolute right-2 top-[90%] bg-white w-fit shadow-md border-grey10 border-1 rounded-lg'
      >
        <div className='flex flex-col py-2'>
          <div className='px-4 p-2'>
            <span className='text-lightblack text-xl'>Olá, {username}</span>
            <Link href='/logout'>
              <div className='underline text-sm text-blacklight'>
                Sair da conta
              </div>
            </Link>
          </div>

          <Link href='/change-password'>
            <div className={buttonStyle}>
              <HiMiniLockClosed />
              <span className='text-darkgreen'>Alterar Senha</span>
            </div>
          </Link>
          <Modal.Open opens='my-weight'>
            <button className={buttonStyle} onClick={handler}>
              <IoScale /> <span className='text-darkgreen'>Meu Peso</span>
            </button>
          </Modal.Open>
          <Modal.Open opens='my-foods'>
            <button className={buttonStyle} onClick={handler}>
              <TbSoupFilled />
              <span className='text-darkgreen'>Meus Alimentos</span>
            </button>
          </Modal.Open>
        </div>
      </div>
    </>
  )
}
