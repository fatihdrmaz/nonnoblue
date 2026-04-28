import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const BASE_URL = 'https://www.nonnoblue.com';

const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/filo', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/rotalar', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/hizmetler', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/hakkimizda', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/rezervasyon', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/blog', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/sss', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/iletisim', priority: 0.6, changeFrequency: 'yearly' as const },
  { path: '/kariyer', priority: 0.5, changeFrequency: 'monthly' as const },
  { path: '/kvkk', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/gizlilik', priority: 0.3, changeFrequency: 'yearly' as const },
];

function buildEntries(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency']) {
  return [
    { url: `${BASE_URL}${path}`, priority, changeFrequency, lastModified: new Date() },
    { url: `${BASE_URL}/en${path}`, priority, changeFrequency, lastModified: new Date() },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of STATIC_ROUTES) {
    entries.push(...buildEntries(route.path, route.priority, route.changeFrequency));
  }

  try {
    const supabase = await createClient();

    const { data: boats } = await supabase
      .from('boats')
      .select('slug, updated_at')
      .eq('active', true);

    if (boats) {
      for (const boat of boats) {
        const lastMod = boat.updated_at ? new Date(boat.updated_at) : new Date();
        entries.push(
          { url: `${BASE_URL}/filo/${boat.slug}`, priority: 0.85, changeFrequency: 'monthly', lastModified: lastMod },
          { url: `${BASE_URL}/en/filo/${boat.slug}`, priority: 0.85, changeFrequency: 'monthly', lastModified: lastMod },
        );
      }
    }

    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('published', true);

    if (posts) {
      for (const post of posts) {
        const lastMod = post.updated_at ? new Date(post.updated_at) : new Date();
        entries.push(
          { url: `${BASE_URL}/blog/${post.slug}`, priority: 0.65, changeFrequency: 'monthly', lastModified: lastMod },
          { url: `${BASE_URL}/en/blog/${post.slug}`, priority: 0.65, changeFrequency: 'monthly', lastModified: lastMod },
        );
      }
    }
  } catch {
    // Supabase unavailable at build time — static entries still served
  }

  return entries;
}
