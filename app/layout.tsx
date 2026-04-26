import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
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
  title: 'NonnoBlue — Tekne Kiralama | Göcek & Fethiye',
  description:
    'NonnoBlue ile Göcek ve Fethiye çıkışlı özel tekne kiralama. Gület, motor yat ve yelkenli seçenekleriyle Ege ve Akdeniz\'in en güzel koylarını keşfedin.',
  keywords: [
    'tekne kiralama',
    'göcek',
    'fethiye',
    'gulet',
    'mavi yolculuk',
    'ege',
    'akdeniz',
    'yat kiralama',
  ],
  openGraph: {
    title: 'NonnoBlue — Tekne Kiralama | Göcek & Fethiye',
    description:
      'Göcek ve Fethiye\'den kalkan özel tekne turları. Gület, motor yat ve yelkenli seçenekleri.',
    locale: 'tr_TR',
    type: 'website',
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
          <Nav />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
