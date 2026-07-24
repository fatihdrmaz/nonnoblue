import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';

const SERVICE_TYPE_MAP: Record<string, string> = {
  'bareboat': 'bareboat',
  'skipperli': 'skippered',
  'tam-hizmet': 'crewed',
};

export async function POST(request: Request) {
  const body = await request.json();
  const {
    boatId, routeId, charterTipi, baslangicTarihi, bitisTarihi,
    kisiSayisi, istegeKaptan, adSoyad, eposta, telefon, ozelIstekler,
  } = body as Record<string, string | boolean | undefined>;

  if (!boatId || !baslangicTarihi || !bitisTarihi || !adSoyad || !eposta || !telefon) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  const admin = adminClient();

  // Resolve boat by uuid or slug
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(boatId));
  const { data: boat } = await admin
    .from('boats')
    .select('id,name')
    .eq(isUuid ? 'id' : 'slug', String(boatId))
    .single();
  if (!boat) {
    return NextResponse.json({ error: 'boat_not_found' }, { status: 404 });
  }

  // Weekly price for the start date
  const { data: priceRows } = await admin
    .from('boat_pricing')
    .select('weekly_price_eur')
    .eq('boat_id', boat.id)
    .lte('start_date', String(baslangicTarihi))
    .gte('end_date', String(baslangicTarihi))
    .limit(1);
  const weekly: number | null = priceRows?.[0]?.weekly_price_eur ?? null;

  const days = Math.max(1, Math.round(
    (new Date(String(bitisTarihi)).getTime() - new Date(String(baslangicTarihi)).getTime()) / 86400000
  ));
  const weeks = Math.max(1, Math.ceil(days / 7));
  const total = weekly !== null ? weekly * weeks : 0;
  const deposit = Math.round(total / 2);

  // Logged-in user (optional)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const code = `NB-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  // Guest/charter details live in notes until dedicated columns exist in the live schema
  const noteParts = [
    `Ad Soyad: ${adSoyad}`,
    `E-posta: ${eposta}`,
    `Telefon: ${telefon}`,
    `Charter: ${charterTipi ?? '-'}`,
    istegeKaptan ? 'Kaptan istendi: Evet' : null,
    routeId ? `Rota: ${routeId}` : null,
    ozelIstekler ? `Notlar: ${ozelIstekler}` : null,
  ].filter(Boolean);

  const { error } = await admin.from('bookings').insert({
    code,
    boat_id: boat.id,
    user_id: user?.id ?? null,
    start_date: baslangicTarihi,
    end_date: bitisTarihi,
    guest_count: parseInt(String(kisiSayisi)) || 1,
    service_type: SERVICE_TYPE_MAP[String(charterTipi)] ?? null,
    currency: 'EUR',
    total_amount: total,
    deposit_amount: deposit,
    balance_amount: total - deposit,
    status: 'pending',
    notes: noteParts.join(' | '),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    code,
    boatName: boat.name,
    quote: { weekly, weeks, total: weekly !== null ? total : null },
  });
}
