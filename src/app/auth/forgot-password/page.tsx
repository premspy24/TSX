"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SuccessState } from "@/components/ui/success-state";

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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  function validate() {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address");
      return false;
    }
    setError("");
    return true;
  }

  function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSentEmail(email.trim());
      setSent(true);
    }, 1000);
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
            {!sent ? (
              <>
                <div className="mb-6">
                  <svg viewBox="0 0 12 12" className="mx-auto mb-4 size-8" aria-hidden="true">
                    <path d="M3 1h6a1 1 0 0 1 1 1v9L7 9.5 5 11V2a1 1 0 0 1 1-1z" fill="currentColor" className="text-primary" />
                    <path d="M5 4h2M5 5.5h2" stroke="currentColor" strokeWidth="0.8" className="text-primary" />
                  </svg>
                  <h1 className="text-center text-2xl font-bold tracking-tight text-foreground">
                    Reset your password
                  </h1>
                  <p className="mt-1.5 text-center text-sm text-muted">
                    Enter your email and we&apos;ll send you a link to reset your password
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    id="forgot-email"
                    type="email"
                    label="Email address"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={error}
                    icon={<Mail className="size-4" aria-hidden="true" />}
                    autoComplete="email"
                  />

                  <Button
                    className="w-full"
                    size="lg"
                    loading={loading}
                    onClick={handleSubmit}
                  >
                    Send Reset Link
                  </Button>
                </div>
              </>
            ) : (
              <SuccessState
                title="Check your email for the reset link"
                description={`We've sent a password reset link to ${sentEmail}. The link expires in 30 minutes.`}
              />
            )}
          </CardContent>
        </Card>

        {!sent && (
          <p className="mt-6 text-center text-sm text-muted">
            Remembered your password?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-primary transition-colors hover:text-primary-dark"
            >
              Back to login
            </Link>
          </p>
        )}

        {sent && (
          <p className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
            >
              <ArrowLeft className="size-4" />
              Back to login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}