import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import pool from './db.js'
import dataRouter from './routes/data.js'
import authRouter from './routes/auth.js'
import passwordRouter from './routes/password.js'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT || 4000)

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: 'staynest', time: new Date().toISOString() })
})

app.use('/api/auth', authRouter)
app.use('/api/auth', passwordRouter)
app.use('/api', dataRouter)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

async function ensureProfileColumns() {
  const [cols] = await pool.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'profiles'`,
  )
  const existing = new Set(cols.map((c) => c.COLUMN_NAME))
  const additions = [
    ['mother_name', 'VARCHAR(120) DEFAULT NULL'],
    ['father_name', 'VARCHAR(120) DEFAULT NULL'],
    ['parent_phone', 'VARCHAR(20) DEFAULT NULL'],
    ['checkout_date', 'DATE DEFAULT NULL'],
  ]
  for (const [name, ddl] of additions) {
    if (!existing.has(name)) {
      await pool.query(`ALTER TABLE profiles ADD COLUMN ${name} ${ddl}`)
    }
  }
}

async function bootstrap() {
  await ensureProfileColumns()
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      token       VARCHAR(64) NOT NULL PRIMARY KEY,
      profile_id  VARCHAR(20) NOT NULL,
      created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_sessions_profile FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_reset_codes (
      id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      email       VARCHAR(255) NOT NULL,
      code_hash   CHAR(64)     NOT NULL,
      expires_at  DATETIME     NOT NULL,
      used        TINYINT(1)   NOT NULL DEFAULT 0,
      attempts    TINYINT(2)   NOT NULL DEFAULT 0,
      created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      KEY idx_reset_email (email),
      KEY idx_reset_expires (expires_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `)

  const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10)
  const demoHash = await bcrypt.hash('demo123', 10)

  await pool.query(
    `INSERT INTO profiles (id, full_name, mobile, email, password_hash, role, verified)
     VALUES ('STU-DEMO', 'Demo Student', '9876543210', 'student@demo.app', ?, 'student', 1)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), verified = 1`,
    [demoHash],
  )
  const [admin] = await pool.query(
    `SELECT password_hash FROM profiles WHERE email = ?`,
    [process.env.ADMIN_EMAIL || 'admin@staynest.in'],
  )
  if (admin[0] && !admin[0].password_hash) {
    await pool.query(
      `UPDATE profiles SET password_hash = ? WHERE email = ?`,
      [adminHash, process.env.ADMIN_EMAIL || 'admin@staynest.in'],
    )
  }

  app.listen(PORT, () => {
    console.log(`Sai Krishna API running on http://localhost:${PORT}`)
    console.log(`DB: ${process.env.DB_NAME || 'staynest'} @ ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`)
  })
}

bootstrap().catch((err) => {
  console.error('Failed to start Sai Krishna API')
  console.error(err)
  process.exit(1)
})