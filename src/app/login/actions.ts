'use server'

import { createAuthServerClient } from '@/lib/supabase-server-auth'
import { redirect } from 'next/navigation'

export async function login(_prevState: { error?: string } | null, formData: FormData) {
  const supabase = await createAuthServerClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Invalid email or password.' }
  }

  const role = data.user?.user_metadata?.role
  if (role === 'admin') {
    redirect('/admin/seo-pages')
  } else {
    redirect('/writer')
  }
}

export async function logout() {
  const supabase = await createAuthServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}
