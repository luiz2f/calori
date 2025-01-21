import Logo from '@/components/ui/Logo'

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='w-full flex items-center  flex-col flex-grow h-full'>
      <div className='w-full grid grid-rows-[100px_1fr]  h-full'>
        <div className='self-center w-fit mx-auto '>
          <Logo height={25} />
        </div>
        <div className='px-6'>{children}</div>
      </div>
    </main>
  )
}
