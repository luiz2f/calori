import ErrorPage from '@/components/by-page/auth/ErrorPage'
import Logo from '@/components/ui/Logo'
import NavButton from '@/components/ui/NavButton'

export default function NotFound() {
  return (
    <main className='w-full flex items-center  flex-col flex-grow h-full'>
      <div className='w-full grid grid-rows-[100px_1fr]  h-full'>
        <div className='text-3xl self-center text-center '>
          <Logo />
        </div>
        <div className='px-6'>
          <ErrorPage title='Erro 404 😢' subtitle='Página não encontrada'>
            <NavButton href='/'>Voltar para o início</NavButton>
          </ErrorPage>
        </div>
      </div>
    </main>
  )
}
