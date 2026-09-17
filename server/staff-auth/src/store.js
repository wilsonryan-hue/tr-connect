import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const USERS_PATH = process.env.STAFF_AUTH_USERS || join(ROOT, 'users.json')

const SCRYPT_N = 16384
const SCRYPT_R = 8
const SCRYPT_P = 1
const KEYLEN = 64

/** @typedef {{ email: string, name: string, role: 'RYAN'|'OFFICE'|'WORKER', salt: string, hash: string }} UserRecord */
/** @typedef {{ users: UserRecord[] }} UserBook */

export function usersPath() {
  return USERS_PATH
}

/** @returns {UserBook} */
export function loadUsers() {
  if (!existsSync(USERS_PATH)) {
    return { users: [] }
  }
  try {
    const raw = JSON.parse(readFileSync(USERS_PATH, 'utf8'))
    const users = Array.isArray(raw?.users) ? raw.users : []
    return {
      users: users
        .filter((u) => u && typeof u.email === 'string' && u.salt && u.hash)
        .map((u) => ({
          email: String(u.email).trim().toLowerCase(),
          name: String(u.name ?? u.email),
          role: u.role === 'RYAN' || u.role === 'WORKER' ? u.role : 'OFFICE',
          salt: String(u.salt),
          hash: String(u.hash),
        })),
    }
  } catch {
    return { users: [] }
  }
}

/**
 * Hash a password with a new random salt (for offline prep / Ryan-run hash-password).
 * Does not write users.json.
 * @param {string} password
 */
export function hashPassword(password) {
  const salt = randomBytes(16).toString('base64url')
  const hash = scryptSync(password, salt, KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  }).toString('base64url')
  return { salt, hash, algo: 'scrypt', N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P, keylen: KEYLEN }
}

/**
 * @param {string} password
 * @param {UserRecord} user
 */
export function verifyPassword(password, user) {
  try {
    const derived = scryptSync(password, user.salt, KEYLEN, {
      N: SCRYPT_N,
      r: SCRYPT_R,
      p: SCRYPT_P,
    })
    const expected = Buffer.from(user.hash, 'base64url')
    if (derived.length !== expected.length) return false
    return timingSafeEqual(derived, expected)
  } catch {
    return false
  }
}

/** In-memory opaque sessions for prep. Production host should persist/rotate. */
const sessions = new Map()
/** Default 12h; override with SESSION_TTL_MS (milliseconds). */
const SESSION_TTL_MS = Number(process.env.SESSION_TTL_MS || 12 * 60 * 60 * 1000)

export function createSession(user) {
  const token = randomBytes(32).toString('base64url')
  sessions.set(token, {
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: Date.now(),
  })
  return token
}

export function getSession(token) {
  if (!token) return null
  const row = sessions.get(token)
  if (!row) return null
  if (SESSION_TTL_MS > 0 && Date.now() - row.createdAt > SESSION_TTL_MS) {
    sessions.delete(token)
    return null
  }
  return row
}

export function revokeSession(token) {
  if (token) sessions.delete(token)
}

/** Failed-attempt rate limit (email + IP keyed). */
const FAIL_WINDOW_MS = 15 * 60 * 1000
const FAIL_MAX = 8
/** @type {Map<string, { count: number, firstAt: number }>} */
const failures = new Map()

function failKey(email, ip) {
  return `${(email || '').toLowerCase()}|${ip || 'unknown'}`
}

/**
 * Snapshot for response headers / clients.
 * @returns {{ limit: number, remaining: number, resetAt: number, retryAfterSec: number, locked: boolean, count: number }}
 */
export function rateLimitStatus(email, ip) {
  const key = failKey(email, ip)
  const row = failures.get(key)
  const now = Date.now()
  if (!row || now - row.firstAt > FAIL_WINDOW_MS) {
    if (row) failures.delete(key)
    return {
      limit: FAIL_MAX,
      remaining: FAIL_MAX,
      resetAt: Math.ceil((now + FAIL_WINDOW_MS) / 1000),
      retryAfterSec: 0,
      locked: false,
      count: 0,
    }
  }
  const remaining = Math.max(0, FAIL_MAX - row.count)
  const resetAtMs = row.firstAt + FAIL_WINDOW_MS
  const retryAfterSec = Math.max(1, Math.ceil((resetAtMs - now) / 1000))
  return {
    limit: FAIL_MAX,
    remaining,
    resetAt: Math.ceil(resetAtMs / 1000),
    retryAfterSec,
    locked: row.count >= FAIL_MAX,
    count: row.count,
  }
}

export function isLocked(email, ip) {
  return rateLimitStatus(email, ip).locked
}

export function recordFailure(email, ip) {
  const key = failKey(email, ip)
  const now = Date.now()
  const row = failures.get(key)
  if (!row || now - row.firstAt > FAIL_WINDOW_MS) {
    failures.set(key, { count: 1, firstAt: now })
    return
  }
  row.count += 1
}

export function clearFailures(email, ip) {
  failures.delete(failKey(email, ip))
}

export const RATE = { FAIL_MAX, FAIL_WINDOW_MS }
