import { createBrowserClient } from '@supabase/ssr';

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: (url, options) => {
          const isAuth = typeof url === 'string' && url.includes('/auth/');
          return fetch(url, {
            ...options,
            signal: isAuth ? options?.signal : AbortSignal.timeout(5000),
          });
        },
      },
    }
  );
