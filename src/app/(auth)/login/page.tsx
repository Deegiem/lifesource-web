"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { AUTH_ROUTES } from "@/features/auth/constants";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="min-h-screen bg-(--color-surface-card)">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-6 sm:px-8 sm:py-8">
        <button
          type="button"
          onClick={() => router.push(AUTH_ROUTES.ENTRY)}
          aria-label="Go back"
          className="flex size-10 items-center justify-center rounded-xl text-(--color-text-secondary) hover:bg-(--color-surface-subtle)"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex-1 pt-8 sm:pt-12">
          <h1 className="text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl">
            Welcome back
          </h1>
          <p className="mt-1 text-base text-(--color-text-secondary)">
            Log in to your LIFESOURCE account.
          </p>

          <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <Field
              id="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
            />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-(--color-text-primary)"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => router.push(AUTH_ROUTES.FORGOT_PASSWORD)}
                  className="text-sm font-semibold text-(--color-brand-primary) hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-(--control-height-lg) w-full rounded-lg border border-(--color-border-default) px-4 pr-12 text-sm text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary-soft)"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-(--color-text-muted)"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!email || !password}
              className="h-(--control-height-lg) w-full rounded-lg bg-(--color-brand-primary) text-sm font-semibold text-(--color-text-inverse) hover:bg-(--color-brand-primary-hover) disabled:cursor-not-allowed disabled:opacity-50"
            >
              Log in
            </button>
          </form>
        </div>

        <footer className="pt-8 text-center">
          <button
            type="button"
            onClick={() => router.push(AUTH_ROUTES.DONOR_WELCOME)}
            className="text-sm text-(--color-text-secondary)"
          >
            New donor?{" "}
            <span className="font-semibold text-(--color-brand-primary)">
              Sign up here
            </span>
          </button>
        </footer>
      </div>
    </main>
  );
}

function Field({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-(--color-text-primary)"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={id}
        className="h-(--control-height-lg) w-full rounded-lg border border-(--color-border-default) px-4 text-sm text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary-soft)"
        required
      />
    </div>
  );
}
