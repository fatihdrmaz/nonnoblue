import { NextResponse } from 'next/server';
import { adminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/adminAuth';
import { garantiConfig, sendVoidOrRefund } from '@/lib/garanti';

// Tahsil edilmiş ön ödemeyi iptal/iade eder.
// Önce void (aynı gün, komisyonsuz) denenir; banka reddederse refund'a düşülür.
export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 403 });

  const cfg = garantiConfig();
  const refundPassword = process.env.GARANTI_REFUND_PASSWORD;
  if (!cfg || !refundPassword) {
    return NextResponse.json({ error: 'not_configured', detail: 'GARANTI_REFUND_PASSWORD tanımlı değil' }, { status: 503 });
  }

  const { bookingId } = await request.json() as { bookingId?: string };
  if (!bookingId) return NextResponse.json({ error: 'bookingId required' }, { status: 400 });

  const admin = adminClient();
  const { data: booking } = await admin
    .from('bookings')
    .select('id,code,status,iyzico_conversation_id,iyzico_payment_id,iyzico_response')
    .eq('id', bookingId)
    .single();
  if (!booking) return NextResponse.json({ error: 'booking_not_found' }, { status: 404 });
  if (!['confirmed', 'balance_paid'].includes(booking.status)) {
    return NextResponse.json({ error: 'not_refundable', detail: `durum: ${booking.status}` }, { status: 409 });
  }

  const resp = (booking.iyzico_response ?? {}) as Record<string, string>;
  const orderId = booking.iyzico_conversation_id ?? resp['orderid'];
  const amountMinor = resp['txnamount'];
  const currencyCode = resp['txncurrencycode'] ?? '949';
  const retrefNum = booking.iyzico_payment_id ?? null;
  if (!orderId || !amountMinor) {
    return NextResponse.json({ error: 'missing_payment_data' }, { status: 400 });
  }

  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || '127.0.0.1';

  // 1) Aynı gün iptali dene
  let result = await sendVoidOrRefund(cfg, refundPassword, 'void', orderId, amountMinor, currencyCode, retrefNum, ip);
  let method: 'void' | 'refund' = 'void';

  // 2) Void reddedilirse (gün sonu geçmiş vb.) iade dene
  if (!result.ok) {
    const voidResult = result;
    result = await sendVoidOrRefund(cfg, refundPassword, 'refund', orderId, amountMinor, currencyCode, retrefNum, ip);
    method = 'refund';
    if (!result.ok) {
      return NextResponse.json({
        error: 'bank_declined',
        detail: `void: ${voidResult.code} ${voidResult.message} | refund: ${result.code} ${result.message}`,
      }, { status: 502 });
    }
  }

  await admin.from('bookings').update({
    status: 'refunded',
    iyzico_response: { ...resp, refund_method: method, refund_code: result.code, refund_at: new Date().toISOString() },
  }).eq('id', booking.id);

  return NextResponse.json({ ok: true, method, code: result.code });
}
