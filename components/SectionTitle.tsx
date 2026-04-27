interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: 'left' | 'center';
}

export function SectionTitle({ eyebrow, title, sub, align = 'left' }: SectionTitleProps) {
  const centered = align === 'center';
  return (
    <div style={{
      marginBottom: 48,
      textAlign: centered ? 'center' : 'left',
      maxWidth: centered ? 640 : undefined,
      marginInline: centered ? 'auto' : undefined,
    }}>
      {eyebrow && (
        <div className="eyebrow" style={{ marginBottom: 14 }}>{eyebrow}</div>
      )}
      <h2 className="display" style={{ fontSize: 'clamp(32px,4vw,52px)', marginBottom: sub ? 16 : 0 }}>
        {title}
      </h2>
      {sub && (
        <p style={{ fontSize: 17, color: 'var(--muted)', lineHeight: 1.65 }}>{sub}</p>
      )}
    </div>
  );
}
