import { cn } from '@/lib/utils';

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionTitle({ eyebrow, title, sub, align = 'left', className }: SectionTitleProps) {
  return (
    <div className={cn('mb-12', align === 'center' && 'text-center mx-auto max-w-2xl', className)}>
      {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
      <h2 className="display text-[clamp(32px,4vw,52px)] mb-4">{title}</h2>
      {sub && <p style={{ fontSize: 17, color: 'var(--muted)', lineHeight: 1.65 }}>{sub}</p>}
    </div>
  );
}
