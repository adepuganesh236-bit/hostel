import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import pool from './db.js'
import dataRouter from './routes/data.js'
import authRouter from './routes/auth.js'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT || 4000)

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: 'staynest', time: new Date().toISOString() })
})

app.use('/api/auth', authRouter)
app.use('/api', dataRouter)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

async function bootstrap() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      token       VARCHAR(64) NOT NULL PRIMARY KEY,
      profile_id  VARCHAR(20) NOT NULL,
      created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_sessions_profile FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE
    ) ENGINE=InnoDB
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
    console.log(`StayNest API running on http://localhost:${PORT}`)
    console.log(`DB: ${process.env.DB_NAME || 'staynest'} @ ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`)
  })
}

bootstrap().catch((err) => {
  console.error('Failed to start StayNest API')
  console.error(err)
  process.exit(1)
})