"use client";

interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

export function ProgressBar({
  step,
  totalSteps,
}: ProgressBarProps) {
  const progress = `${(step / totalSteps) * 100}%`;

  return (
    <div
      className="h-1 w-full overflow-hidden rounded-(--radius-full) bg-(--color-border-subtle)"
      aria-label={`Step ${step} of ${totalSteps}`}
    >
      <div
        className="h-full rounded-(--radius-full) bg-(--color-brand-primary) transition-[width] duration-(--duration-normal)"
        style={{ width: progress }}
      />
    </div>
  );
}