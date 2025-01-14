import Spinner from '@/components/ui/Spinner'

export default function LoadingPage({
  title = 'Erro',
  subtitle = 'Um erro inesperado ocorreu'
}: {
  title: string
  subtitle: string
}) {
  return (
    <div className='flex flex-col w-full h-full justify-between items-center'>
      <div className='flex flex-col items-center h-full justify-center'>
        <Spinner />
        <h1 className='text-2xl w-full text-center font-bold mb-2'>{title}</h1>
        <h4 className='text-xl text-darkgreen w-full text-center mb-6'>
          {subtitle}
        </h4>
      </div>
    </div>
  )
}
