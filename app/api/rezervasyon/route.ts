import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM ?? 'NonnoBlue <ahoy@nonnoblue.com>'
const ADMIN_EMAILS = ['fdurmaz@gmail.com', 'timo.tumer@nonnoblue.com']

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ ok: true, note: 'RESEND_API_KEY not set, skipping email' })
  }

  const body = await request.json()
  const { code, adSoyad, eposta, tekneAdi, baslangicTarihi, bitisTarihi, charterTipi, kisiSayisi } = body

  const customerHtml = `<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.07);">
        <tr>
          <td style="background:#0a1f3d;padding:24px 40px;text-align:center;">
            <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">Nonno<span style="color:#38bdf8;">Blue</span></p>
            <p style="margin:4px 0 0;color:rgba(255,255,255,.5);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Tekne Kiralama</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px 28px;">
            <p style="margin:0 0 6px;font-size:20px;font-weight:700;color:#0f172a;">Rezervasyon Talebiniz Alındı!</p>
            <p style="margin:0 0 24px;font-size:14px;color:#475569;line-height:1.7;">Merhaba <strong>${adSoyad}</strong>, rezervasyon talebiniz başarıyla alındı. En geç 24 saat içinde size dönüş yapacağız.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;padding:16px;margin-bottom:24px;">
              <tr>
                <td style="padding:6px 16px;"><p style="margin:0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;">Rezervasyon Kodu</p><p style="margin:4px 0 0;font-weight:700;font-family:monospace;color:#0f172a;font-size:15px;">${code}</p></td>
                <td style="padding:6px 16px;"><p style="margin:0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;">Tekne</p><p style="margin:4px 0 0;font-weight:600;color:#0f172a;">${tekneAdi}</p></td>
              </tr>
              <tr>
                <td style="padding:6px 16px;"><p style="margin:0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;">Başlangıç</p><p style="margin:4px 0 0;color:#334155;">${baslangicTarihi}</p></td>
                <td style="padding:6px 16px;"><p style="margin:0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;">Bitiş</p><p style="margin:4px 0 0;color:#334155;">${bitisTarihi}</p></td>
              </tr>
              <tr>
                <td style="padding:6px 16px;"><p style="margin:0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;">Charter Tipi</p><p style="margin:4px 0 0;color:#334155;">${charterTipi}</p></td>
                <td style="padding:6px 16px;"><p style="margin:0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;">Kişi Sayısı</p><p style="margin:4px 0 0;color:#334155;">${kisiSayisi}</p></td>
              </tr>
            </table>
            <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;">Sorularınız için <a href="mailto:ahoy@nonnoblue.com" style="color:#0ea5e9;">ahoy@nonnoblue.com</a> adresine yazabilirsiniz.</p>
          </td>
        </tr>
        <tr><td style="padding:16px 40px 24px;text-align:center;border-top:1px solid #e2e8f0;"><p style="margin:0;font-size:11px;color:#94a3b8;">nonnoblue.com · D-Marin Göcek, Muğla</p></td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const adminHtml = `<p>Yeni rezervasyon talebi geldi.</p>
<ul>
  <li><strong>Kod:</strong> ${code}</li>
  <li><strong>Ad Soyad:</strong> ${adSoyad}</li>
  <li><strong>E-posta:</strong> ${eposta}</li>
  <li><strong>Tekne:</strong> ${tekneAdi}</li>
  <li><strong>Tarih:</strong> ${baslangicTarihi} → ${bitisTarihi}</li>
  <li><strong>Charter:</strong> ${charterTipi} · ${kisiSayisi} kişi</li>
</ul>
<p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/rezervasyonlar">Admin panelde görüntüle</a></p>`

  try {
    await Promise.all([
      resend.emails.send({
        from: FROM,
        to: eposta,
        subject: `Rezervasyon Talebiniz Alındı — ${code}`,
        html: customerHtml,
      }),
      resend.emails.send({
        from: FROM,
        to: ADMIN_EMAILS,
        subject: `Yeni Rezervasyon: ${code} — ${adSoyad}`,
        html: adminHtml,
      }),
    ])
  } catch (err) {
    console.error('Resend error:', err)
    return NextResponse.json({ ok: false, error: 'Email sending failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
