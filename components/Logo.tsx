import Image from 'next/image';
import { cn } from '@/lib/utils';

export const LOGO_MARK = {
  color: '/logo/NonnoBlue_logo.png',
  leftwhite: '/logo/NonnoBlue_logo_leftwhite.png',
  white: '/logo/NonnoBlue_logo_White.png',
} as const;

export type LogoMark = keyof typeof LOGO_MARK;

interface LogoProps {
  invert?: boolean;
  className?: string;
  height?: number;
  priority?: boolean;
  /** Hero / transparent header: white-accent mark */
  mark?: LogoMark;
  /** Soft white wash on the top (e.g. footer on navy) */
  topWhiteFade?: boolean;
}

const SRC_W = 2914;
const SRC_H = 921;

export function Logo({
  invert = false,
  className,
  height = 28,
  priority = false,
  mark = 'color',
  topWhiteFade = false,
}: LogoProps) {
  const src = LOGO_MARK[mark];

  const image = (
    <Image
      src={src}
      alt="Nonno Blue"
      width={SRC_W}
      height={SRC_H}
      sizes={`${Math.ceil((height * SRC_W) / SRC_H)}px`}
      className={cn(
        'w-auto object-contain object-left',
        invert && 'brightness-0 invert',
        !topWhiteFade && className,
      )}
      style={{ height }}
      priority={priority}
    />
  );

  if (topWhiteFade) {
    return (
      <span className={cn('relative inline-block leading-none', className)}>
        {image}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.14) 24%, transparent 52%)',
          }}
        />
      </span>
    );
  }

  return image;
}
