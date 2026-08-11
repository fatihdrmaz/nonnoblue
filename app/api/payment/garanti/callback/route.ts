import { NextResponse } from 'next/server';
import { adminClient } from '@/lib/supabase/admin';
import { garantiConfig, verifyCallbackHash, mdStatusOk } from '@/lib/garanti';

// Banka 3D doğrulama sonrası sonucu bu adrese form POST eder (success ve error aynı adres).
export async function POST(request: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.nonnoblue.com';
  const cfg = garantiConfig();

  const form = await request.formData();
  const params: Record<string, string> = {};
  form.forEach((v, k) => { params[k.toLowerCase()] = String(v); });

  const orderId = params['orderid'] ?? params['oid'] ?? '';

  const fail = (reason: string) =>
    NextResponse.redirect(`${siteUrl}/rezervasyon?payment=fail&reason=${encodeURIComponent(reason)}`, 303);

  if (!cfg || !orderId) return fail('config');

  const admin = adminClient();
  const { data: booking } = await admin
    .from('bookings')
    .select('id,code,status')
    .eq('iyzico_conversation_id', orderId)
    .single();
  if (!booking) return fail('order');

  // Hash doğrulaması — sahte callback'leri reddet
  if (!verifyCallbackHash(cfg, params)) {
    await admin.from('bookings').update({
      iyzico_response: { error: 'hash_mismatch', mdstatus: params['mdstatus'] ?? null },
    }).eq('id', booking.id);
    return fail('hash');
  }

  const mdStatus = params['mdstatus'];
  const procCode = params['procreturncode'];
  const success = mdStatusOk(mdStatus) && procCode === '00';

  // Yanıtın güvenli alt kümesini sakla (kart verisi yok)
  const safeKeys = ['mdstatus', 'procreturncode', 'response', 'authcode', 'hostrefnum', 'retrefnum',
    'transid', 'oid', 'orderid', 'txnamount', 'txncurrencycode', 'mderrormessage', 'errmsg', 'txntimestamp'];
  const safeResponse: Record<string, string> = {};
  for (const k of safeKeys) if (params[k] !== undefined) safeResponse[k] = params[k];

  if (success) {
    await admin.from('bookings').update({
      status: 'confirmed',
      iyzico_payment_id: params['retrefnum'] ?? params['hostrefnum'] ?? params['authcode'] ?? null,
      iyzico_response: safeResponse,
    }).eq('id', booking.id);
    return NextResponse.redirect(`${siteUrl}/rezervasyon?payment=success&code=${encodeURIComponent(booking.code)}`, 303);
  }

  await admin.from('bookings').update({
    status: 'pending', // tekrar denenebilsin
    iyzico_response: safeResponse,
  }).eq('id', booking.id);
  return fail(params['mderrormessage'] ?? params['errmsg'] ?? 'declined');
}
