"use client";

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  required = false,
}: SelectFieldProps) {
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

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) px-4 text-sm text-(--color-text-primary) outline-none focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary-soft) disabled:cursor-not-allowed disabled:bg-(--color-surface-subtle) disabled:text-(--color-text-muted)"
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}