import { redirect } from 'next/navigation'
import { BOOKING_URL } from '@/lib/constants'

export default function ScheduleACallPage() {
  redirect(BOOKING_URL)
}
