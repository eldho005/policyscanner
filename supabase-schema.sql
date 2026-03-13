-- =============================================================================
-- PolicyScanner — Supabase PostgreSQL Schema
-- Run this in the Supabase SQL Editor to create all tables and seed data.
-- =============================================================================

-- ─── Types ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS types (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name          text NOT NULL,
  slug          text NOT NULL,
  icon          text,
  description   text,
  reorder       integer,
  status        text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- ─── Companies ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS companies (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  company_name    text NOT NULL,
  display_name    text,
  company_code    text,          -- 4-8 char Compulife code (e.g. "AAAL")
  ci_company_code text,          -- MaxVisitors CI/UL code (e.g. "MANULIFE")
  started_year    text,
  headquarters    text,
  market_scope    text,
  am_best_rating  text,
  logo            text,
  status          text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- ─── Terms ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS terms (
  id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  type_id   bigint REFERENCES types(id) ON DELETE CASCADE,
  name      text NOT NULL,
  code      text NOT NULL,
  value     text,
  status    text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ─── User Quotations (contact info) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_quotations (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name            text NOT NULL,
  email           text NOT NULL,
  phone           text NOT NULL,
  wa_notification text DEFAULT '1',
  dob             date,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- ─── Quotation Forms (quote sessions) ───────────────────────────────────────
-- id starts from 10001 for display purposes
CREATE SEQUENCE IF NOT EXISTS quotation_forms_id_seq START WITH 10001;

CREATE TABLE IF NOT EXISTS quotation_forms (
  id                 bigint DEFAULT nextval('quotation_forms_id_seq') PRIMARY KEY,
  user_quotation_id  bigint REFERENCES user_quotations(id) ON DELETE SET NULL,
  session_id         text,
  type               text,             -- FK to types.id (stored as text for flexibility)
  coverage           text,
  data               jsonb,            -- { gender, tobacco, dobDay, dobMonth, dobYear, name, email, phoneNumber, ... }
  age                text,
  medication         text CHECK (medication IN ('Y', 'N')),
  dui                text CHECK (dui IN ('Y', 'N')),
  is_ontario         text CHECK (is_ontario IN ('0', '1')),
  created_at         timestamptz DEFAULT now(),
  updated_at         timestamptz DEFAULT now()
);

-- ─── Quotation Form Rates (selected rates) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS quotation_form_rates (
  id                 bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  quotation_form_id  bigint REFERENCES quotation_forms(id) ON DELETE CASCADE,
  company_name       text NOT NULL,
  tag                text,
  monthly_price      numeric(10,2) NOT NULL,
  yearly_price       numeric(10,2) NOT NULL,
  coverage           text NOT NULL,
  term               text NOT NULL,
  age_until          text NOT NULL,
  created_at         timestamptz DEFAULT now(),
  updated_at         timestamptz DEFAULT now()
);

-- ─── Insurance Riders ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS insurance_riders (
  id               bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "CompanyID"      text NOT NULL,          -- company identifier
  "PlanType"       text NOT NULL,          -- e.g. "Term Life", "Whole Life"
  "RiderType"      text NOT NULL CHECK ("RiderType" IN ('Free', 'Paid')),
  "RiderCategory"  text NOT NULL,
  "RiderName"      text NOT NULL,
  "Subtitle"       text,
  "ApproximateCost" text,
  "IconClass"      text,
  "Tag"            text,
  "Benefits"       text,
  "WhyItMatters"   text,
  "KeyFeatures"    text,
  "WhoCanGetIt"    text,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

-- ─── Contact Us ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_us (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       text,
  email      text,
  phone      text,
  subject    text,
  message    text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ─── Critical Illness Plans (reference data) ────────────────────────────────
CREATE TABLE IF NOT EXISTS critical_illness_plans (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  company_name    text NOT NULL,
  plan_name       text NOT NULL,
  term_type       text NOT NULL,
  coverage_type   text NOT NULL CHECK (coverage_type IN ('Basic', 'Enhanced')),
  illnesses_covered integer,
  illness_list    text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- ─── Testimonials (optional) ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  type_id     bigint REFERENCES types(id) ON DELETE CASCADE,
  name        text NOT NULL,
  slug        text NOT NULL,
  description text NOT NULL,
  status      text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_terms_type_id ON terms(type_id);
CREATE INDEX IF NOT EXISTS idx_terms_status ON terms(status);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_quotation_forms_user ON quotation_forms(user_quotation_id);
CREATE INDEX IF NOT EXISTS idx_quotation_forms_created ON quotation_forms(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotation_form_rates_form ON quotation_form_rates(quotation_form_id);
CREATE INDEX IF NOT EXISTS idx_user_quotations_email ON user_quotations(email);
CREATE INDEX IF NOT EXISTS idx_insurance_riders_company ON insurance_riders("CompanyID");


-- =============================================================================
-- SEED DATA
-- =============================================================================

-- ─── Types ───────────────────────────────────────────────────────────────────
INSERT INTO types (name, slug, icon, description, reorder, status) VALUES
  ('Term Life Insurance',       'term-life',           NULL, 'Affordable coverage for a set period (10-30 years). Ideal for protecting your family during key financial years.', 1, 'active'),
  ('Whole Life Insurance',      'whole-life',          NULL, 'Permanent coverage that lasts your entire life with a guaranteed cash value component.', 2, 'active'),
  ('Critical Illness Insurance','critical-illness',    NULL, 'Lump-sum payment if diagnosed with a covered critical illness like cancer, heart attack, or stroke.', 3, 'active'),
  ('Mortgage Insurance',        'mortgage-insurance',  NULL, 'Protects your mortgage balance so your family can keep their home if something happens to you.', 4, 'active'),
  ('Universal Life Insurance',  'universal-life',      NULL, 'Flexible permanent coverage with investment options and adjustable premiums.', 5, 'active');

-- ─── Terms (plan codes for Compulife NewCategory parameter) ──────────────────
-- Term Life (type_id = 1): Compulife uses numeric codes for term lengths
INSERT INTO terms (type_id, name, code, value, status) VALUES
  (1, '10 Year Term',  '3',  '10', 'active'),
  (1, '15 Year Term',  'H',  '15', 'active'),
  (1, '20 Year Term',  '4',  '20', 'active'),
  (1, '25 Year Term',  'I',  '25', 'active'),
  (1, '30 Year Term',  '5',  '30', 'active');

-- Whole Life (type_id = 2)
INSERT INTO terms (type_id, name, code, value, status) VALUES
  (2, 'Whole Life', 'C', 'WL', 'active');

-- Critical Illness (type_id = 3): MaxVisitors product indices
INSERT INTO terms (type_id, name, code, value, status) VALUES
  (3, '10 Year CI',  '0', '10', 'active'),
  (3, '15 Year CI',  '2', '15', 'active'),
  (3, '20 Year CI',  '3', '20', 'active'),
  (3, 'CI to 75',    '4', '75', 'active');

-- Mortgage Insurance (type_id = 4)
INSERT INTO terms (type_id, name, code, value, status) VALUES
  (4, '10 Year Mortgage', '3', '10', 'active'),
  (4, '15 Year Mortgage', 'H', '15', 'active'),
  (4, '20 Year Mortgage', '4', '20', 'active'),
  (4, '25 Year Mortgage', 'I', '25', 'active'),
  (4, '30 Year Mortgage', '5', '30', 'active');

-- Universal Life (type_id = 5): MaxVisitors product indices
INSERT INTO terms (type_id, name, code, value, status) VALUES
  (5, 'UL Regular',  '0', 'Regular', 'active'),
  (5, 'UL Elite',    '1', 'Elite',   'active');

-- ─── Companies ───────────────────────────────────────────────────────────────
-- company_code = Compulife 4-8 char code
-- ci_company_code = MaxVisitors / YourQuote CI company identifier
INSERT INTO companies (company_name, display_name, company_code, ci_company_code, started_year, headquarters, market_scope, am_best_rating, logo, status) VALUES
  ('Assumption Mutual Life Insurance Company',    'Assumption Life',     'ASSU', 'ASSUMPTI',  '1903', 'Moncton, NB',      'National',  NULL, 'assumption-mutual-life-insurance-company.webp', 'active'),
  ('Beneva',                                      'Beneva',              'BENE', 'BENEVA',    '2020', 'Quebec City, QC',   'National',  NULL, 'beneva-la-capitalessq-merger.webp', 'active'),
  ('BMO Life Assurance Company',                  'BMO Insurance',       'BMOL', 'BMOINSUR',  '1874', 'Toronto, ON',       'National',  NULL, 'bmo-life-assurance-company.webp', 'active'),
  ('The Canada Life Assurance Company',           'Canada Life',         'CANA', 'CANADALI',  '1847', 'Winnipeg, MB',      'National',  NULL, 'the-canada-life-assurance-company.webp', 'active'),
  ('Canada Protection Plan',                      'Canada Protection Plan', 'FORP', 'CPPUNDER','1860', 'Toronto, ON',      'National',  NULL, 'canada-protection-plan-foresters-life.webp', 'active'),
  ('Cooperators Life Insurance',                  'Cooperators',         'COOP', 'CO-OPERA',  '1945', 'Guelph, ON',        'National',  NULL, 'cooperators-life-insurance.webp', 'active'),
  ('Desjardins Financial Security',               'Desjardins',          'DESJ', 'DESJARDI',  '1900', 'Lévis, QC',         'National',  NULL, 'desjardins-financial-security.webp', 'active'),
  ('The Empire Life Insurance Company',           'Empire Life',         'EMPI', 'EMPIRELI',  '1923', 'Kingston, ON',      'National',  NULL, 'the-empire-life-insurance-company.webp', 'active'),
  ('Equitable Life Insurance Co. of Canada',      'Equitable Life',      'EQUI', 'EQUITABL',  '1920', 'Waterloo, ON',      'National',  NULL, 'equitable-life-insurance-co-of-canada.webp', 'active'),
  ('Foresters Life Insurance Company',            'Foresters',           'FORP', 'FORESTER',  '1874', 'Toronto, ON',       'National',  NULL, 'foresters-life-insurance-company.webp', 'active'),
  ('Humania Assurance Inc.',                      'Humania',             'HUMA', 'HUMANIAA',  '1874', 'Saint-Hyacinthe, QC','National', NULL, 'humania-assurance-inc.webp', 'active'),
  ('Industrial Alliance Life Insurance',          'iA Financial',        'INDU', 'IAFINANC',  '1892', 'Quebec City, QC',   'National',  NULL, 'industrial-alliance-life-insurance.webp', 'active'),
  ('Ivari',                                       'Ivari',               NULL,   'IVARI',     '2016', 'Toronto, ON',       'National',  NULL, 'ivari.webp', 'active'),
  ('The Manufacturers Life Insurance Company',    'Manulife',            NULL,   'MANULIFE',  '1887', 'Toronto, ON',       'National',  NULL, 'the-manufacturers-life-insurance-company.webp', 'active'),
  ('RBC Life Insurance Company',                  'RBC Insurance',       'RBCL', 'RBCINSUR',  '1871', 'Mississauga, ON',   'National',  NULL, 'rbc-life-insurance-company.webp', 'active'),
  ('Sun Life Assurance Company of Canada',        'Sun Life',            'SUNL', 'SUNLIFE',   '1865', 'Toronto, ON',       'National',  NULL, 'sun-life-assurance-company-of-canada.webp', 'active'),
  ('UV Insurance',                                'UV Insurance',        'UVAS', 'UVINSURA',  NULL,   NULL,                'Regional',  NULL, 'uv-insurance.webp', 'active');


-- =============================================================================
-- ROW LEVEL SECURITY (RLS) — Supabase best practice
-- =============================================================================

-- Public read for reference tables
ALTER TABLE types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "types_public_read" ON types FOR SELECT USING (true);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "companies_public_read" ON companies FOR SELECT USING (true);

ALTER TABLE terms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "terms_public_read" ON terms FOR SELECT USING (true);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "testimonials_public_read" ON testimonials FOR SELECT USING (true);

ALTER TABLE critical_illness_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ci_plans_public_read" ON critical_illness_plans FOR SELECT USING (true);

ALTER TABLE insurance_riders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "riders_public_read" ON insurance_riders FOR SELECT USING (true);

-- Write tables: allow inserts from anon (service role handles reads for admin)
ALTER TABLE user_quotations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_quotations_insert" ON user_quotations FOR INSERT WITH CHECK (true);
CREATE POLICY "user_quotations_select" ON user_quotations FOR SELECT USING (true);
CREATE POLICY "user_quotations_update" ON user_quotations FOR UPDATE USING (true);

ALTER TABLE quotation_forms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quotation_forms_insert" ON quotation_forms FOR INSERT WITH CHECK (true);
CREATE POLICY "quotation_forms_select" ON quotation_forms FOR SELECT USING (true);
CREATE POLICY "quotation_forms_update" ON quotation_forms FOR UPDATE USING (true);

ALTER TABLE quotation_form_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quotation_form_rates_insert" ON quotation_form_rates FOR INSERT WITH CHECK (true);
CREATE POLICY "quotation_form_rates_select" ON quotation_form_rates FOR SELECT USING (true);

ALTER TABLE contact_us ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact_us_insert" ON contact_us FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_us_select" ON contact_us FOR SELECT USING (true);
