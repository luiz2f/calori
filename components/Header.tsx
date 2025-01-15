'use client'

import { IoPersonCircleOutline } from 'react-icons/io5'
import Logo from './ui/Logo'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import ProfileMenu from './by-page/user/ProfileMenu'
import Modal from './ui/Modal'
import MyWeight from './by-page/user/MyWeight'
import { useWeight } from '@/app/data/user/useWeight'
import CreateEditFood from './by-page/food/CreateEditFood'
import MyFoods from './by-page/food/MyFoods'
import { useUserFoods } from '@/app/data/foods/useUserFoods'
import { HiMiniHome } from 'react-icons/hi2'
import { useRouter } from 'next/navigation'

export default function Header({ home = false }) {
  const [profileMenu, setProfileMenu] = useState(false)
  const user = useSession()
  const username = user.data?.user?.name || 'Usuário'
  const handler = () => setProfileMenu(false)
  const { data: weight } = useWeight()
  const { data: userFoods, isLoading } = useUserFoods()
  const router = useRouter()

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
  ) => {
    e.stopPropagation()
    e.preventDefault()
    router.push('/diets')
  }
  return (
    <>
      <header className=''>
        <div className='mx-auto max-w-screen-lg bg-white fixed h-14 w-full border-b-2 border-lightgreen flex  items-center justify-center z-50 '>
          {home ? (
            <button
              onClick={e => handleClick(e)}
              className='absolute top-1/2 -translate-y-1/2 left-0 p-3 w-min'
            >
              <HiMiniHome className='w-6 h-6 ' />
            </button>
          ) : (
            ''
          )}
          <div
            className='w-32 m-auto cursor-pointer'
            onClick={e => handleClick(e)}
          >
            <Logo />
          </div>
          <button
            id='profile-menu'
            className='absolute right-2 cursor-pointer top-50% text-2xl text-grey40'
            onClick={() => setProfileMenu(true)}
          >
            <IoPersonCircleOutline className='w-7 h-7 ' />
          </button>
          {profileMenu && <ProfileMenu username={username} handler={handler} />}
        </div>
      </header>
      <Modal.Window name='my-weight'>
        <MyWeight userWeight={weight || 0} />
      </Modal.Window>
      <Modal.Window name='my-weight-false'>
        <MyWeight userWeight={0} closeAfter={true} />
      </Modal.Window>
      <Modal.Window name='my-foods'>
        <MyFoods userFoods={userFoods} isLoading={isLoading} />
      </Modal.Window>
      <Modal.Window name='create-food'>
        <CreateEditFood modalName='create-food' />
      </Modal.Window>
      <Modal.Window name='create-food-return'>
        <CreateEditFood shouldReturn={true} modalName='create-food-return' />
      </Modal.Window>
    </>
  )
}
