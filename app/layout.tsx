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

export const metadata = {
  title: 'Calori',
  description: 'Um planejador de Dietas simples, bonito e personalizável',
  keywords:
    'calórico, calorias, caloria, calorímetro, nutrição, comida, receita, planejador, pessoal, saúde, fitness, dieta, peso, rastreador, refeição, rastreador de refeições, planejador de refeições, planejador de receitas, rastreador calórico, rastreador de calorias, planejador calórico, planejador de calorias.',
  icons: { icon: '/icon.png' }
}

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1.0,
    maximumScale: 1.0,
    userScalable: false
  }
}

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
