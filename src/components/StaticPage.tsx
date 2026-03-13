import PublicLayout from '@/components/PublicLayout'

interface StaticPageProps {
  title: string
  children: React.ReactNode
}

export default function StaticPage({ title, children }: StaticPageProps) {
  return (
    <PublicLayout extraCss={['/css/legal.css']}>
      <div className="legal-page">
        <div className="legal-container">
          <h1>{title}</h1>
          {children}
        </div>
      </div>
    </PublicLayout>
  )
}
