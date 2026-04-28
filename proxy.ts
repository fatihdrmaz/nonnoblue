import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED = ['/admin', '/hesabim'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes → proxy'i atla, Supabase çağrısı yapma
  const needsAuth = PROTECTED.some((p) => pathname.startsWith(p));
  if (!needsAuth) {
    return NextResponse.next({ request });
  }

  const response = NextResponse.next({ request });

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

  // /admin/* → giriş yapmamışsa /giris'e yönlendir
  if (pathname.startsWith('/admin')) {
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

  // /hesabim/* → giriş yapmamışsa /giris'e yönlendir
  if (pathname.startsWith('/hesabim')) {
    if (!user) {
      return NextResponse.redirect(new URL('/giris', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
