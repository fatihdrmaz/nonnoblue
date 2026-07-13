import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';

const BUCKET = 'boat-photos';
const ADMIN_ROLES = ['admin', 'manager'];

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = adminClient();
  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (!profile || !ADMIN_ROLES.includes(profile.role)) return null;
  return user;
}

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 403 });

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const boatId = formData.get('boatId') as string | null;
  const position = parseInt((formData.get('position') as string) ?? '0', 10);

  if (!file || !boatId) {
    return NextResponse.json({ error: 'file and boatId required' }, { status: 400 });
  }

  const ext = file.name.split('.').pop();
  const path = `${boatId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const admin = adminClient();
  const { error: uploadErr } = await admin.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type });
  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  const { data, error: dbErr } = await admin
    .from('boat_photos')
    .insert({ boat_id: boatId, storage_path: path, position })
    .select()
    .single();
  if (dbErr) {
    await admin.storage.from(BUCKET).remove([path]);
    return NextResponse.json({ error: dbErr.message }, { status: 500 });
  }

  return NextResponse.json({ photo: data });
}

export async function PATCH(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 403 });

  const { positions } = await request.json() as { positions: { id: string; position: number }[] };
  if (!Array.isArray(positions)) {
    return NextResponse.json({ error: 'positions array required' }, { status: 400 });
  }

  const admin = adminClient();
  for (const { id, position } of positions) {
    const { error } = await admin.from('boat_photos').update({ position }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 403 });

  const { photoId, storagePath } = await request.json();
  if (!photoId || !storagePath) {
    return NextResponse.json({ error: 'photoId and storagePath required' }, { status: 400 });
  }

  const admin = adminClient();
  await admin.storage.from(BUCKET).remove([storagePath]);
  const { error } = await admin.from('boat_photos').delete().eq('id', photoId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
