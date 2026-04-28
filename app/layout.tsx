import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'NonnoBlue — Tekne Kiralama | Göcek & Fethiye',
    template: '%s | NonnoBlue',
  },
  description:
    'NonnoBlue ile Göcek ve Fethiye çıkışlı özel tekne kiralama. Katamaran ve yelkenli seçenekleriyle Ege ve Akdeniz\'in en güzel koylarını keşfedin.',
  keywords: [
    'tekne kiralama', 'göcek', 'fethiye', 'katamaran', 'mavi yolculuk',
    'ege', 'akdeniz', 'yat kiralama', 'gulet kiralama', 'boat rental turkey',
    'yacht charter gocek', 'sailing holiday turkey',
  ],
  metadataBase: new URL('https://www.nonnoblue.com'),
  alternates: {
    canonical: '/',
    languages: {
      'tr': '/',
      'en': '/en',
    },
  },
  openGraph: {
    title: 'NonnoBlue — Tekne Kiralama | Göcek & Fethiye',
    description:
      'Göcek ve Fethiye\'den kalkan özel tekne turları. Katamaran ve yelkenli seçenekleri.',
    locale: 'tr_TR',
    alternateLocale: 'en_US',
    type: 'website',
    siteName: 'NonnoBlue',
    url: 'https://www.nonnoblue.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NonnoBlue — Tekne Kiralama | Göcek & Fethiye',
    description: 'Göcek ve Fethiye\'den kalkan özel tekne turları.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HKBH06RK43"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HKBH06RK43');
          `}
        </Script>
      </body>
    </html>
  );
}
