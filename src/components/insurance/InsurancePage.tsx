import {
  InsurancePageData,
  InsurancePageComponent,
  BulletItem,
  ContentBlock,
  TableBlock,
  FaqBlock,
  CalloutBlock,
  DefinitionBlock,
  ExampleCard,
  CtaBanner,
  HeroComponent,
  RateCalculator,
} from '@/types/insurance'

interface Props {
  page: InsurancePageData
}

const COVERAGE_OPTIONS: Record<string, string> = {
  '100000': '$100K',
  '250000': '$250K',
  '500000': '$500K',
  '750000': '$750K',
  '1000000': '$1,000,000',
  '1500000': '$1,500,000',
  '2000000': '$2,000,000',
}

// ── helpers ───────────────────────────────────────────────────────────────────

function BulletList({ items }: { items: BulletItem[] }) {
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>
          {item.bold && <strong>{item.bold} </strong>}
          {item.text}
        </li>
      ))}
    </ul>
  )
}

function OrderedList({ items }: { items: BulletItem[] }) {
  return (
    <ol>
      {items.map((item, i) => (
        <li key={i}>
          {item.bold && <strong>{item.bold} </strong>}
          {item.text}
        </li>
      ))}
    </ol>
  )
}

// ── component renderers ───────────────────────────────────────────────────────

function HeroSection({ data, page }: { data: HeroComponent; page: InsurancePageData }) {
  return (
    <div className="page-header">
      <p className="page-header__tag">{page.tag}</p>
      <h1 className="page-header__title">{data.title}</h1>
      <p className="page-header__desc">{data.description}</p>
      <div className="page-header__meta">
        {page.read_time && <span>{page.read_time}</span>}
        <span>{page.prepared_by}</span>
        <span>{page.reviewed_by}</span>
      </div>
    </div>
  )
}

const TRUST_ITEMS = [
  { stat: '20+', label: 'Insurers compared' },
  { stat: '60s', label: 'To get a quote' },
  { stat: '100%', label: 'No obligation' },
  { stat: 'LLQP', label: 'Licensed advisors' },
  { stat: '256-bit', label: 'SSL secured' },
]

function TrustBadges() {
  return (
    <div className="trust-bar">
      {TRUST_ITEMS.map((item, i) => (
        <div key={i} className="trust-bar__item">
          <span className="trust-bar__value">{item.stat}</span>
          <span className="trust-bar__label">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

function ContentBlockSection({ data }: { data: ContentBlock }) {
  const HeadingTag = data.heading_level === 3 ? 'h3' : 'h2'
  return (
    <section id={data.id || undefined}>
      <HeadingTag className="fluid-heading">{data.heading}</HeadingTag>
      {data.image && (
        <div className="content-block__image">
          <img src={data.image.src} alt={data.image.alt} loading="lazy" />
        </div>
      )}
      {data.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
      {data.bullets && <BulletList items={data.bullets} />}
      {data.ordered && <OrderedList items={data.ordered} />}
    </section>
  )
}

function DefinitionBlockSection({ data }: { data: DefinitionBlock }) {
  return (
    <div className="definition-block">
      <div className="definition-block__title"><strong>{data.term}</strong></div>
      <p className="definition-block__text">{data.definition}</p>
    </div>
  )
}

function CalloutSection({ data }: { data: CalloutBlock }) {
  const icons: Record<CalloutBlock['type'], string> = {
    insight: '💡',
    tip: '✅',
    warning: '⚠️',
    note: '📌',
  }
  const classes: Record<CalloutBlock['type'], string> = {
    insight: '',
    tip: 'callout-component--tip',
    warning: 'callout-component--warning',
    note: 'callout-component--tip',
  }
  return (
    <div className={`callout-component ${classes[data.type]}`}>
      <div className="callout-component__header">
        <div className="callout-component__icon">{icons[data.type]}</div>
        {data.title && <div className="callout-component__title">{data.title}</div>}
      </div>
      <div className="callout-component__body"><p>{data.text}</p></div>
    </div>
  )
}

function ExampleCardSection({ data }: { data: ExampleCard }) {
  return (
    <div className="example-card">
      <h4 className="example-card__title">{data.title}</h4>
      {data.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
    </div>
  )
}

function TableSection({ data }: { data: TableBlock }) {
  return (
    <section>
      {data.title && <h2 className="fluid-heading">{data.title}</h2>}
      <div className="table-container">
        <table className="table-component">
          <thead>
            <tr>
              {data.headers.map((h, i) => (
                <th key={i} className={i === 0 ? 'table-component__col--medium' : 'table-component__col--auto'}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.footnote && <p className="table-footnote">{data.footnote}</p>}
    </section>
  )
}

function FaqSection({ data }: { data: FaqBlock }) {
  if (!data.items.length) return null
  return (
    <section>
      <h2 className="fluid-heading">Frequently Asked Questions</h2>
      <div className="faq-component">
        {data.items.map((faq, idx) => (
          <div key={idx} className="faq-component__item">
            <button className="faq-component__question" aria-expanded="false">
              <span className="faq-component__question-text">{faq.question}</span>
              <span className="faq-component__icon"></span>
            </button>
            <div className="faq-component__answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function CtaBannerSection({ data }: { data: CtaBanner }) {
  return (
    <div className="cta-banner">
      <h3 className="cta-banner__title">{data.heading}</h3>
      {data.body && <p className="cta-banner__desc">{data.body}</p>}
      <div className="cta-banner__actions">
        <a href={data.url} className="cta-banner__button">{data.button_text}</a>
      </div>
    </div>
  )
}

function RateCalculatorSection({ data }: { data: RateCalculator }) {
  return (
    <section id="calculate-rates">
      <h2 className="fluid-heading">{data.title ?? 'What will life insurance cost you?'}</h2>
      <div className="calculator-container">
        <div className="calculator-component">
          <div className="calc-header">
            <h3 className="calc-title">Let&apos;s find your perfect monthly rate</h3>
            <p className="calc-subtitle">Compare 20+ Canadian insurers side by side</p>
          </div>
          <form className="calc-form" method="get" action="/compare-insurance-quotes" id="calcForm">
            <div className="calc-section">
              <h4 className="calc-section-title">Personal information</h4>
              <div className="calc-row">
                <div className="calc-field">
                  <label className="calc-label">Age</label>
                  <input type="number" defaultValue={35} name="age" className="coverage-calculator-component__input" id="calc-age" />
                </div>
                <div className="calc-field">
                  <label className="calc-label">Gender</label>
                  <div className="calc-toggle-group">
                    <div className="calc-toggle">
                      <input type="radio" name="gender" value="male" className="calc-toggle-input" id="calc-male" defaultChecked />
                      <label htmlFor="calc-male" className="calc-toggle-label">Male</label>
                    </div>
                    <div className="calc-toggle">
                      <input type="radio" name="gender" value="female" className="calc-toggle-input" id="calc-female" />
                      <label htmlFor="calc-female" className="calc-toggle-label">Female</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="calc-row">
                <div className="calc-field">
                  <label className="calc-label">Coverage amount</label>
                  <select className="calc-select" id="calc-coverage" name="coverage" defaultValue="500000">
                    {Object.entries(COVERAGE_OPTIONS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="calc-field">
                  <label className="calc-label">Smoking status</label>
                  <div className="calc-toggle-group">
                    <div className="calc-toggle">
                      <input type="radio" name="smoking" value="no" className="calc-toggle-input" id="calc-nonsmoker" defaultChecked />
                      <label htmlFor="calc-nonsmoker" className="calc-toggle-label">Non-smoker</label>
                    </div>
                    <div className="calc-toggle">
                      <input type="radio" name="smoking" value="yes" className="calc-toggle-input" id="calc-smoker" />
                      <label htmlFor="calc-smoker" className="calc-toggle-label">Smoker</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button type="submit" className="cta-button">
                Compare My Rates
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

// ── dispatch ──────────────────────────────────────────────────────────────────

function renderComponent(data: InsurancePageComponent, page: InsurancePageData, key: number) {
  switch (data.component) {
    case 'hero_section':    return <HeroSection key={key} data={data} page={page} />
    case 'trust_badges':    return <TrustBadges key={key} />
    case 'content_block':   return <ContentBlockSection key={key} data={data} />
    case 'definition_block':return <DefinitionBlockSection key={key} data={data} />
    case 'callout':         return <CalloutSection key={key} data={data} />
    case 'example_card':    return <ExampleCardSection key={key} data={data} />
    case 'table':           return <TableSection key={key} data={data} />
    case 'faq':             return <FaqSection key={key} data={data} />
    case 'cta_banner':      return <CtaBannerSection key={key} data={data} />
    case 'rate_calculator': return <RateCalculatorSection key={key} data={data} />
    default:                return null
  }
}

// ── main layout ───────────────────────────────────────────────────────────────

const TOP_COMPONENTS: InsurancePageComponent['component'][] = ['hero_section', 'trust_badges']

export default function InsurancePage({ page }: Props) {
  const topComponents = page.page_data.filter((d) => TOP_COMPONENTS.includes(d.component))
  const mainComponents = page.page_data.filter((d) => !TOP_COMPONENTS.includes(d.component))

  return (
    <div className="page-container">
      {topComponents.map((d, i) => renderComponent(d, page, i))}

      <div className="main-layout">
        <div className="main-content">
          <article>
            {mainComponents.map((d, i) => renderComponent(d, page, i))}
          </article>
        </div>
      </div>
    </div>
  )
}
