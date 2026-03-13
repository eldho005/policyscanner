// Database types matching Supabase schema

export interface UserQuotation {
  id: number
  name: string
  email: string
  phone: string
  wa_notification: string
  dob: string
  created_at: string
  updated_at: string
}

export interface QuotationForm {
  id: number
  user_quotation_id: number
  type: number
  coverage: string
  age: number
  data: string // JSON string
  medication: string | null
  dui: string | null
  is_ontario: string
  created_at: string
  updated_at: string
  // Relations
  types?: InsuranceType
  user_quotation?: UserQuotation
  rate_quotations?: QuotationFormRate[]
}

export interface QuotationFormRate {
  id: number
  quotation_form_id: number
  company_name: string
  tag: string | null
  monthly_price: string
  yearly_price: string
  coverage: string
  term: string
  age_until: string | null
  created_at: string
  updated_at: string
  quotation_form?: QuotationForm
}

export interface InsuranceType {
  id: number
  name: string
  slug: string
  description: string | null
  status: string
  reorder: number
  created_at: string
  updated_at: string
}

export interface Term {
  id: number
  type_id: number
  name: string
  code: string
  status: string
  created_at: string
  updated_at: string
  type?: InsuranceType
}

export interface Company {
  id: number
  company_name: string
  display_name: string
  company_code: string | null
  logo: string | null
  status: string
  created_at: string
  updated_at: string
  insurance_riders?: InsuranceRider[]
}

export interface InsuranceRider {
  id: number
  company_id: number
  plan_type: string
  rider_type: string
  rider_name: string
  rider_description: string | null
  created_at: string
  updated_at: string
}

export interface ContactUs {
  id: number
  name: string
  email: string
  phone: string | null
  message: string
  created_at: string
  updated_at: string
}

// Quote form data JSON structure
export interface QuoteData {
  gender: string
  tobacco: string
  dobDay: string
  dobMonth: string
  dobYear: string
  name: string
  email: string
  countryCode?: string
  phoneNumber: string
  whatsappConsent?: string
}

// Compulife API response types
export interface CompulifeResult {
  Compulife_company: string
  Compulife_product: string
  Compulife_premiumM: string
  Compulife_premiumA: string
  Compulife_rating: string
  Compulife_category: string
  [key: string]: string
}

export interface CompulifeResponse {
  Compulife_ComparisonResults?: Array<{
    Compulife_Results: CompulifeResult[]
  }>
}
