"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  type?: "text" | "email" | "tel";
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  type = "text",
}: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-(--color-text-primary)">
        {label}
        {required && (
          <span className="ml-1 text-(--color-blood)">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) px-4 text-sm text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary-soft)"
      />

      {error && (
        <p className="text-xs text-(--color-danger)">
          {error}
        </p>
      )}
    </div>
  );
}

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-(--color-text-primary)">
        {label}
        {required && (
          <span className="ml-1 text-(--color-blood)">
            *
          </span>
        )}
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) px-4 pr-12 text-sm text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary-soft)"
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
          aria-label={
            visible
              ? "Hide password"
              : "Show password"
          }
        >
          {visible ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>
    </div>
  );
}