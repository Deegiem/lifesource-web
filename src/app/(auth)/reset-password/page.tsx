"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { AUTH_ROUTES } from "@/features/auth/constants";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const requirements = [
    ["At least 8 characters", password.length >= 8],
    ["One uppercase letter", /[A-Z]/.test(password)],
    ["One number", /[0-9]/.test(password)],
  ] as const;

  const valid =
    code.length === 6 &&
    requirements.every(([, met]) => met) &&
    password === confirm;

  return (
    <main className="min-h-screen bg-(--color-surface-card)">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-6 sm:px-8 sm:py-8">
        <button
          type="button"
          onClick={() => router.push(AUTH_ROUTES.FORGOT_PASSWORD)}
          aria-label="Go back"
          className="flex size-10 items-center justify-center rounded-xl text-(--color-text-secondary) hover:bg-(--color-surface-subtle)"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex-1 pt-6 sm:pt-8">
          <h1 className="text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl">
            Create new password
          </h1>
          <p className="mt-1 text-sm text-(--color-text-secondary)">
            Enter the code sent to your email.
          </p>

          <div className="mt-7 space-y-2">
            <label
              htmlFor="code"
              className="text-sm font-semibold text-(--color-brand-primary)"
            >
              Verification code
            </label>
            <input
              id="code"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              className="h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-border-default) px-4 text-center text-lg font-semibold tracking-[0.35em] text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary-soft)"
            />
          </div>

          <div className="my-6 h-px bg-(--color-border-subtle)" />

          <PasswordField
            id="password"
            label="New password"
            value={password}
            show={show}
            toggle={() => setShow(!show)}
            onChange={setPassword}
          />
          {password && (
            <div className="mt-3 space-y-2">
              {requirements.map(([label, met]) => (
                <p
                  key={label}
                  className={`text-xs ${
                    met
                      ? "text-(--color-success)"
                      : "text-(--color-text-muted)"
                  }`}
                >
                  {met ? "✓" : "○"} {label}
                </p>
              ))}
            </div>
          )}

          <div className="mt-5">
            <PasswordField
              id="confirm"
              label="Confirm new password"
              value={confirm}
              show={showConfirm}
              toggle={() => setShowConfirm(!showConfirm)}
              onChange={setConfirm}
              placeholder="Re-enter your password"
            />
          </div>
        </div>

        <footer className="pt-8">
          <button
            type="button"
            disabled={!valid}
            onClick={() => router.push(AUTH_ROUTES.PASSWORD_RESET_SUCCESS)}
            className="h-(--control-height-lg) w-full rounded-(--radius-2xl) bg-(--color-brand-primary) text-sm font-semibold text-(--color-text-inverse) hover:bg-(--color-brand-primary-hover) disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset password
          </button>
        </footer>
      </div>
    </main>
  );
}

function PasswordField({
  id,
  label,
  value,
  show,
  toggle,
  onChange,
  placeholder = "Enter your password",
}: {
  id: string;
  label: string;
  value: string;
  show: boolean;
  toggle: () => void;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-(--color-text-primary)"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-border-default) px-4 pr-12 text-sm text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary-soft)"
        />
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle password visibility"
          className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-(--color-text-muted)"
        >
          {show ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  );
}