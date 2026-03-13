import type { Metadata } from 'next'
import PublicLayout from '@/components/PublicLayout'
import HomeContent from '@/components/HomeContent'

export const metadata: Metadata = {
  title: 'Compare Life Insurance Quotes in Canada | PolicyScanner',
  description: 'Compare life insurance quotes from 20+ top Canadian insurers instantly. Free, unbiased comparison of term life, whole life, mortgage & critical illness insurance.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Compare Life Insurance Quotes in Canada | PolicyScanner',
    description: 'Compare life insurance quotes from 20+ top Canadian insurers instantly. Free, unbiased comparison of term life, whole life, mortgage & critical illness insurance.',
    url: '/',
    images: [
      {
        url: 'https://res.cloudinary.com/dafclxaa8/image/upload/q_auto,f_auto,w_1200/v1746832704/life-insurance-comparison-canada-1440x650_xk60iq.webp',
        width: 1200,
        height: 630,
        alt: 'PolicyScanner - Compare Life Insurance Quotes in Canada',
      },
    ],
  },
}

export default function HomePage() {
  return (
    <PublicLayout
      extraCss={[
        '/css/home/hero.css',
        '/css/home/trust-bar.css',
        '/css/home/why-choose-us.css',
        '/css/home/how-it-works.css',
        '/css/home/reviews.css',
        '/css/home/partners.css',
        '/css/home/articles.css',
        '/css/home/faq.css',
      ]}
      extraJs={[
        '/js/home/faq.js',
        '/js/home/how-it-works.js',
        '/js/home/reviews.js',
        '/js/home/partners.js',
      ]}
    >
      <HomeContent />
    </PublicLayout>
  )
}
