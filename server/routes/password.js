import { Router } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import pool from '../db.js'

const router = Router()

const sha256 = (value) =>
  crypto.createHash('sha256').update(String(value)).digest('hex')

const VALID_EMAIL = /^\S+@\S+\.\S+$/
const RESET_TOKEN_MINUTES = 10

// ---------------------------------------------------------------------------
// In-memory CAPTCHA challenges: { id -> { answer, attempts, expiresAt } }
// The answer is never sent to the client; only the human-readable question is.
// ---------------------------------------------------------------------------
const CAPTCHA_TTL_MS = 5 * 60 * 1000
const CAPTCHA_MAX_ATTEMPTS = 5
const captchaStore = new Map()

function cleanCaptchas() {
  const now = Date.now()
  for (const [id, challenge] of captchaStore) {
    if (challenge.expiresAt <= now) captchaStore.delete(id)
  }
}

function randomInt(max) {
  return crypto.randomInt(1, max + 1)
}

// Issues a fresh arithmetic CAPTCHA challenge.
router.post('/captcha', (_req, res) => {
  cleanCaptchas()
  const id = crypto.randomBytes(16).toString('hex')
  const a = randomInt(20)
  const b = randomInt(20)
  const op = crypto.randomInt(0, 2) === 0 ? '+' : '×'
  const answer = op === '+' ? a + b : a * b
  captchaStore.set(id, {
    answer: String(answer),
    attempts: 0,
    expiresAt: Date.now() + CAPTCHA_TTL_MS,
  })
  res.json({ captchaId: id, question: `${a} ${op} ${b} = ?` })
})

async function findProfile(identifier) {
  const value = String(identifier || '').trim()
  if (!value) return null
  if (value.includes('@')) {
    if (!VALID_EMAIL.test(value)) return null
    const normalized = value.toLowerCase()
    const [rows] = await pool.query('SELECT * FROM profiles WHERE LOWER(email) = ? LIMIT 1', [normalized])
    return rows[0] || null
  }
  const digits = value.replace(/\D/g, '')
  if (!digits || digits.length < 10 || digits.length > 15) return null
  const [rows] = await pool.query('SELECT * FROM profiles WHERE mobile = ? LIMIT 1', [digits])
  return rows[0] || null
}

function verifyCaptcha(captchaId, answer) {
  cleanCaptchas()
  const challenge = captchaStore.get(String(captchaId || ''))
  if (!challenge) {
    return { error: 'Your CAPTCHA has expired. Refresh and try again.' }
  }
  if (challenge.attempts >= CAPTCHA_MAX_ATTEMPTS) {
    captchaStore.delete(captchaId)
    return { error: 'Too many CAPTCHA attempts. Refresh and try again.' }
  }
  challenge.attempts += 1
  if (String(answer || '').trim() !== challenge.answer) {
    if (challenge.attempts >= CAPTCHA_MAX_ATTEMPTS) {
      captchaStore.delete(captchaId)
    }
    return { error: 'Incorrect CAPTCHA answer. Please try again.' }
  }
  captchaStore.delete(captchaId)
  return { ok: true }
}

// Verifies the CAPTCHA and, when an account exists, issues a short-lived
// reset token instead of an email/mobile OTP. The account is never revealed
// when the CAPTCHA fails, but it is when it succeeds (the user provided a real
// identifier that was checked server-side, so there is nothing to leak).
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { identifier, captchaId, captchaAnswer } = req.body || {}
    const verification = verifyCaptcha(captchaId, captchaAnswer)
    if (!verification.ok) {
      return res.status(400).json({ error: verification.error })
    }

    const profile = await findProfile(identifier)
    if (!profile || !profile.email) {
      return res.status(404).json({
        error: 'No account found with this email or mobile number.',
      })
    }

    // Invalidate any previously issued tokens for this account.
    await pool.query('UPDATE password_reset_codes SET used = 1 WHERE email = ?', [
      profile.email,
    ])

    const resetToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + RESET_TOKEN_MINUTES * 60 * 1000)
    await pool.query(
      `INSERT INTO password_reset_codes (email, code_hash, expires_at)
       VALUES (?, ?, ?)`,
      [profile.email, sha256(resetToken), expiresAt],
    )

    return res.json({
      ok: true,
      resetToken,
      role: profile.role,
      message: 'Identity verified. Set a new password.',
    })
  } catch (err) {
    return next(err)
  }
})

// Sets a new password using the issued reset token (no email/mobile OTP).
router.post('/reset-password', async (req, res, next) => {
  try {
    const resetToken = String(req.body?.resetToken || '').trim()
    const password = String(req.body?.password || '')
    const confirmPassword = String(req.body?.confirmPassword || '')

    if (!resetToken) {
      return res.status(400).json({ error: 'This password reset link is invalid or has expired.' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' })
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' })
    }

    const hash = sha256(resetToken)
    const [codes] = await pool.query(
      `SELECT id, email FROM password_reset_codes
        WHERE code_hash = ? AND used = 0 AND expires_at > NOW()
        ORDER BY id DESC
        LIMIT 1`,
      [hash],
    )
    const code = codes[0]
    if (!code || !code.email) {
      return res.status(400).json({
        error: 'This password reset link is invalid or has expired. Start over.',
      })
    }

    const [profiles] = await pool.query(
      'SELECT id FROM profiles WHERE LOWER(email) = ? LIMIT 1',
      [String(code.email).toLowerCase()],
    )
    if (!profiles.length) {
      return res.status(400).json({ error: 'No account found for this reset link.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    await pool.query('UPDATE profiles SET password_hash = ? WHERE id = ?', [
      passwordHash,
      profiles[0].id,
    ])
    // Invalidate the used token and every outstanding code + session for the account.
    await pool.query('UPDATE password_reset_codes SET used = 1 WHERE id = ?', [code.id])
    await pool.query('UPDATE password_reset_codes SET used = 1 WHERE email = ?', [code.email])
    await pool.query('DELETE FROM sessions WHERE profile_id = ?', [profiles[0].id])

    return res.json({
      ok: true,
      message: 'Your password has been reset. Please log in with your new password.',
    })
  } catch (err) {
    return next(err)
  }
})

export default router