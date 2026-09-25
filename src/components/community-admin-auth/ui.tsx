import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck, Mail, ChevronRight, ArrowLeft } from "lucide-react";

export function ScreenHeader({
  onBack,
  step,
  totalSteps,
}: {
  onBack?: () => void;
  step?: number;
  totalSteps?: number;
}) {
  return (
    <div className="space-y-4 pb-2">
      <div className="flex items-center justify-between">
        {onBack ? (
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F4F7FB] text-[#4B617A] transition-colors -ml-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-10" />
        )}
        {step !== undefined && totalSteps && (
          <span className="text-xs font-semibold text-[#8FA3BD]">
            {step}/{totalSteps}
          </span>
        )}
        <div className="w-10" />
      </div>
      {step !== undefined && totalSteps && (
        <div className="h-1 bg-[#D8E3EF] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1B3A5C] rounded-full transition-all duration-500"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}

export function Badge({
  children,
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "error";
  className?: string;
}) {
  const v = {
    primary: "bg-indigo-50 text-indigo-600",
    success: "bg-teal-50 text-teal-700",
    warning: "bg-amber-50 text-amber-700",
    error: "bg-red-50 text-[#C62828]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
        v[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function InfoBanner({
  children,
  variant = "info",
}: {
  children: React.ReactNode;
  variant?: "info" | "warning";
}) {
  const v = {
    info: "bg-indigo-50 border-indigo-200 text-indigo-800",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
  };
  return (
    <div className={cn("p-4 rounded-xl border", v[variant])}>{children}</div>
  );
}

export function TrustNote({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-xs text-[#8FA3BD] mt-4">
      <ShieldCheck className="w-3.5 h-3.5" />
      <p>{text}</p>
    </div>
  );
}

export function Input({
  label,
  error,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-semibold text-[#0D1B2A]">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full px-4 py-3 rounded-xl border bg-white outline-none transition-colors",
          error
            ? "border-red-500 focus:border-red-600"
            : "border-[#D8E3EF] focus:border-indigo-600",
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 font-medium mt-1">{error}</p>
      )}
      {hint && !error && <p className="text-xs text-[#8FA3BD] mt-1">{hint}</p>}
    </div>
  );
}

export function PasswordInput({
  label = "Password",
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-semibold text-[#0D1B2A]">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          className={cn(
            "w-full px-4 py-3 rounded-xl border bg-white outline-none transition-colors",
            error
              ? "border-red-500 focus:border-red-600"
              : "border-[#D8E3EF] focus:border-indigo-600",
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-indigo-600 px-2 py-1"
        >
          {show ? "HIDE" : "SHOW"}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 font-medium mt-1">{error}</p>
      )}
    </div>
  );
}

export function OTPInput({
  value,
  onChange,
  length = 6,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  length?: number;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value.replace(/\D/g, "").slice(0, length))
        }
        className={cn(
          "w-full px-4 py-4 rounded-2xl border bg-white outline-none text-center text-3xl font-bold tracking-[0.5em] transition-colors",
          error
            ? "border-red-500 focus:border-red-600 text-red-600"
            : "border-[#D8E3EF] focus:border-indigo-600 text-[#0D1B2A]",
        )}
        placeholder="------"
      />
      {error && (
        <p className="text-xs text-red-500 font-medium mt-1 text-center">
          {error}
        </p>
      )}
    </div>
  );
}

export function SelectField({
  label,
  options,
  error,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-[#0D1B2A]">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full px-4 py-3 rounded-xl border bg-white outline-none transition-colors appearance-none",
          error ? "border-red-500" : "border-[#D8E3EF] focus:border-indigo-600",
          !value && "text-[#8FA3BD]",
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-500 font-medium mt-1">{error}</p>
      )}
    </div>
  );
}

export function CommunityCard({
  name,
  type,
  state,
  invitedBy,
  inviteKind = "member",
}: {
  name: string;
  type: string;
  state: string;
  invitedBy: string;
  inviteKind?: "member" | "admin";
}) {
  const theme = {
    admin: {
      border: "border-indigo-600/30",
      bg: "bg-indigo-50",
      accentBg: "bg-indigo-600",
      badgeBg: "bg-indigo-600/20",
      text: "text-indigo-600",
    },
    member: {
      border: "border-teal-700/30",
      bg: "bg-teal-50",
      accentBg: "bg-teal-700",
      badgeBg: "bg-teal-700/20",
      text: "text-teal-700",
    },
  }[inviteKind];

  return (
    <div className={cn("rounded-2xl border-2 p-4 space-y-3", theme.border, theme.bg)}>
      <div className="flex items-center gap-3">
        <div
          className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold shrink-0", theme.accentBg)}
        >
          {name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-base text-[#0D1B2A] truncate">{name}</p>
          <p className="text-sm text-[#4B617A]">{type}</p>
        </div>
        <div className="ml-auto shrink-0">
          <div
            className={cn("flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold", theme.badgeBg, theme.text)}
          >
            <ShieldCheck size={12} />
            Verified
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Location", value: state },
          { label: "Invited by", value: invitedBy },
        ].map((d) => (
          <div key={d.label} className="bg-white/70 rounded-xl px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8FA3BD]">
              {d.label}
            </p>
            <p className="text-sm font-semibold text-[#0D1B2A] mt-0.5 truncate">
              {d.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
