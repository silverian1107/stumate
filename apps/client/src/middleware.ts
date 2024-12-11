import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('access_token');
  const role = req.cookies.get('role');

  const url = req.nextUrl.clone();

  if (!accessToken) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith('/admin')) {
    if (role?.value.toLowerCase() !== 'admin') {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  if (url.pathname.startsWith('/apps')) {
    if (role?.value.toLowerCase() !== 'user') {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/apps/:path*']
};
