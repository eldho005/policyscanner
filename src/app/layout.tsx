import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'PolicyScanner - Compare Life Insurance Quotes in Canada',
    template: '%s | PolicyScanner',
  },
  description: 'Compare life insurance quotes from top Canadian insurers. Get instant rates for term life, whole life, mortgage, and critical illness insurance.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: '/',
    siteName: 'PolicyScanner',
    title: 'PolicyScanner - Compare Life Insurance Quotes in Canada',
    description: 'Compare life insurance quotes from top Canadian insurers.',
    images: [{ url: 'https://res.cloudinary.com/dafclxaa8/image/upload/v1746833395/policyscanner-logo_wjm5hq.webp' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PolicyScanner - Compare Life Insurance Quotes',
    description: 'Compare life insurance quotes from top Canadian insurers.',
  },
  icons: {
    icon: '/assets/img/home-logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        {children}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'PolicyScanner',
              url: 'https://www.policyscanner.ca',
              logo: 'https://res.cloudinary.com/dafclxaa8/image/upload/v1746833395/policyscanner-logo_wjm5hq.webp',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+1-343-337-6542',
                contactType: 'customer service',
                areaServed: 'CA',
                availableLanguage: ['English', 'French'],
              },
              sameAs: [
                'https://www.facebook.com/policyscanner',
                'https://www.linkedin.com/company/policyscanner',
                'https://www.instagram.com/policyscanner',
              ],
            }),
          }}
        />
      </body>
    </html>
  )
}
