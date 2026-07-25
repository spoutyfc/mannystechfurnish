import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS project_intakes (
      id text PRIMARY KEY,
      plan_type varchar(50),
      full_name text NOT NULL,
      email text NOT NULL,
      phone text,
      company text,
      website text,
      project_type text,
      industry text,
      goals text,
      features text,
      design_style text,
      budget text,
      timeline text,
      details text,
      referral text,
      country text,
      locale text,
      payment_status varchar(50) DEFAULT 'pending',
      amount integer,
      currency varchar(10),
      stripe_session_id text,
      stripe_customer_id text,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    );
  `)
  const r = await pool.query(
    "SELECT column_name FROM information_schema.columns WHERE table_name='project_intakes' ORDER BY ordinal_position",
  )
  console.log('[v0] project_intakes ready. columns:', r.rows.map((x) => x.column_name).join(', '))
} catch (e) {
  console.error('[v0] ERROR:', e.message)
  process.exit(1)
} finally {
  await pool.end()
}
