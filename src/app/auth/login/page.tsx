"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  MessageSquareText,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store";

const DEMO_EMAIL = "priya@example.com";
const DEMO_PASSWORD = "demo1234";
const DEMO_PHONE = "+91 98765 43210";

function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5">
      <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30">
        <Sparkles className="size-6" aria-hidden="true" />
      </span>
      <span className="text-2xl font-bold tracking-tight text-foreground">
        Ticket<span className="text-primary">SwapX</span>
      </span>
    </Link>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const loginWithOTP = useAuthStore((s) => s.loginWithOTP);

  const [mode, setMode] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string; otp?: string }>({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(4).fill(""));
  const [otpLoading, setOtpLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  function validatePasswordForm() {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Enter a valid email address";
    }
    if (!password) next.password = "Password is required";
    setErrors(next);
    setAuthError("");
    return Object.keys(next).length === 0;
  }

  function handlePasswordSubmit() {
    if (!validatePasswordForm()) return;
    setLoading(true);
    setTimeout(() => {
      const ok = login(email.trim(), password);
      setLoading(false);
      if (ok) {
        router.push("/dashboard");
      } else {
        setAuthError("Invalid email or password. Please try again.");
      }
    }, 900);
  }

  function handleGoogleLogin() {
    if (googleLoading) return;
    setGoogleLoading(true);
    setTimeout(() => {
      loginWithGoogle();
      router.push("/dashboard");
    }, 900);
  }

  function handleSendOTP() {
    if (!phone.trim()) {
      setErrors((e) => ({ ...e, otp: "Enter your registered phone number" }));
      return;
    }
    setErrors((e) => ({ ...e, otp: undefined }));
    setOtpLoading(true);
    setTimeout(() => {
      setOtpLoading(false);
      setOtpSent(true);
      setResendTimer(30);
      const interval = setInterval(() => {
        setResendTimer((t) => {
          if (t <= 1) {
            clearInterval(interval);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }, 900);
  }

  function handleOtpDigitChange(index: number, value: string) {
    const digits = value.replace(/\D/g, "");
    const next = [...otpDigits];
    const input = document.getElementById(`otp-${index}`) as HTMLInputElement | null;
    if (digits.length > 1) {
      const all = otpDigits.join("");
      const filled = all.slice(0, index) + digits + all.slice(index);
      for (let i = 0; i < 4; i++) next[i] = filled[i] ?? "";
    } else {
      next[index] = digits.slice(0, 1);
    }
    setOtpDigits(next);
    setErrors((e) => ({ ...e, otp: undefined }));
    if (next[index] && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    } else if (next[index] && index === 3) {
      input?.blur();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }

  function handleVerifyOTP() {
    const code = otpDigits.join("");
    if (code.length < 4) {
      setErrors((e) => ({ ...e, otp: "Enter the 4-digit code" }));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      loginWithOTP(phone);
      setLoading(false);
      router.push("/dashboard");
    }, 900);
  }

  function fillDemo() {
    if (mode === "password") {
      setEmail(DEMO_EMAIL);
      setPassword(DEMO_PASSWORD);
      setErrors({});
      setAuthError("");
    } else {
      setPhone(DEMO_PHONE);
      setOtpDigits(["1", "2", "3", "4"]);
      setErrors({});
    }
  }

  const otpInputs = Array.from({ length: 4 });

  return (
    <div className="relative flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/15 via-surface to-accent/15 px-4 py-12 sm:px-6">
      <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-accent/15 blur-3xl" aria-hidden="true" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <Card className="rounded-3xl border-border/60 bg-white/95 shadow-2xl shadow-primary/10 backdrop-blur">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6">
              <svg viewBox="0 0 12 12" className="mx-auto mb-4 size-8" aria-hidden="true">
                <path d="M3 1h6a1 1 0 0 1 1 1v9L7 9.5 5 11V2a1 1 0 0 1 1-1z" fill="currentColor" className="text-primary" />
                <path d="M5 4h2M5 5.5h2" stroke="currentColor" strokeWidth="0.8" className="text-primary" />
              </svg>
              <h1 className="text-center text-2xl font-bold tracking-tight text-foreground">
                Welcome back
              </h1>
              <p className="mt-1.5 text-center text-sm text-muted">
                Log in to buy, sell, and exchange tickets
              </p>
            </div>

            <button
              type="button"
              onClick={fillDemo}
              className="mb-6 flex w-full items-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-2.5 text-left text-xs text-primary transition-colors hover:bg-primary/10"
            >
              <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
              <span>
                Demo: Click any button to log in as <span className="font-semibold">Priya Sharma</span>
              </span>
            </button>

            <div className="mb-6 flex rounded-xl bg-muted/60 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("password");
                  setAuthError("");
                }}
                className={mode === "password"
                  ? "flex-1 rounded-lg bg-white py-2 text-sm font-semibold text-foreground shadow-sm"
                  : "flex-1 rounded-lg py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("otp");
                  setAuthError("");
                  setOtpSent(false);
                }}
                className={mode === "otp"
                  ? "flex-1 rounded-lg bg-white py-2 text-sm font-semibold text-foreground shadow-sm"
                  : "flex-1 rounded-lg py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"}
              >
                Phone OTP
              </button>
            </div>

            {authError ? (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm font-medium text-danger"
              >
                {authError}
              </div>
            ) : null}

            {mode === "password" ? (
              <div className="space-y-4">
                <Input
                  id="login-email"
                  type="email"
                  label="Email address"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  icon={<Mail className="size-4" aria-hidden="true" />}
                  autoComplete="email"
                />

                <div>
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    icon={<Lock className="size-4" aria-hidden="true" />}
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="text-muted transition-colors hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    }
                    autoComplete="current-password"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="size-3.5 rounded border-border accent-primary"
                      />
                      Remember me
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs font-medium text-primary transition-colors hover:text-primary-dark"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  loading={loading}
                  onClick={handlePasswordSubmit}
                >
                  Log In
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {!otpSent ? (
                  <>
                    <Input
                      id="login-phone"
                      type="tel"
                      label="Phone number"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      error={errors.otp}
                      icon={<Phone className="size-4" aria-hidden="true" />}
                      autoComplete="tel"
                    />
                    <Button
                      className="w-full"
                      size="lg"
                      loading={otpLoading}
                      onClick={handleSendOTP}
                      leftIcon={<MessageSquareText className="size-4" />}
                    >
                      Send OTP
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 rounded-xl bg-primary/5 px-4 py-3">
                      <KeyRound className="size-5 shrink-0 text-primary" aria-hidden="true" />
                      <div className="text-sm">
                        <p className="font-semibold text-foreground">OTP sent to {phone}</p>
                        <p className="text-xs text-muted">Enter the 4-digit code below</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between gap-2">
                        {otpInputs.map((_, index) => (
                          <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={4}
                            autoComplete="one-time-code"
                            value={otpDigits[index]}
                            onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className="h-14 w-full rounded-xl border border-border bg-white text-center text-xl font-bold text-foreground shadow-sm transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                            aria-label={`OTP digit ${index + 1}`}
                          />
                        ))}
                      </div>
                      {errors.otp && (
                        <p role="alert" className="mt-1.5 text-xs font-medium text-danger">
                          {errors.otp}
                        </p>
                      )}
                      <p className="mt-3 text-center text-xs text-muted">
                        Didn&apos;t receive it?{" "}
                        {resendTimer > 0 ? (
                          <span className="font-medium text-muted">Resend in {resendTimer}s</span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendOTP}
                            className="font-semibold text-primary transition-colors hover:text-primary-dark"
                          >
                            Resend OTP
                          </button>
                        )}
                      </p>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      loading={loading}
                      onClick={handleVerifyOTP}
                    >
                      Verify &amp; Log In
                    </Button>
                  </>
                )}
              </div>
            )}

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted">
                or continue with
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              loading={googleLoading}
              onClick={handleGoogleLogin}
            >
              <GoogleIcon />
              Continue with Google
            </Button>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            Sign up
          </Link>
        </p>

        <p className="mt-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}