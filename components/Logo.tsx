import { cn } from '@/lib/utils';

interface LogoProps {
  invert?: boolean;
  className?: string;
  height?: number;
}

export function Logo({ invert = false, className, height = 28 }: LogoProps) {
  return (
    <span
      className={cn('inline-flex items-baseline gap-0.5', className)}
      style={{ fontSize: height * 0.72 }}
    >
      <span
        className="font-serif font-bold tracking-tight"
        style={{ color: invert ? '#ffffff' : '#0b2545' }}
      >
        Nonno
      </span>
      <span
        className="font-serif font-bold italic tracking-tight"
        style={{ color: invert ? '#8dc7dc' : '#1d6a96' }}
      >
        Blue
      </span>
    </span>
  );
}
