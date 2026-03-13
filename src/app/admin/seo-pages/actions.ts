'use server'

import { createServerSupabase } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function assignPage(slug: string, writerId: string | null) {
  const sb = createServerSupabase()
  await sb
    .from('seo_pages')
    .update({ assigned_to: writerId || null, updated_at: new Date().toISOString() })
    .eq('slug', slug)
  revalidatePath('/admin/seo-pages')
}

export async function updatePageStatus(slug: string, status: string) {
  const sb = createServerSupabase()
  await sb
    .from('seo_pages')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('slug', slug)
  revalidatePath('/admin/seo-pages')
}

export async function saveAdminNotes(slug: string, notes: string) {
  const sb = createServerSupabase()
  await sb
    .from('seo_pages')
    .update({ admin_notes: notes, updated_at: new Date().toISOString() })
    .eq('slug', slug)
  revalidatePath('/admin/seo-pages')
}

export async function markSanityPushed(slug: string) {
  const sb = createServerSupabase()
  await sb
    .from('seo_pages')
    .update({ sanity_pushed: true, updated_at: new Date().toISOString() })
    .eq('slug', slug)
  revalidatePath('/admin/seo-pages')
}
