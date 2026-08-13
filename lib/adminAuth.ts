import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';

const ADMIN_ROLES = ['admin', 'manager'];

// Oturumdaki kullanıcının admin/manager olduğunu doğrular; değilse null döner.
export async function requireAdmin() {
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
