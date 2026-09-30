import {
  createHmac,
  randomBytes,
  randomUUID,
  scrypt,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { env } from "@/lib/env";

const scryptAsync = promisify(scrypt);

export type AuthRole = "user" | "admin";
export type AuthProvider = "credentials" | "google" | "otp";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  verified: boolean;
  role: AuthRole;
  city: string | null;
}

export interface JwtClaims {
  sub: string;
  email: string;
  role: AuthRole;
  iat: number;
  exp: number;
  jti: string;
}

export interface Session {
  id: string;
  userId: string;
  provider: AuthProvider;
  issuedAt: number;
  expiresAt: number;
  userAgent: string | null;
  ipAddress: string | null;
  revoked: boolean;
}

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  state: string;
}

export interface OtpSession {
  id: string;
  phoneOrEmail: string;
  codeHash: string;
  expiresAt: number;
  verified: boolean;
  attempts: number;
}

export interface SessionContext {
  userAgent?: string;
  ipAddress?: string;
}

function b64url(input: Buffer | string): string {
  const buffer = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buffer.toString("base64url");
}

function parseExpiry(expiry: string): number {
  const match = /^(\d+)([smhd])$/.exec(expiry);
  if (!match) return 7 * 24 * 60 * 60;
  const value = Number.parseInt(match[1], 10);
  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };
  return value * (multipliers[match[2]] ?? 86400);
}

function sign(claims: Record<string, unknown>, secret: string): string {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = b64url(JSON.stringify(claims));
  const signature = createHmac("sha256", secret)
    .update(`${header}.${payload}`)
    .digest("base64url");
  return `${header}.${payload}.${signature}`;
}

export function generateToken(user: AuthUser): string {
  const now = Math.floor(Date.now() / 1000);
  const claims: JwtClaims = {
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: now,
    exp: now + parseExpiry(env.JWT_EXPIRY),
    jti: randomUUID(),
  };
  return sign(claims as unknown as Record<string, unknown>, env.JWT_SECRET);
}

export function verifyToken(token: string): JwtClaims {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Malformed token");
  const [header, payload, signature] = parts;
  const expected = createHmac("sha256", env.JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url");
  const actual = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actual.length !== expectedBuffer.length) throw new Error("Invalid token");
  if (!timingSafeEqual(actual, expectedBuffer)) throw new Error("Invalid token");
  const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as JwtClaims;
  const now = Math.floor(Date.now() / 1000);
  if (claims.exp && claims.exp < now) throw new Error("Token expired");
  return claims;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const key = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${key.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const key = (await scryptAsync(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hash, "hex");
  if (key.length !== expected.length) return false;
  return timingSafeEqual(key, expected);
}

export function createSession(
  userId: string,
  provider: AuthProvider,
  context: SessionContext = {},
): Session {
  const now = Date.now();
  return {
    id: randomUUID(),
    userId,
    provider,
    issuedAt: now,
    expiresAt: now + parseExpiry(env.JWT_EXPIRY) * 1000,
    userAgent: context.userAgent ?? null,
    ipAddress: context.ipAddress ?? null,
    revoked: false,
  };
}

export function revokeSession(session: Session): Session {
  return { ...session, revoked: true, expiresAt: Date.now() };
}

export function getOAuthConfig(): OAuthConfig {
  const clientId = env.GOOGLE_CLIENT_ID ?? "dev-google-client-id";
  const clientSecret = env.GOOGLE_CLIENT_SECRET ?? "dev-google-client-secret";
  return {
    clientId,
    clientSecret,
    redirectUri: `${env.API_BASE_URL}/api/auth/callback/google`,
    scopes: ["openid", "profile", "email"],
    state: randomUUID(),
  };
}

export async function createOtpSession(
  phoneOrEmail: string,
  code: string,
  ttlSeconds = 600,
): Promise<OtpSession> {
  return {
    id: randomUUID(),
    phoneOrEmail,
    codeHash: await hashPassword(code),
    expiresAt: Date.now() + ttlSeconds * 1000,
    verified: false,
    attempts: 0,
  };
}

export async function verifyOtpSession(
  session: OtpSession,
  code: string,
): Promise<boolean> {
  if (session.verified) return true;
  if (Date.now() > session.expiresAt) return false;
  if (session.attempts >= 5) return false;
  const valid = await verifyPassword(code, session.codeHash);
  return valid;
}

export function otpService(): { apiKey: string; enabled: boolean } {
  const apiKey = env.OTP_SERVICE_API_KEY;
  return { apiKey: apiKey ?? "dev-otp-api-key", enabled: apiKey !== null };
}