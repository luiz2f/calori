import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/', '/middleware', '/change-password', '/diets']
const noUserRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password'
]

export default async function middleware(request: NextRequest) {
  const session = await auth()
  const pathname = request.nextUrl.pathname

  const isProtected = protectedRoutes.some(route => pathname === route)

  const isPublic = noUserRoutes.some(route => pathname === route)

  if (!session && isProtected) {
    return NextResponse.redirect(new URL('/login', request.nextUrl.origin))
  }

  if (session && isPublic && pathname !== '/diets') {
    return NextResponse.redirect(new URL('/diets', request.nextUrl.origin))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|static|_next/static|_next/image|favicon.ico).*)']
}
