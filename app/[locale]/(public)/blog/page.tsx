'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { BLOG_POSTS } from '@/data/mock';

const CATEGORY_EN: Record<string, string> = {
  'Rehber': 'Guide',
  'Rota Rehberi': 'Route Guide',
  'Tekne İnceleme': 'Boat Review',
  'Haber': 'News',
  'İpuçları': 'Tips',
};

function localizeCategory(cat: string, locale: string) {
  return locale === 'en' ? (CATEGORY_EN[cat] ?? cat) : cat;
}

function localizeReadTime(rt: string, locale: string) {
  if (locale !== 'en') return rt;
  return rt.replace('dk', 'min');
}

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  title_en: string | null;
  excerpt_en: string | null;
  img_url: string;
  category: string;
  read_time: string;
  published_at: string;
};

function normalizeMockPost(p: typeof BLOG_POSTS[0]): BlogPost {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    title_en: null,
    excerpt_en: null,
    img_url: p.img,
    category: p.category,
    read_time: p.readTime,
    published_at: p.date,
  };
}

export default function BlogPage() {
  const t = useTranslations('blog');
  const tc = useTranslations('common');
  const locale = useLocale();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('blog_posts')
      .select('id,slug,title,excerpt,title_en,excerpt_en,img_url,category,read_time,published_at')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setPosts(data as BlogPost[]);
        } else {
          setPosts(BLOG_POSTS.map(normalizeMockPost));
        }
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* Page Head */}
      <div className="nb-page-head">
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 16 }}>{t('title')}</div>
          <h1 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 20 }}>
            {t('title')}
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.65, opacity: 0.8, maxWidth: 560 }}>
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <section className="nb-section">
        <div className="container">
          {loading ? (
            <div className="nb-blog-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ opacity: 0.3 }}>
                  <div className="nb-blog-img" style={{ background: 'var(--mist)' }} />
                  <div style={{ height: 16, background: 'var(--mist)', borderRadius: 4, marginBottom: 8 }} />
                  <div style={{ height: 48, background: 'var(--mist)', borderRadius: 4 }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="nb-blog-grid">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function BlogCard({ post, locale }: { post: BlogPost; locale: string }) {
  const displayTitle = locale === 'en' && post.title_en ? post.title_en : post.title;
  const displayExcerpt = locale === 'en' && post.excerpt_en ? post.excerpt_en : post.excerpt;
  return (
    <Link href={`/blog/${post.slug}`} className="nb-blog" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
      <div className="nb-blog-img">
        <Image
          src={post.img_url}
          alt={displayTitle}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
        />
        <span style={{
          position: 'absolute',
          top: 14,
          left: 14,
          background: 'var(--teal)',
          color: '#fff',
          fontSize: 11,
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: 6,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          zIndex: 1,
        }}>
          {localizeCategory(post.category, locale)}
        </span>
      </div>
      <div className="nb-blog-meta">
        <span>{post.published_at}</span>
        <span>·</span>
        <span>{localizeReadTime(post.read_time, locale)}</span>
      </div>
      <h3>{displayTitle}</h3>
      <p>{displayExcerpt}</p>
    </Link>
  );
}
