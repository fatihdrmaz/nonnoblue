import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface BoatForCard {
  id: string
  name: string
  type: string
  ribbon: string
  cabins: string | number
  maxPax: number
  marina: string
  badge: string | null
  img: string
  priceFrom: number
}

interface BoatCardProps {
  boat: BoatForCard;
  className?: string;
}

function toPublicUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `https://eieshihgnevszcsaziyn.supabase.co/storage/v1/object/public/boat-photos/${path}`;
}

export function BoatCard({ boat, className }: BoatCardProps) {
  const imgSrc = toPublicUrl(boat.img);
  return (
    <Link href={`/filo/${boat.id}`} className={cn("nb-boat-card group block", className)}>
      <div className="nb-boat-img">
        {imgSrc && <Image
          src={imgSrc}
          alt={boat.name}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-700 group-hover:scale-[1.06]"
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
        />}
        {boat.badge && <span className="nb-boat-badge">{boat.badge}</span>}
        <button
          className="nb-boat-heart"
          aria-label="Favorilere ekle"
          onClick={e => e.preventDefault()}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      <div className="nb-boat-body">
        <div className="nb-boat-meta">{boat.type} · {boat.ribbon}</div>
        <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 4 }}>
          {boat.name}
        </h3>
        <div className="nb-boat-specs">
          <span>⚓ {boat.cabins} kabin</span>
          <span>👥 max {boat.maxPax}</span>
          <span>📍 {boat.marina}</span>
        </div>
        <div className="nb-boat-foot">
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>
              itibaren
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--deep)', letterSpacing: '-0.02em' }}>
              €{boat.priceFrom.toLocaleString('tr-TR')}
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)' }}> / hafta</span>
            </div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: 4 }}>
            İncele →
          </span>
        </div>
      </div>
    </Link>
  );
}
