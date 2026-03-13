import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const redirectTo = searchParams.get('redirect') ?? '/'

  const draft = await draftMode()
  draft.disable()

  redirect(redirectTo)
}
