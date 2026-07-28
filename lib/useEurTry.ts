'use client';

import { useEffect, useState } from 'react';

// Module-level cache: tek sayfada kaç bileşen kullanırsa kullansın /api/fx bir kez çağrılır
let cachedRate: number | null = null;
let pending: Promise<number | null> | null = null;

async function fetchRate(): Promise<number | null> {
  if (cachedRate !== null) return cachedRate;
  if (!pending) {
    pending = fetch('/api/fx')
      .then(r => r.json())
      .then(d => {
        cachedRate = typeof d.eurTry === 'number' ? d.eurTry : null;
        return cachedRate;
      })
      .catch(() => null);
  }
  return pending;
}

export function useEurTry(): number | null {
  const [rate, setRate] = useState<number | null>(cachedRate);
  useEffect(() => {
    if (rate === null) fetchRate().then(r => { if (r !== null) setRate(r); });
  }, [rate]);
  return rate;
}

export function formatTry(eur: number, rate: number): string {
  return '₺' + Math.round(eur * rate).toLocaleString('tr-TR');
}
