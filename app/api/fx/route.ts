import { NextResponse } from 'next/server';

// TCMB günlük kur — EUR satış kuru. 1 saat cache'lenir.
export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch('https://www.tcmb.gov.tr/kurlar/today.xml', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`TCMB ${res.status}`);
    const xml = await res.text();
    const eurBlock = xml.split('CurrencyCode="EUR"')[1] ?? '';
    const match = eurBlock.match(/<ForexSelling>([\d.]+)<\/ForexSelling>/);
    const eurTry = match ? parseFloat(match[1]) : null;
    if (!eurTry) throw new Error('EUR rate not found');
    return NextResponse.json({ eurTry, source: 'TCMB', date: xml.match(/Tarih="([^"]+)"/)?.[1] ?? null });
  } catch {
    return NextResponse.json({ eurTry: null }, { status: 502 });
  }
}
