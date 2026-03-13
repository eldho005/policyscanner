'use server'

import { createServerSupabase } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function createWriter(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!name || !email || !password) return { error: 'All fields are required.' }

  const sb = createServerSupabase()
  const { data, error } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'writer', name },
  })

  if (error) return { error: error.message }

  revalidatePath('/admin/writers')
  return { success: true, userId: data.user?.id }
}

export async function deleteWriter(userId: string) {
  const sb = createServerSupabase()
  const { error } = await sb.auth.admin.deleteUser(userId)
  if (error) return { error: error.message }
  revalidatePath('/admin/writers')
  return { success: true }
}
