"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store";

const DEMO_NAME = "Priya Sharma";
const DEMO_EMAIL = "priya@example.com";
const DEMO_PASSWORD = "demo1234";

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

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function passwordStrength(pw: string) {
    let score = 0;
    if (pw.length >= 8) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;
    return score;
  }

  const strength = passwordStrength(password);
  const strengthLabels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-danger",
    "bg-danger",
    "bg-warning",
    "bg-primary",
    "bg-success",
  ];

  function validate() {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Full name is required";
    else if (name.trim().length < 2) next.name = "Name must be at least 2 characters";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "Enter a valid email address";
    if (!password) next.password = "Password is required";
    else if (password.length < 8)
      next.password = "Password must be at least 8 characters";
    if (!confirmPassword) next.confirmPassword = "Please confirm your password";
    else if (confirmPassword !== password)
      next.confirmPassword = "Passwords do not match";
    if (!terms) next.terms = "You must accept the Terms of Service";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      register(name.trim(), email.trim(), password);
      setLoading(false);
      router.push("/dashboard");
    }, 1000);
  }

  function handleGoogleSignup() {
    if (googleLoading) return;
    setGoogleLoading(true);
    setTimeout(() => {
      loginWithGoogle();
      router.push("/dashboard");
    }, 900);
  }

  function fillDemo() {
    setName(DEMO_NAME);
    setEmail(DEMO_EMAIL);
    setPhone("+91 98765 43210");
    setPassword(DEMO_PASSWORD);
    setConfirmPassword(DEMO_PASSWORD);
    setTerms(true);
    setErrors({});
  }

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
                Create your account
              </h1>
              <p className="mt-1.5 text-center text-sm text-muted">
                Join thousands of fans buying &amp; selling tickets
              </p>
            </div>

            <button
              type="button"
              onClick={fillDemo}
              className="mb-6 flex w-full items-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-2.5 text-left text-xs text-primary transition-colors hover:bg-primary/10"
            >
              <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
              <span>
                Demo: Prefill as <span className="font-semibold">Priya Sharma</span>
              </span>
            </button>

            <div className="space-y-4">
              <Input
                id="register-name"
                type="text"
                label="Full name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                icon={<UserIcon className="size-4" aria-hidden="true" />}
                autoComplete="name"
              />

              <Input
                id="register-email"
                type="email"
                label="Email address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                icon={<Mail className="size-4" aria-hidden="true" />}
                autoComplete="email"
              />

              <Input
                id="register-phone"
                type="tel"
                label="Phone number"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                helperText="Optional. Helps secure your account."
                icon={<Phone className="size-4" aria-hidden="true" />}
                autoComplete="tel"
              />

              <Input
                id="register-password"
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Minimum 8 characters"
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
                autoComplete="new-password"
              />

              {password.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-1 flex-1 rounded-full transition-colors",
                          i < strength ? strengthColors[strength] : "bg-border"
                        )}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs font-medium text-muted">
                    {strengthLabels[strength]}
                  </p>
                </div>
              )}

              <Input
                id="register-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                icon={<Lock className="size-4" aria-hidden="true" />}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    className="text-muted transition-colors hover:text-foreground"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                }
                autoComplete="new-password"
              />

              <div>
                <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-muted">
                  <input
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    className="mt-0.5 size-3.5 rounded border-border accent-primary"
                  />
                  <span>
                    I agree to the Terms of Service and Privacy Policy
                  </span>
                </label>
                {errors.terms && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-danger">
                    {errors.terms}
                  </p>
                )}
              </div>

              <Button
                className="w-full"
                size="lg"
                loading={loading}
                onClick={handleSubmit}
              >
                Create Account
              </Button>
            </div>

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
              onClick={handleGoogleSignup}
            >
              <GoogleIcon />
              Sign up with Google
            </Button>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            Log in
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