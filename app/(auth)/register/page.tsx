'use client'

import ErrorPage from '@/components/by-page/auth/ErrorPage'
import RegisterPage from '@/components/by-page/auth/register/RegisterPage'
import NavAnchor from '@/components/ui/NavAnchor'
import NavButton from '@/components/ui/NavButton'
import { useState } from 'react'

export default function SignUp() {
  const [existentUser, setExistentUser] = useState(false)
  return (
    <div className='w-full h-full flex pt-4 pb-3'>
      <section className='flex flex-col w-full h-full justify-between '>
        {!existentUser ? (
          <RegisterPage setExistentUser={setExistentUser} />
        ) : (
          <ErrorPage
            title='Cadastro não realizado'
            subtitle='Usuário já existente'
          >
            <NavButton href='/login'>Fazer Login</NavButton>

            <NavAnchor href='/forgot-password'>Recuperar Senha</NavAnchor>
          </ErrorPage>
        )}
      </section>
    </div>
  )
}
