import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col">
      <Nav />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
