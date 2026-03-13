import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
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
