import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  if (pathname.startsWith('/verify-otp')) {
    if (!searchParams.has('email')) {
      const url = new URL('/forget-password', request.url)
      return NextResponse.redirect(url)
    }
  }

  if (pathname.startsWith('/reset-password')) {
    if (!searchParams.has('token')) {
      const url = new URL('/forget-password', request.url)
      return NextResponse.redirect(url)
    }
  }


  return NextResponse.next()
}

export const config = {
  matcher: [
    '/verify-otp/:path*', 
    '/reset-password/:path*'
  ],
}