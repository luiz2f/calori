'use client'
import { login } from '@/actions/auth'
import Button from '../ui/Button'
import { FcGoogle } from 'react-icons/fc'

type LoginGoogleProps = {
  isLogin?: boolean
}

export default function LoginGoogle({ isLogin = true }: LoginGoogleProps) {
  return (
    <Button
      onClick={() => login('google')}
      cw='light'
      className='!text-base
'
    >
      <div className='flex justify-center items-center gap-x-2'>
        <FcGoogle className='w-7 h-7' />
        <p>{isLogin ? 'Entrar' : 'Registrar'} com Google</p>
      </div>
    </Button>
  )
}
