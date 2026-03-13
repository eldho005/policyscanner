import { Suspense } from 'react'
import type { Metadata } from 'next'
import QuoteResultsNew from './QuoteResultsNew'

export const metadata: Metadata = {
  title: 'Your Insurance Quotes | PolicyScanner',
  description: 'Compare your personalized insurance quotes from top Canadian insurers.',
}

export default function QuoteResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="text-slate-400 text-sm font-medium">Loading...</div>
      </div>
    }>
      <QuoteResultsNew />
    </Suspense>
  )
}
