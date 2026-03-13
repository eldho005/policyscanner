import type { Metadata } from 'next'
import PublicLayout from '@/components/PublicLayout'

export const metadata: Metadata = {
  title: 'Data Deletion Instructions | PolicyScanner',
  description: 'Instructions for requesting data deletion from PolicyScanner.',
}

export default function DataDeletionPage() {
  return (
    <PublicLayout>
      <div style={{display: 'flex', justifyContent: 'center', padding: '40px 20px'}}>
        <div style={{flex: '0 0 100%', maxWidth: '800px', background: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}>
          <header style={{borderBottom: '1px solid #e5e7eb', paddingBottom: '24px', marginBottom: '32px'}}>
            <h1 style={{fontSize: '32px', fontWeight: 600, color: '#1f2937', marginBottom: '8px', margin: '0 0 8px 0'}}>Data Deletion Instructions</h1>
            <p style={{color: '#6b7280', fontSize: '16px', lineHeight: 1.6, margin: 0}}>
              Follow these steps to remove your data associated with our <strong>Lead flow</strong> app.
            </p>
          </header>
          <div style={{display: 'flex', gap: '24px', background: '#f9fafb', borderRadius: '12px', padding: '20px', marginBottom: '32px', flexWrap: 'wrap'}}>
            <div>
              <div style={{fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px'}}>Platform</div>
              <div style={{fontSize: '14px', fontWeight: 600, color: '#1f2937'}}>Meta / Facebook</div>
            </div>
            <div>
              <div style={{fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px'}}>App Name</div>
              <div style={{fontSize: '14px', fontWeight: 600, color: '#1f2937'}}>Lead flow</div>
            </div>
            <div>
              <div style={{fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px'}}>Compliance</div>
              <div style={{fontSize: '14px', fontWeight: 600, color: '#1f2937'}}>PIPEDA (Canada)</div>
            </div>
          </div>
          <article>
            <p style={{color: '#374151', lineHeight: 1.8, marginBottom: '32px'}}>
              We are committed to protecting your privacy and ensuring you have full control over your personal data. If you wish to delete the data we collected through our Facebook &quot;Lead flow&quot; app, please follow the steps below.
            </p>
            <section style={{marginBottom: '40px'}}>
              <h2 style={{fontSize: '20px', fontWeight: 600, color: '#1f2937', borderLeft: '4px solid #3b82f6', paddingLeft: '16px', marginBottom: '24px'}}>
                Step 1: Remove App Access via Facebook
              </h2>
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', background: '#f9fafb', borderRadius: '8px'}}>
                  <div style={{minWidth: '32px', height: '32px', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 700, fontSize: '14px'}}>1</div>
                  <div>Go to <strong>Facebook Settings</strong> → <strong>Security and Login</strong> → <strong>Apps and Websites</strong></div>
                </div>
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', background: '#f9fafb', borderRadius: '8px'}}>
                  <div style={{minWidth: '32px', height: '32px', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 700, fontSize: '14px'}}>2</div>
                  <div>Find <strong>Lead flow</strong> in your list of connected apps</div>
                </div>
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', background: '#f9fafb', borderRadius: '8px'}}>
                  <div style={{minWidth: '32px', height: '32px', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 700, fontSize: '14px'}}>3</div>
                  <div>Click <strong>Remove</strong> and confirm deletion of associated data</div>
                </div>
              </div>
            </section>
            <section style={{marginBottom: '40px'}}>
              <h2 style={{fontSize: '20px', fontWeight: 600, color: '#1f2937', borderLeft: '4px solid #3b82f6', paddingLeft: '16px', marginBottom: '24px'}}>
                Step 2: Request Manual Data Deletion
              </h2>
              <div style={{background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '24px', textAlign: 'center'}}>
                <div style={{fontSize: '32px', marginBottom: '16px'}}>&#9993;</div>
                <p style={{color: '#1e40af', fontWeight: 600, marginBottom: '8px', margin: '0 0 8px 0'}}>Email us directly to request complete data deletion:</p>
                <a href="mailto:eldho@policyscanner.ca?subject=Data%20Deletion%20Request" style={{color: '#2563eb', fontWeight: 700, fontSize: '18px', textDecoration: 'none'}}>
                  eldho@policyscanner.ca
                </a>
                <p style={{color: '#6b7280', fontSize: '14px', marginTop: '12px', margin: '12px 0 0 0'}}>
                  Subject line: &quot;Data Deletion Request&quot; — We will respond within 30 business days.
                </p>
              </div>
            </section>
          </article>
          <footer style={{borderTop: '1px solid #e5e7eb', paddingTop: '24px', marginTop: '16px', textAlign: 'center', color: '#6b7280', fontSize: '14px'}}>
            <p style={{margin: '0 0 8px 0'}}>Insurance with Eldho &copy; 2025. All Rights Reserved.</p>
            <p style={{margin: 0}}>Last updated on December 22, 2025.</p>
          </footer>
        </div>
      </div>
    </PublicLayout>
  )
}
