import PublicLayout from '@/components/PublicLayout'
import HomeContent from '@/components/HomeContent'

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
