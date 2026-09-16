import { ShieldCheck } from "lucide-react";

interface TrustNoteProps {
  children: React.ReactNode;
}

export function TrustNote({
  children,
}: TrustNoteProps) {
  return (
    <div className="flex items-start gap-3 rounded-(--radius-lg) bg-(--color-surface-brand) px-4 py-3">
      <ShieldCheck
        size={17}
        className="mt-0.5 shrink-0 text-(--color-brand-primary)"
      />

      <p className="text-xs leading-normal text-(--color-text-secondary)">
        {children}
      </p>
    </div>
  );
}