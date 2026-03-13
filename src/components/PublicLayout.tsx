import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Script from 'next/script'

export default function PublicLayout({
  children,
  extraCss,
  extraJs,
}: {
  children: React.ReactNode
  extraCss?: string[]
  extraJs?: string[]
}) {
  return (
    <>
      {/* Global CSS — precedence required for React 18+ stylesheet hoisting */}
      <link rel="stylesheet" href="/css/global.css" precedence="default" />
      <link rel="stylesheet" href="/css/nav.css" precedence="default" />
      <link rel="stylesheet" href="/css/footer.css" precedence="default" />
      {extraCss?.map((href) => (
        <link key={href} rel="stylesheet" href={href} precedence="low" />
      ))}

      <Navbar />

      <main id="main-content">
        {children}
      </main>

      <Footer />

      <Script src="/js/nav.js" strategy="afterInteractive" />
      {extraJs?.map((src) => (
        <Script key={src} src={src} strategy="afterInteractive" />
      ))}
    </>
  )
}
