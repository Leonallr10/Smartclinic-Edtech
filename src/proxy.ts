import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect Dashboard Routes
  if (pathname.startsWith('/patient') || pathname.startsWith('/doctor') || pathname.startsWith('/admin')) {
    const user = await verifyToken(request);
    
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Role-based access control
    if (pathname.startsWith('/patient') && user.role !== 'PATIENT') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    if (pathname.startsWith('/doctor') && user.role !== 'DOCTOR') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    if (pathname.startsWith('/admin') && user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/patient/:path*', '/doctor/:path*', '/admin/:path*'],
};
