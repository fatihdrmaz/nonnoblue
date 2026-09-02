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
    .select('id,code,status,start_date,end_date,deposit_amount,total_amount,notes,boats(name)')
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

    // Ödeme onay e-postaları (başarısız olsa da ödeme akışını bozmaz)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        const from = process.env.RESEND_FROM ?? 'NonnoBlue <ahoy@nonnoblue.com>';
        const guestEmail = (booking.notes ?? '').split(' | ')
          .find((p: string) => p.startsWith('E-posta: '))?.slice('E-posta: '.length).trim();
        const boatName = (booking.boats as { name?: string } | null)?.name ?? '';
        const currencySymbol = params['txncurrencycode'] === '978' ? '€' : '₺';
        const chargedAmount = params['txnamount'] ? `${currencySymbol}${(parseInt(params['txnamount']) / 100).toLocaleString('tr-TR')}` : `€${booking.deposit_amount.toLocaleString('tr-TR')}`;
        const summary = `<p><strong>Kod:</strong> ${booking.code}<br/><strong>Tekne:</strong> ${boatName}<br/><strong>Tarih:</strong> ${booking.start_date} → ${booking.end_date}<br/><strong>Tahsil edilen ön ödeme:</strong> ${chargedAmount}<br/><strong>Kalan bakiye:</strong> €${(booking.total_amount - booking.deposit_amount).toLocaleString('tr-TR')} (teslimden 30 gün önce)</p>`;
        const sends = [];
        if (guestEmail && guestEmail.includes('@')) {
          sends.push(resend.emails.send({
            from, to: guestEmail,
            subject: `Ödemeniz Alındı — Rezervasyon Onaylandı (${booking.code})`,
            html: `<p>Merhaba,</p><p>Ödemeniz başarıyla alındı ve rezervasyonunuz <strong>onaylandı</strong>.</p>${summary}<p>Sorularınız için ahoy@nonnoblue.com</p>`,
          }));
        }
        sends.push(resend.emails.send({
          from, to: ['fdurmaz@gmail.com', 'timo.tumer@nonnoblue.com'],
          subject: `💰 Ödeme Alındı: ${booking.code}`,
          html: `<p>Yeni ödeme alındı, rezervasyon onaylandı.</p>${summary}<p><a href="${siteUrl}/admin/rezervasyonlar">Admin panelde görüntüle</a></p>`,
        }));
        await Promise.allSettled(sends);
      } catch {
        // e-posta hatası ödemeyi etkilemez
      }
    }

    return NextResponse.redirect(`${siteUrl}/rezervasyon?payment=success&code=${encodeURIComponent(booking.code)}`, 303);
  }

  await admin.from('bookings').update({
    status: 'pending', // tekrar denenebilsin
    iyzico_response: safeResponse,
  }).eq('id', booking.id);

  // Yurt içi kart ile yabancı para denemesi — müşteriyi TL seçimine yönlendir
  if ((params['errmsg'] ?? '').includes('YP islem') ||
      (procCode === '13' && params['txncurrencycode'] === '978')) {
    return fail('domestic_fx');
  }
  // 3D geçti ama banka provizyonu reddettiyse mderrormessage 3D sonucunu ("Success")
  // gösterir ve yanıltır — bu durumda banka red kodunu ilet
  if (mdStatusOk(mdStatus) && procCode && procCode !== '00') {
    return fail(`bank:${procCode}`);
  }
  return fail(params['mderrormessage'] ?? params['errmsg'] ?? 'declined');
}
