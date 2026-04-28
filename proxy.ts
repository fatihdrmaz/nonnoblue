import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const PROTECTED = ['/admin', '/hesabim'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API, admin, _next, static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.match(/\.(.+)$/)
  ) {
    return NextResponse.next({ request });
  }

  // Run next-intl middleware first
  const intlResponse = intlMiddleware(request);

  // Determine the locale-stripped pathname for auth checks
  const strippedPathname = pathname.replace(/^\/(en|tr)/, '') || '/';
  const needsAuth = PROTECTED.some((p) => strippedPathname.startsWith(p));

  if (!needsAuth) {
    return intlResponse;
  }

  // Auth check for protected routes
  const response = intlResponse ?? NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // /admin/* → redirect to /giris if not logged in
  if (strippedPathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/giris', request.url));
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // /hesabim/* → redirect to /giris if not logged in
  if (strippedPathname.startsWith('/hesabim')) {
    if (!user) {
      return NextResponse.redirect(new URL('/giris', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|admin|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
