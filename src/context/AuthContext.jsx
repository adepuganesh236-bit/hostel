import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react'
import { supabase, isSupabaseConfigured, getSupabaseError } from '../lib/supabase'
import { api, isApiConfigured, setApiToken, getApiToken } from '../lib/api'
import { HOSTEL } from '../config'

const AuthContext = createContext(null)

const DEMO_SESSION_KEY = 'staynest_demo_session'
const DEMO_USERS_KEY = 'staynest_demo_users'

function readDemoUsers() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_USERS_KEY)) || {}
  } catch {
    return {}
  }
}

function saveDemoUser(email, data) {
  const users = readDemoUsers()
  users[email.toLowerCase()] = data
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users))
}

async function hashPassword(password) {
  const data = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// The demo student is the first student from the demo dataset.
const DEMO_STUDENT = { id: 'STU-1000', role: 'student' }
const DEMO_OWNER = { id: 'OWN-0001', role: 'owner' }
const DEMO_ADMIN = { id: 'ADM-0001', role: 'admin' }

function readDemoSession() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_SESSION_KEY))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const demoSession = readDemoSession()

  const loadProfile = useCallback(async (userId) => {
    if (!isSupabaseConfigured || !supabase) return null
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return error ? null : data
  }, [])

  useEffect(() => {
    let active = true

    async function init() {
      setLoading(true)
      if (isApiConfigured) {
        const token = getApiToken()
        if (token) {
          try {
            const { user } = await api.me()
            if (active && user) {
              setSession({ user: { id: user.id, role: user.role } })
              setProfile(user)
            }
          } catch {
            setApiToken(null)
          }
        }
        if (active) setLoading(false)
        return
      }

      if (!isSupabaseConfigured || !supabase) {
        const s = readDemoSession()
        if (s && active) {
          setSession({ user: { id: s.id }, role: s.role })
          setProfile({ id: s.id, full_name: s.name, role: s.role, ...s })
        }
        setLoading(false)
        return
      }

      const { data } = await supabase.auth.getSession()
      if (active) {
        if (data.session) {
          setSession(data.session)
          const p = await loadProfile(data.session.user.id)
          setProfile(p)
        } else {
          const s = readDemoSession()
          if (s) {
            setSession({ user: { id: s.id }, role: s.role })
            setProfile({ id: s.id, full_name: s.name, role: s.role, ...s })
          }
        }
      }

      const { data: listener } = supabase.auth.onAuthStateChange(
        async (_event, newSession) => {
          if (!active) return
          if (newSession) {
            setSession(newSession)
            const p = await loadProfile(newSession.user.id)
            setProfile(p)
          } else {
            setSession(null)
            setProfile(null)
          }
        },
      )
      setLoading(false)
      return () => {
        active = false
        listener?.subscription.unsubscribe()
      }
    }

    init()
  }, [loadProfile])

  const persistDemo = (sessionObj) => {
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(sessionObj))
  }

  // -------------------------------------------------------------------------
  // SIGN UPS / SIGN INS
  // -------------------------------------------------------------------------
  const signUp = useCallback(
    async (fields) => {
      if (isApiConfigured) {
        const data = await api.register({
          email: fields.email,
          password: fields.password,
          fullName: fields.fullName,
          mobile: fields.mobile,
          college: fields.college,
          course: fields.course,
          year: fields.year,
          gender: fields.gender,
          budget: fields.budget,
          preferredRoom: fields.preferredRoom,
        })
        return data
      }

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: fields.email,
          password: fields.password,
          options: {
            data: {
              full_name: fields.fullName,
              mobile: fields.mobile,
              college: fields.college,
              course: fields.course,
              year: fields.year,
              gender: fields.gender,
              budget: fields.budget,
              preferred_room: fields.preferredRoom,
              role: 'student',
            },
            emailRedirectTo: `${window.location.origin}/login`,
          },
        })
        if (error) throw new Error(getSupabaseError(error))
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: fields.fullName,
            mobile: fields.mobile,
            email: fields.email,
            college: fields.college,
            course: fields.course,
            year: fields.year,
            gender: fields.gender,
            budget: fields.budget,
            preferred_room: fields.preferredRoom,
            role: 'student',
            verified: false,
          })
        }
        return { message: 'signup', user: data.user }
      }

      // DEMO MODE registration (clearly labelled local account)
      const email = (fields.email || `${fields.fullName.replace(/\s+/g, '.').toLowerCase()}@demo.student`).toLowerCase()
      if (readDemoUsers()[email]) {
        throw new Error('An account with this email already exists. Please log in instead.')
      }
      const sessionObj = {
        id: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
        role: 'student',
        name: fields.fullName,
        mobile: fields.mobile,
        email,
        college: fields.college,
        course: fields.course,
        year: fields.year,
        gender: fields.gender,
        budget: fields.budget,
        preferredRoom: fields.preferredRoom,
        verified: false,
        demo: true,
      }
      saveDemoUser(email, { email, passwordHash: await hashPassword(fields.password), profile: sessionObj })
      // Do NOT auto-login - the spec requires email verification first.
      return { message: 'signup', user: { id: sessionObj.id, email } }
    },
    [],
  )

  const signInWithEmail = useCallback(
    async ({ email, password }) => {
      if (isApiConfigured) {
        const { token, user } = await api.login({ email, password })
        setApiToken(token)
        setSession({ user: { id: user.id, role: user.role } })
        setProfile(user)
        return { user, profile: user }
      }

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw new Error(getSupabaseError(error))
        const p = await loadProfile(data.user.id)
        setProfile(p)
        setSession(data.session)
        return { user: data.user, profile: p }
      }

      // DEMO MODE: simulate a student login using demo credentials.
      const demo = { email: 'student@demo.app', password: 'demo123' }
      const emailKey = email.trim().toLowerCase()
      if (emailKey === demo.email && password === demo.password) {
        const s = { ...DEMO_STUDENT, name: 'Demo Student', email, demo: true }
        persistDemo(s)
        setProfile({ ...s })
        setSession({ user: { id: DEMO_STUDENT.id } })
        return { user: { id: DEMO_STUDENT.id }, profile: s }
      }

      // DEMO MODE: allow login with an account registered on this device.
      const account = readDemoUsers()[emailKey]
      if (account && account.profile && (await hashPassword(password)) === account.passwordHash) {
        const s = { ...account.profile }
        persistDemo(s)
        setProfile({ ...s })
        setSession({ user: { id: s.id } })
        return { user: { id: s.id }, profile: s }
      }
      throw new Error(
        'Invalid credentials. Try the demo login (shown on the page) or register an account.',
      )
    },
    [loadProfile],
  )

  const sendEmailOtp = useCallback(async (email) => {
    if (isApiConfigured) {
      throw new Error('Email OTP is not supported with the MySQL backend. Log in with email & password instead.')
    }
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) throw new Error(getSupabaseError(error))
      return true
    }
    // Demo mode: email OTP requires Supabase. Never fake an OTP.
    throw new Error('Email OTP requires Supabase to be configured.')
  }, [])

  const sendPhoneOtp = useCallback(async (phone) => {
    if (isApiConfigured) {
      throw new Error('SMS OTP is not supported with the MySQL backend. Log in with email & password instead.')
    }
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone.startsWith('+') ? phone : `+91${phone}`,
        options: { channel: 'sms' },
      })
      if (error) throw new Error(getSupabaseError(error))
      return true
    }
    throw new Error('SMS OTP requires Supabase (SMS provider) to be configured.')
  }, [])

  const verifyOtp = useCallback(
    async ({ email, phone, token, isMobile }) => {
      if (isApiConfigured) {
        throw new Error('OTP login is not supported with the MySQL backend. Log in with email & password instead.')
      }
      if (isSupabaseConfigured && supabase) {
        const params = isMobile
          ? {
              phone: phone.startsWith('+') ? phone : `+91${phone}`,
              token,
              type: 'sms',
            }
          : { email, token, type: 'email' }
        const { data, error } = await supabase.auth.verifyOtp(params)
        if (error) throw new Error(getSupabaseError(error))
        const p = await loadProfile(data.user.id)
        setProfile(p)
        setSession(data.session)
        return { user: data.user, profile: p }
      }
      throw new Error('OTP verification requires Supabase to be configured.')
    },
    [loadProfile],
  )

  const resendVerification = useCallback(async (email) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: `${window.location.origin}/login` },
      })
      if (error) throw new Error(getSupabaseError(error))
    }
    return true
  }, [])

  // -------------------------------------------------------------------------
  // DEMO ROLE LOGINS (used when Supabase is not configured)
  // -------------------------------------------------------------------------
  const loginAsDemoStudent = useCallback(async () => {
    if (isApiConfigured) {
      const { token, user } = await api.login({ email: 'student@demo.app', password: 'demo123' })
      setApiToken(token)
      setSession({ user: { id: user.id, role: user.role } })
      setProfile(user)
      return { user, profile: user }
    }
    const s = { ...DEMO_STUDENT, name: 'Demo Student', email: 'student@demo.app', demo: true }
    persistDemo(s)
    setProfile({ ...s })
    setSession({ user: { id: DEMO_STUDENT.id } })
    return { user: { id: DEMO_STUDENT.id }, profile: s }
  }, [])

  const demoLogin = useCallback(async ({ role, mobile, email }) => {
    if (isApiConfigured) {
      if (role === 'admin' || role === 'owner') {
        const creds = role === 'owner' ? { mobile } : { email }
        const { token, user } = await api.login(creds)
        if (user.role !== role) {
          throw new Error(`This account is not linked to the hostel ${role}.`)
        }
        setApiToken(token)
        setSession({ user: { id: user.id, role: user.role } })
        setProfile(user)
        return { user, profile: user }
      }
      return loginAsDemoStudent()
    }
    if (role === 'owner') {
      if (mobile !== HOSTEL.ownerMobile) {
        throw new Error('This mobile number is not linked to the hostel owner.')
      }
      const s = { ...DEMO_OWNER, name: 'Hostel Owner', mobile, demo: true }
      persistDemo(s)
      setProfile({ ...s })
      setSession({ user: { id: DEMO_OWNER.id } })
      return { user: { id: DEMO_OWNER.id }, profile: s }
    }
    if (role === 'admin') {
      if (email && HOSTEL.adminEmail && email !== HOSTEL.adminEmail) {
        throw new Error('This email is not linked to the hostel admin.')
      }
      const s = { ...DEMO_ADMIN, name: 'Hostel Admin', email, demo: true }
      persistDemo(s)
      setProfile({ ...s })
      setSession({ user: { id: DEMO_ADMIN.id } })
      return { user: { id: DEMO_ADMIN.id }, profile: s }
    }
    return loginAsDemoStudent()
  }, [loginAsDemoStudent])

  // -------------------------------------------------------------------------
  const logout = useCallback(async () => {
    if (isApiConfigured) {
      try { await api.logout() } catch {}
      setApiToken(null)
    }
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut()
    }
    localStorage.removeItem(DEMO_SESSION_KEY)
    setSession(null)
    setProfile(null)
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      role: profile?.role ?? session?.role ?? null,
      isDemo: isApiConfigured || isSupabaseConfigured ? false : profile?.demo ?? Boolean(demoSession),
      loading,
      isApiConfigured,
      isSupabaseConfigured,
      signUp,
      signInWithEmail,
      sendEmailOtp,
      sendPhoneOtp,
      verifyOtp,
      resendVerification,
      demoLogin,
      loginAsDemoStudent,
      logout,
      updateProfile: (p) => setProfile(p),
    }),
    [
      session, profile, loading, signUp, signInWithEmail, sendEmailOtp,
      sendPhoneOtp, verifyOtp, resendVerification, demoLogin,
      loginAsDemoStudent, logout, demoSession,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}