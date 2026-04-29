'use client';

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string | null;
  title_en: string | null;
  excerpt_en: string | null;
  content_en: string | null;
  img_url: string;
  category: string;
  read_time: string;
  published: boolean;
  published_at: string;
  created_at: string;
};

type RelatedPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  title_en: string | null;
  excerpt_en: string | null;
  img_url: string;
  category: string;
  read_time: string;
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const locale = useLocale();
  const t = useTranslations('blog');
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);
  const [related, setRelated] = useState<RelatedPost[]>([]);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
      .then(({ data }) => {
        setPost(data ?? null);
      });

    supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, title_en, excerpt_en, img_url, category, read_time')
      .eq('published', true)
      .neq('slug', slug)
      .limit(2)
      .then(({ data }) => {
        setRelated(data ?? []);
      });
  }, [slug]);

  // Still loading
  if (post === undefined) {
    return (
      <main
        style={{
          background: 'var(--bg)',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: '3px solid var(--line)',
            borderTopColor: 'var(--teal)',
            borderRadius: '50%',
            animation: 'nb-spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes nb-spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    );
  }

  if (post === null) notFound();

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString(locale === 'en' ? 'en-GB' : 'tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const displayTitle = locale === 'en' && post.title_en ? post.title_en : post.title;
  const displayExcerpt = locale === 'en' && post.excerpt_en ? post.excerpt_en : post.excerpt;
  const displayContent = locale === 'en' && post.content_en ? post.content_en : (post.content ?? post.excerpt);

  const bodyParagraphs = displayContent
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* ── Hero image ──────────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: 400, background: 'var(--deep)' }}>
        <Image
          src={post.img_url}
          alt={displayTitle}
          fill
          priority
          style={{ objectFit: 'cover', opacity: 0.75 }}
          sizes="100vw"
        />
        {/* Dark gradient for text readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(10,31,61,0.4) 0%, rgba(10,31,61,0.65) 100%)',
          }}
        />
        {/* Breadcrumb */}
        <div
          className="container"
          style={{
            position: 'absolute',
            top: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
          }}
        >
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            <Link href="/" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>
              {t('home')}
            </Link>
            <span style={{ opacity: 0.5 }}>/</span>
            <Link href="/blog" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>
              {t('title')}
            </Link>
            <span style={{ opacity: 0.5 }}>/</span>
            <span
              style={{
                color: '#fff',
                maxWidth: 300,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayTitle}
            </span>
          </nav>
        </div>
      </div>

      {/* ── Article ─────────────────────────────────────────────────── */}
      <div className="container">
        <article
          style={{
            maxWidth: 800,
            margin: '0 auto',
            padding: '56px 0 80px',
          }}
        >
          {/* Meta bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 24,
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                background: 'var(--teal)',
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 6,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {post.category}
            </span>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>{formattedDate}</span>
            <span style={{ fontSize: 13, color: 'var(--muted)', opacity: 0.5 }}>·</span>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>{post.read_time} {t('reading')}</span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: 'var(--font-serif, "Playfair Display", serif)',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 700,
              lineHeight: 1.2,
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
              marginBottom: 24,
            }}
          >
            {displayTitle}
          </h1>

          {/* Lead / excerpt */}
          <p
            style={{
              fontSize: 20,
              lineHeight: 1.7,
              color: 'var(--muted)',
              borderLeft: '4px solid var(--teal)',
              paddingLeft: 20,
              marginBottom: 40,
            }}
          >
            {displayExcerpt}
          </p>

          {/* Body paragraphs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {bodyParagraphs.map((paragraph, idx) => (
              <p
                key={idx}
                style={{
                  fontSize: 16,
                  lineHeight: 1.85,
                  color: 'var(--ink)',
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* CTA */}
          <div
            style={{
              marginTop: 64,
              padding: '36px 40px',
              background: 'var(--deep)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              alignItems: 'flex-start',
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                color: 'var(--sky)',
              }}
            >
              {t('cta_eyebrow')}
            </p>
            <h3
              style={{
                fontFamily: 'var(--font-serif, "Playfair Display", serif)',
                fontSize: 24,
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1.3,
              }}
            >
              {t('cta_title')}
            </h3>
            <p style={{ fontSize: 15, color: 'var(--mist)', lineHeight: 1.6 }}>
              {t('cta_body')}
            </p>
            <Link
              href="/iletisim"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '13px 24px',
                background: 'var(--teal)',
                color: '#fff',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background 0.2s ease',
              }}
            >
              {t('cta_btn')}
            </Link>
          </div>
        </article>
      </div>

      {/* ── Related posts ────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section
          style={{
            background: 'var(--sand)',
            padding: '72px 0 100px',
          }}
        >
          <div className="container">
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                color: 'var(--teal)',
                marginBottom: 12,
              }}
            >
              {t('more_label')}
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-serif, "Playfair Display", serif)',
                fontSize: 28,
                fontWeight: 700,
                color: 'var(--ink)',
                marginBottom: 40,
                letterSpacing: '-0.01em',
              }}
            >
              {t('related_title')}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 28,
              }}
              className="nb-related-grid"
            >
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <article
                    className="nb-blog-card"
                    style={{
                      background: 'var(--card)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--line)',
                      overflow: 'hidden',
                      display: 'flex',
                      gap: 0,
                      flexDirection: 'row',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ position: 'relative', width: 140, flexShrink: 0 }}>
                      <Image
                        src={rel.img_url}
                        alt={rel.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="140px"
                      />
                    </div>
                    <div style={{ padding: '18px 20px', flex: 1 }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: 'var(--teal)',
                          display: 'block',
                          marginBottom: 6,
                        }}
                      >
                        {rel.category}
                      </span>
                      <h3
                        style={{
                          fontFamily: 'var(--font-serif, "Playfair Display", serif)',
                          fontSize: 16,
                          fontWeight: 700,
                          lineHeight: 1.35,
                          color: 'var(--ink)',
                          marginBottom: 8,
                        }}
                      >
                        {locale === 'en' && rel.title_en ? rel.title_en : rel.title}
                      </h3>
                      <p style={{ fontSize: 13, color: 'var(--muted)' }}>
                        {locale === 'en' && rel.excerpt_en ? rel.excerpt_en : rel.excerpt}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Responsive overrides ─────────────────────────────────────── */}
      <style>{`
        @keyframes nb-spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 600px) {
          .nb-related-grid { grid-template-columns: 1fr !important; }
        }
        .nb-blog-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-lg) !important;
        }
      `}</style>
    </main>
  );
}
