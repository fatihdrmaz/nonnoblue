'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string | null;
  img_url: string;
  category: string;
  read_time: string;
  published: boolean;
  published_at: string;
  created_at: string;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        setPosts(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--deep)',
          color: '#fff',
          padding: '140px 0 72px',
        }}
      >
        <div className="container">
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: 'var(--sky)',
              marginBottom: 16,
            }}
          >
            Blog
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-serif, "Playfair Display", serif)',
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            Yelken &amp; Denizcilik Rehberi
          </h1>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.65,
              color: 'var(--mist)',
              maxWidth: 560,
            }}
          >
            Tekne kiralama ipuçları, rota önerileri ve Türk sularında unutulmaz
            bir deniz tatili için bilmeniz gereken her şey.
          </p>
        </div>
      </section>

      {/* ── Blog Grid ────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0 120px' }}>
        <div className="container">
          {loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 320,
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
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 32,
              }}
              className="nb-blog-grid"
            >
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Responsive grid override ──────────────────────────────────── */}
      <style>{`
        @keyframes nb-spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .nb-blog-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .nb-blog-grid { grid-template-columns: 1fr !important; }
        }
        .nb-blog-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg) !important;
        }
        .nb-read-link:hover {
          color: var(--teal-2) !important;
        }
      `}</style>
    </main>
  );
}

// ── Card component ────────────────────────────────────────────────────────────
function BlogCard({ post }: { post: BlogPost }) {
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <article
      className="nb-blog-card"
      style={{
        background: 'var(--card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--line)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 200 }}>
        <Image
          src={post.img_url}
          alt={post.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
        />
        {/* Category pill */}
        <span
          style={{
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
          }}
        >
          {post.category}
        </span>
      </div>

      {/* Body */}
      <div
        style={{
          padding: '22px 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: 10,
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-serif, "Playfair Display", serif)',
            fontSize: 20,
            fontWeight: 700,
            lineHeight: 1.3,
            color: 'var(--ink)',
            letterSpacing: '-0.01em',
          }}
        >
          {post.title}
        </h2>

        <p
          style={{
            fontSize: 14,
            lineHeight: 1.65,
            color: 'var(--muted)',
            flex: 1,
          }}
        >
          {post.excerpt}
        </p>

        {/* Meta row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 12,
            color: 'var(--muted)',
            paddingTop: 8,
            borderTop: '1px solid var(--line)',
          }}
        >
          <span>{formattedDate}</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>{post.read_time} okuma</span>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="nb-read-link"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--teal)',
            transition: 'color 0.2s ease',
            marginTop: 4,
          }}
        >
          Devamını Oku →
        </Link>
      </div>
    </article>
  );
}
