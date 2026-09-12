import { Router } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import pool from '../db.js'

const router = Router()

function mapProfile(row) {
  return {
    id: row.id,
    name: row.full_name,
    full_name: row.full_name,
    firstName: (row.full_name || '').split(' ')[0],
    mobile: row.mobile,
    email: row.email,
    college: row.college,
    course: row.course,
    year: row.year,
    gender: row.gender,
    budget: row.budget,
    preferred_room: row.preferred_room,
    role: row.role,
    verified: Boolean(row.verified),
    joiningDate: row.joining_date,
    roomNumber: row.room_number,
    bed: row.bed_number,
  }
}

async function uniqueStudentId(conn) {
  for (let i = 0; i < 50; i++) {
    const id = `STU-${Math.floor(1000 + Math.random() * 9000)}`
    const [rows] = await conn.query('SELECT id FROM profiles WHERE id = ?', [id])
    if (!rows.length) return id
  }
  throw new Error('Could not allocate a unique student id')
}

function bearerToken(req) {
  return (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim()
}

router.post('/register', async (req, res, next) => {
  const { email, password, fullName, mobile, college, course, year, gender, budget, preferredRoom } = req.body || {}
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required.' })
  }
  if (!password || String(password).length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' })
  }
  const conn = await pool.getConnection()
  try {
    const norm = String(email).trim().toLowerCase()
    const [existing] = await conn.query('SELECT id FROM profiles WHERE email = ?', [norm])
    if (existing.length) {
      return res.status(409).json({ error: 'An account with this email already exists. Please log in instead.' })
    }
    const id = await uniqueStudentId(conn)
    const hash = await bcrypt.hash(String(password), 10)
    await conn.query(
      `INSERT INTO profiles
         (id, full_name, mobile, email, password_hash, college, course, year, gender, budget, preferred_room, role, verified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'student', 1)`,
      [id, fullName, mobile, norm, hash, college, course, year, gender, budget, preferredRoom],
    )
    res.status(201).json({ message: 'signup', user: { id, email: norm } })
  } catch (err) {
    next(err)
  } finally {
    conn.release()
  }
})

router.post('/login', async (req, res, next) => {
  const { email, password, mobile } = req.body || {}
  const conn = await pool.getConnection()
  try {
    let where
    let params
    if (mobile) {
      where = 'mobile = ?'
      params = [String(mobile)]
    } else if (email) {
      where = 'LOWER(email) = ?'
      params = [String(email).trim().toLowerCase()]
    } else {
      return res.status(400).json({ error: 'Email or mobile is required.' })
    }
    const [rows] = await conn.query(`SELECT * FROM profiles WHERE ${where} LIMIT 1`, params)
    const row = rows[0]
    if (!row) return res.status(401).json({ error: 'Invalid credentials.' })

    if (password) {
      if (!row.password_hash) {
        return res.status(401).json({ error: 'This account has no password set. Use the demo account instead.' })
      }
      const ok = await bcrypt.compare(String(password), row.password_hash)
      if (!ok) return res.status(401).json({ error: 'Invalid credentials.' })
    } else if (!mobile || row.role !== 'owner') {
      return res.status(401).json({ error: 'A password is required for this login.' })
    }

    const token = crypto.randomBytes(32).toString('hex')
    await conn.query('INSERT INTO sessions (token, profile_id) VALUES (?, ?)', [token, row.id])
    res.json({ token, user: mapProfile(row) })
  } catch (err) {
    next(err)
  } finally {
    conn.release()
  }
})

router.get('/me', async (req, res, next) => {
  const token = bearerToken(req)
  if (!token) return res.status(401).json({ error: 'Not authenticated.' })
  try {
    const [rows] = await pool.query(
      'SELECT p.* FROM sessions s JOIN profiles p ON p.id = s.profile_id WHERE s.token = ?',
      [token],
    )
    if (!rows.length) return res.status(401).json({ error: 'Session not found.' })
    res.json({ user: mapProfile(rows[0]) })
  } catch (err) {
    next(err)
  }
})

router.post('/logout', async (req, res, next) => {
  const token = bearerToken(req)
  if (token) {
    try {
      await pool.query('DELETE FROM sessions WHERE token = ?', [token])
    } catch (err) {
      return next(err)
    }
  }
  res.json({ ok: true })
})

export default router