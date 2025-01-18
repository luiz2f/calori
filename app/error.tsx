'use client' // Error boundaries must be Client Components

import ErrorPage from '@/components/by-page/auth/ErrorPage'
import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'
import { useEffect } from 'react'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className='w-full flex items-center  flex-col flex-grow h-full'>
      <div className='w-full grid grid-rows-[100px_1fr]  h-full'>
        <div className='text-3xl self-center text-center '>
          <Logo />
        </div>
        <div className='px-6'>
          <ErrorPage
            title='Um erro inesperado ocorreu 😢'
            subtitle='Tente novamente'
          >
            <Button onClick={reset}>Voltar para o início</Button>
          </ErrorPage>
        </div>
      </div>
    </main>
  )
}
