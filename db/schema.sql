CREATE TABLE IF NOT EXISTS entities (
  ticker      TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  exchange    TEXT,
  status      TEXT NOT NULL,
  price       NUMERIC,
  change_pct  TEXT,
  pe_ttm      NUMERIC,
  pct         NUMERIC,
  upper_bound NUMERIC,
  lower_bound NUMERIC,
  thesis      TEXT,
  peers       TEXT[] NOT NULL DEFAULT '{}',
  catalysts   TEXT[] NOT NULL DEFAULT '{}',
  risks       TEXT[] NOT NULL DEFAULT '{}',
  metrics     TEXT[] NOT NULL DEFAULT '{}',
  levels      TEXT[] NOT NULL DEFAULT '{}',
  links       TEXT[] NOT NULL DEFAULT '{}',
  updated_at  DATE
);

CREATE TABLE IF NOT EXISTS reviews (
  date                  DATE PRIMARY KEY,
  weekday               TEXT,
  title                 TEXT NOT NULL,
  summary               TEXT,
  highlights            TEXT[] NOT NULL DEFAULT '{}',
  tickers               TEXT[] NOT NULL DEFAULT '{}',
  tags                  TEXT[] NOT NULL DEFAULT '{}',
  action_type           TEXT NOT NULL DEFAULT 'none',
  action_desc           TEXT,
  position_change       TEXT,
  mood                  TEXT,
  verification_expected TEXT,
  verification_actual   TEXT,
  verification_verdict  TEXT NOT NULL DEFAULT 'pending',
  tomorrow_focus        TEXT[] NOT NULL DEFAULT '{}',
  body_notes            TEXT,
  body_tomorrow         TEXT
);

CREATE INDEX IF NOT EXISTS idx_reviews_date ON reviews (date DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_tickers ON reviews USING GIN (tickers);

-- Additive migrations for already-existing tables
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS body_notes TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS body_tomorrow TEXT;
ALTER TABLE entities ADD COLUMN IF NOT EXISTS peers TEXT[] NOT NULL DEFAULT '{}';
