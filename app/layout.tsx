import localFont from 'next/font/local'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'

const expose = localFont({
  src: [
    {
      path: '/fonts/expose/Expose-Black.woff2',
      weight: '900',
      style: 'normal'
    },
    {
      path: '/fonts/expose/Expose-Bold.woff2',
      weight: '700',
      style: 'normal'
    },
    {
      path: '/fonts/expose/Expose-Medium.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: '/fonts/expose/Expose-Regular.woff2',
      weight: '400',
      style: 'normal'
    }
  ]
})

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <html lang='en' className={expose.className}>
        <body className='h-svh'>
          <div className='mx-auto max-w-screen-lg h-svh flex flex-col bg-white text-black'>
            <div className='flex flex-col flex-grow'>{children}</div>
          </div>
        </body>
      </html>
    </SessionProvider>
  )
}
