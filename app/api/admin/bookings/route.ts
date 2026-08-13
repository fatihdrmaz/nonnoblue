import { NextResponse } from 'next/server';
import { adminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/adminAuth';

const VALID_STATUSES = ['pending', 'awaiting_3ds', 'confirmed', 'balance_paid', 'completed', 'cancelled', 'refunded'];

// notes alanındaki "Ad Soyad: X | E-posta: Y | Telefon: Z | ..." kalıbını çözer
function parseGuestNotes(notes: string | null) {
  const out: { guest_name: string | null; guest_email: string | null; guest_phone: string | null } = {
    guest_name: null, guest_email: null, guest_phone: null,
  };
  if (!notes) return out;
  for (const part of notes.split(' | ')) {
    const [key, ...rest] = part.split(': ');
    const val = rest.join(': ').trim();
    if (key === 'Ad Soyad') out.guest_name = val;
    else if (key === 'E-posta') out.guest_email = val;
    else if (key === 'Telefon') out.guest_phone = val;
  }
  return out;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 403 });

  const admin = adminClient();
  const { data, error } = await admin
    .from('bookings')
    .select('id,code,status,start_date,end_date,guest_count,total_amount,deposit_amount,balance_amount,notes,created_at,boats(name)')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const bookings = (data ?? []).map((b) => ({ ...b, ...parseGuestNotes(b.notes) }));
  return NextResponse.json({ bookings });
}

export async function PATCH(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 403 });

  const { id, status } = await request.json() as { id?: string; status?: string };
  if (!id || !status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'id and valid status required' }, { status: 400 });
  }

  const admin = adminClient();
  const { error } = await admin.from('bookings').update({ status }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
