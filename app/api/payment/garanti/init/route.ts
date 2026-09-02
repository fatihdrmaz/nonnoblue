import { NextResponse } from 'next/server';
import { adminClient } from '@/lib/supabase/admin';
import { garantiConfig, garantiGatewayUrl, make3DHash } from '@/lib/garanti';

// EUR→TRY: TCMB günlük satış kuru
async function fetchEurTry(): Promise<number | null> {
  try {
    const res = await fetch('https://www.tcmb.gov.tr/kurlar/today.xml', { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const xml = await res.text();
    const eurBlock = xml.split('CurrencyCode="EUR"')[1] ?? '';
    const match = eurBlock.match(/<ForexSelling>([\d.]+)<\/ForexSelling>/);
    return match ? parseFloat(match[1]) : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const cfg = garantiConfig();
  if (!cfg) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }

  const { code, email, currency, amount } = await request.json() as { code?: string; email?: string; currency?: string; amount?: string };
  if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 });

  const admin = adminClient();
  const { data: booking } = await admin
    .from('bookings')
    .select('id,code,deposit_amount,total_amount,status')
    .eq('code', code)
    .single();
  if (!booking) return NextResponse.json({ error: 'booking_not_found' }, { status: 404 });
  if (!['pending', 'awaiting_3ds'].includes(booking.status)) {
    return NextResponse.json({ error: 'already_paid' }, { status: 409 });
  }
  if (!booking.total_amount || booking.total_amount <= 0) {
    return NextResponse.json({ error: 'no_amount' }, { status: 400 });
  }

  // Ödeme tutarı: %50 ön ödeme (varsayılan) veya tamamı — booking'in
  // deposit/balance alanları seçime göre güncellenir
  const payFull = amount === 'full';
  const chargeBase = payFull ? booking.total_amount : Math.round(booking.total_amount / 2);

  // Tahsilat para birimi: müşteri ödeme ekranında seçer (banka kuralı gereği
  // yurt içi kartlar yalnızca TRY, yurt dışı kartlar EUR ödeyebilir).
  // EUR seçimi ancak GARANTI_CURRENCY=EUR (çoklu kur aktif) ise kabul edilir;
  // aksi halde ve TRY seçiminde TCMB satış kuruyla TL (949) çekilir.
  const chargeEur = currency === 'EUR' && process.env.GARANTI_CURRENCY === 'EUR';
  const rate = await fetchEurTry();

  let amountStr: string;
  let currencyCode: string;
  if (chargeEur) {
    amountStr = String(Math.round(chargeBase * 100)); // EUR cent
    currencyCode = '978';
  } else {
    if (!rate) return NextResponse.json({ error: 'fx_unavailable' }, { status: 502 });
    amountStr = String(Math.round(chargeBase * rate * 100)); // kuruş
    currencyCode = '949';
  }

  // Garanti orderid: alfanumerik — koddaki tireleri kaldır
  const orderId = booking.code.replace(/[^a-zA-Z0-9]/g, '');

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.nonnoblue.com';
  const successUrl = `${siteUrl}/api/payment/garanti/callback`;
  const errorUrl = successUrl;

  const txnType = 'sales';
  const installments = '';

  const hash = make3DHash(cfg, orderId, amountStr, currencyCode, successUrl, errorUrl, txnType, installments);

  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || '127.0.0.1';

  // Sözleşme onayı + 3DS bekleme durumu + seçilen ödeme planı
  await admin.from('bookings').update({
    status: 'awaiting_3ds',
    fx_rate: rate,
    iyzico_conversation_id: orderId,
    contract_accepted_at: new Date().toISOString(),
    ip_address: ip,
    deposit_amount: chargeBase,
    balance_amount: booking.total_amount - chargeBase,
  }).eq('id', booking.id);

  return NextResponse.json({
    gatewayUrl: garantiGatewayUrl(cfg.mode),
    fields: {
      mode: cfg.mode,
      apiversion: '512',
      secure3dsecuritylevel: '3D_PAY',
      terminalprovuserid: cfg.provUserId,
      terminaluserid: cfg.provUserId,
      terminalmerchantid: cfg.merchantId,
      terminalid: cfg.terminalId,
      orderid: orderId,
      customeremailaddress: email ?? '',
      customeripaddress: ip,
      txnamount: amountStr,
      txncurrencycode: currencyCode,
      txninstallmentcount: installments,
      txntype: txnType,
      successurl: successUrl,
      errorurl: errorUrl,
      secure3dhash: hash,
      lang: 'tr',
      motoind: 'N',
      refreshtime: '0',
    },
    chargedAmount: Number(amountStr) / 100,
    chargedCurrency: chargeEur ? 'EUR' : 'TRY',
    rate,
  });
}
