import { Suspense } from 'react'
import type { Metadata } from 'next'
import QuoteFlowNew from './QuoteFlowNew'

export const metadata: Metadata = {
  title: 'Get Your Quote | PolicyScanner',
  description: 'Compare life insurance quotes from top Canadian insurers. Get instant rates for term life, whole life, mortgage, and critical illness insurance.',
}

export default function QuoteFlowPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="text-slate-400 text-sm font-medium">Loading...</div>
      </div>
    }>
      <QuoteFlowNew />
    </Suspense>
  )
}
