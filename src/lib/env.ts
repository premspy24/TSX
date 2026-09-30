export type NodeEnv = "development" | "production" | "test";

export interface Env {
  NODE_ENV: NodeEnv;
  DATABASE_URL: string;
  DIRECT_URL: string | null;
  JWT_SECRET: string;
  JWT_EXPIRY: string;
  GOOGLE_CLIENT_ID: string | null;
  GOOGLE_CLIENT_SECRET: string | null;
  OTP_SERVICE_API_KEY: string | null;
  RAZORPAY_KEY_ID: string | null;
  RAZORPAY_KEY_SECRET: string | null;
  STRIPE_SECRET_KEY: string | null;
  STRIPE_PUBLISHABLE_KEY: string | null;
  SENDGRID_API_KEY: string | null;
  FCM_SERVER_KEY: string | null;
  EMAIL_FROM: string;
  AWS_S3_BUCKET: string;
  AWS_ACCESS_KEY: string | null;
  AWS_SECRET_KEY: string | null;
  AWS_REGION: string;
  PLATFORM_FEE_PERCENT: number;
  API_BASE_URL: string;
}

const HARD_REQUIRED = ["DATABASE_URL", "JWT_SECRET"] as const;

const PROVIDER_KEYS = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "STRIPE_SECRET_KEY",
  "SENDGRID_API_KEY",
  "FCM_SERVER_KEY",
  "AWS_ACCESS_KEY",
  "AWS_SECRET_KEY",
] as const;

function parseIntValue(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseNodeEnv(value: string | undefined): NodeEnv {
  if (value === "production" || value === "test") return value;
  return "development";
}

function loadEnv(): Env {
  const env: Env = {
    NODE_ENV: parseNodeEnv(process.env.NODE_ENV),
    DATABASE_URL:
      process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/ticketswapx",
    DIRECT_URL: process.env.DIRECT_URL ?? null,
    JWT_SECRET: process.env.JWT_SECRET ?? "dev-jwt-secret-change-me",
    JWT_EXPIRY: process.env.JWT_EXPIRY ?? "7d",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? null,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? null,
    OTP_SERVICE_API_KEY: process.env.OTP_SERVICE_API_KEY ?? null,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ?? null,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ?? null,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? null,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY ?? null,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ?? null,
    FCM_SERVER_KEY: process.env.FCM_SERVER_KEY ?? null,
    EMAIL_FROM: process.env.EMAIL_FROM ?? "no-reply@ticketswapx.com",
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET ?? "tsx-tickets-dev",
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY ?? null,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY ?? null,
    AWS_REGION: process.env.AWS_REGION ?? "ap-south-1",
    PLATFORM_FEE_PERCENT: parseIntValue(process.env.PLATFORM_FEE_PERCENT, 10),
    API_BASE_URL: process.env.API_BASE_URL ?? "http://localhost:3000",
  };

  if (env.NODE_ENV === "production") {
    const readAsRecord = env as unknown as Record<string, unknown>;
    const missing = HARD_REQUIRED.filter((key) => typeof readAsRecord[key] !== "string");
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }
    const unsetProviders = PROVIDER_KEYS.filter(
      (key) => typeof readAsRecord[key] !== "string",
    );
    if (unsetProviders.length > 0) {
      console.warn(
        `Third-party credentials not configured, using placeholders: ${unsetProviders.join(", ")}`,
      );
    }
  }

  return env;
}

export const env: Env = loadEnv();