-- ══════════════════════════════════════════════════════════════
--  Supabase Migration: carriers table
--  Run in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS carriers (
  compulife_code  TEXT PRIMARY KEY,
  display_name    TEXT NOT NULL,
  wq_codes        TEXT[] NOT NULL DEFAULT '{}',
  brand_aliases   TEXT[] NOT NULL DEFAULT '{}',
  logo_url        TEXT NOT NULL,
  active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS (read-only for anon, full access for service_role)
ALTER TABLE carriers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "carriers_read_all" ON carriers
  FOR SELECT USING (true);

CREATE POLICY "carriers_service_write" ON carriers
  FOR ALL USING (auth.role() = 'service_role');

-- ── Seed Data ────────────────────────────────────────────────

INSERT INTO carriers (compulife_code, display_name, wq_codes, brand_aliases, logo_url) VALUES
  ('ASSU', 'Assumption Life',         ARRAY['ASM'],                ARRAY['assumption life','assumption mutual'],               'https://www.compulifeapi.com/images/logosapicanada/ASSU-medium.png'),
  ('BENE', 'Beneva',                  ARRAY['BEN','SSQ'],          ARRAY['beneva','ssq life','ssq'],                           'https://www.compulifeapi.com/images/logosapicanada/BENE-medium.png'),
  ('BLUE', 'Blue Cross',              ARRAY['BLC','BLU'],          ARRAY['blue cross'],                                       'https://www.compulifeapi.com/images/logosapicanada/BLUE-medium.png'),
  ('BMOL', 'BMO Life',                ARRAY['BMO'],                ARRAY['bmo life','bmo'],                                   'https://www.compulifeapi.com/images/logosapicanada/BMOL-medium.png'),
  ('CANA', 'Canada Life',             ARRAY['CLA','GWL','CAN'],    ARRAY['canada life','great-west life','great west life'],   'https://www.compulifeapi.com/images/logosapicanada/CANA-medium.png'),
  ('COOP', 'Co-operators',            ARRAY['COO','COP'],          ARRAY['co-operators','cooperators'],                       'https://www.compulifeapi.com/images/logosapicanada/COOP-medium.png'),
  ('DESJ', 'Desjardins',              ARRAY['DSJ','DFS'],          ARRAY['desjardins'],                                       'https://www.compulifeapi.com/images/logosapicanada/DESJ-medium.png'),
  ('EMPI', 'Empire Life',             ARRAY['EMP'],                ARRAY['empire life'],                                      'https://www.compulifeapi.com/images/logosapicanada/EMPI-medium.png'),
  ('EQUI', 'Equitable',               ARRAY['EQL','EQB'],          ARRAY['equitable'],                                        'https://www.compulifeapi.com/images/logosapicanada/EQUI-medium.png'),
  ('FORE', 'Foresters',               ARRAY['FOR','FLI'],          ARRAY['foresters'],                                        'https://www.compulifeapi.com/images/logosapicanada/FORE-medium.png'),
  ('FORP', 'Canada Protection Plan',  ARRAY['CPP','CPL'],          ARRAY['canada protection plan','cpp'],                     'https://www.compulifeapi.com/images/logosapicanada/FORP-medium.png'),
  ('HUMA', 'Humania',                 ARRAY['HUM'],                ARRAY['humania'],                                          'https://www.compulifeapi.com/images/logosapicanada/HUMA-medium.png'),
  ('INDU', 'iA Financial',            ARRAY['IAG','IAF','IAL'],    ARRAY['industrial alliance','ia financial','ia life'],      'https://www.compulifeapi.com/images/logosapicanada/INDU-medium.png'),
  ('MANU', 'Manulife',                ARRAY['MFC','MAN'],          ARRAY['manulife','manufacturers life'],                    'https://www.compulifeapi.com/images/logosapicanada/MANU-medium.png'),
  ('POLI', 'PolicyMe',                ARRAY['PLM','PME'],          ARRAY['policyme','canadian premier'],                      'https://www.compulifeapi.com/images/logosapicanada/POLI-medium.png'),
  ('PRIM', 'Primerica',               ARRAY['PRM'],                ARRAY['primerica'],                                        'https://www.compulifeapi.com/images/logosapicanada/PRIM-medium.png'),
  ('RBCL', 'RBC Insurance',           ARRAY['RBC'],                ARRAY['rbc life','rbc insurance'],                         'https://www.compulifeapi.com/images/logosapicanada/RBCL-medium.png'),
  ('SERE', 'Serenia Life',            ARRAY['SRN','FTL'],          ARRAY['serenia','faithlife'],                              'https://www.compulifeapi.com/images/logosapicanada/SERE-medium.png'),
  ('SHER', 'Sherbrooke Life',          ARRAY['SHR'],                ARRAY['sherbrooke'],                                       'https://www.compulifeapi.com/images/logosapicanada/SHER-medium.png'),
  ('SUNL', 'Sun Life',                ARRAY['SLF','SUN'],          ARRAY['sun life'],                                         'https://www.compulifeapi.com/images/logosapicanada/SUNL-medium.png'),
  ('TRAN', 'ivari',                   ARRAY['IVR','TRA'],          ARRAY['ivari','transamerica'],                             'https://www.compulifeapi.com/images/logosapicanada/TRAN-medium.png'),
  ('UVAS', 'UV Insurance',            ARRAY['UVA'],                ARRAY['uv insurance'],                                     'https://www.compulifeapi.com/images/logosapicanada/UVAS-medium.png'),
  ('WAWA', 'Wawanesa',                ARRAY['WAW'],                ARRAY['wawanesa'],                                         'https://www.compulifeapi.com/images/logosapicanada/WAWA-medium.png')
ON CONFLICT (compulife_code) DO UPDATE SET
  display_name  = EXCLUDED.display_name,
  wq_codes      = EXCLUDED.wq_codes,
  brand_aliases = EXCLUDED.brand_aliases,
  logo_url      = EXCLUDED.logo_url,
  updated_at    = NOW();
