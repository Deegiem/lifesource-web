'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowLeft, Check, ChevronRight, MapPin, Plus, Search } from 'lucide-react';
import { BLOOD_TYPES, type BloodType, type RequestUrgency } from '@/features/request/types';

export function PageShell({ children }: { children: ReactNode }) {
  return <main className="min-h-screen bg-(--color-surface-page) text-(--color-text-primary)"><div className="mx-auto w-full max-w-(--container-lg) px-(--page-padding-mobile) py-6 md:px-(--page-padding-tablet) md:py-8 lg:px-(--page-padding-desktop)">{children}</div></main>;
}

export function BackLink({ href, label = 'Back' }: { href: string; label?: string }) {
  return <Link href={href} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-(--color-text-secondary) hover:text-(--color-brand-primary)"><ArrowLeft className="size-4" />{label}</Link>;
}

export function Button({ children, variant = 'primary', disabled, type = 'button', onClick }: { children: ReactNode; variant?: 'primary' | 'secondary' | 'outline'; disabled?: boolean; type?: 'button' | 'submit'; onClick?: () => void }) {
  const classes = variant === 'primary' ? 'bg-(--color-brand-primary) text-white hover:bg-(--color-brand-primary-hover)' : variant === 'secondary' ? 'bg-(--color-blood) text-white hover:bg-(--color-blood-hover)' : 'border border-(--color-border-default) bg-white text-(--color-text-primary) hover:bg-(--color-surface-subtle)';
  return <button type={type} disabled={disabled} onClick={onClick} className={`inline-flex min-h-(--control-height-lg) items-center justify-center gap-2 rounded-(--radius-lg) px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${classes}`}>{children}</button>;
}

export function BloodTypeGrid({ value, onChange }: { value: BloodType | ''; onChange: (value: BloodType) => void }) {
  return <div className="grid grid-cols-4 gap-2">{BLOOD_TYPES.map((blood) => <button key={blood} type="button" onClick={() => onChange(blood)} className={`min-h-(--control-height-md) rounded-(--radius-lg) border text-sm font-bold transition-colors ${value === blood ? 'border-(--color-brand-primary) bg-(--color-brand-primary-soft) text-(--color-brand-primary)' : 'border-(--color-border-default) bg-white text-(--color-text-secondary) hover:border-(--color-border-strong)'}`}>{blood}</button>)}</div>;
}

export function Field({ label, value, onChange, placeholder, error, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; error?: string; type?: string }) {
  return <div className="space-y-2"><label className="block text-sm font-semibold text-(--color-text-primary)">{label}</label><input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-border-default) bg-white px-4 text-sm text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary-soft)" />{error ? <p className="text-xs text-(--color-danger)">{error}</p> : null}</div>;
}

export function SelectField({ label, value, onChange, options, placeholder, error }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; placeholder: string; error?: string }) {
  return <div className="space-y-2"><label className="block text-sm font-semibold text-(--color-text-primary)">{label}</label><select value={value} onChange={(event) => onChange(event.target.value)} className="h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-border-default) bg-white px-4 text-sm text-(--color-text-primary) outline-none focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary-soft)"><option value="">{placeholder}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{error ? <p className="text-xs text-(--color-danger)">{error}</p> : null}</div>;
}

export function RequestCard({ request, href }: { request: import('@/features/request/types').BloodRequest; href: string }) {
  const progress = Math.min(request.confirmedDonors / request.donorsNeeded, 1);
  return <Link href={href} className="block rounded-(--radius-xl) border border-(--color-border-default) bg-white p-4 shadow-(--shadow-sm) transition-colors hover:border-(--color-border-strong)"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><div className="flex size-11 shrink-0 items-center justify-center rounded-(--radius-lg) bg-(--color-blood-soft)"><span className="text-sm font-extrabold text-(--color-blood)">{request.bloodType}</span></div><div className="min-w-0"><p className="truncate text-sm font-bold">{request.hospital.name}</p><p className="mt-1 flex items-center gap-1 text-xs text-(--color-text-muted)"><MapPin className="size-3" />{request.hospital.lga}, {request.hospital.state}</p></div></div><UrgencyBadge urgency={request.urgency} /></div><div className="mt-4"><div className="mb-1.5 flex justify-between text-xs text-(--color-text-muted)"><span>{request.confirmedDonors}/{request.donorsNeeded} donors confirmed</span><span>{request.donorsNeeded - request.confirmedDonors} needed</span></div><div className="h-1.5 overflow-hidden rounded-full bg-(--color-border-subtle)"><div className="h-full rounded-full bg-(--color-brand-primary)" style={{ width: `${progress * 100}%` }} /></div></div><div className="mt-3 flex items-center justify-between text-xs"><span className="text-(--color-text-muted)">{request.id}</span><ChevronRight className="size-4 text-(--color-text-muted)" /></div></Link>;
}

export function UrgencyBadge({ urgency }: { urgency: RequestUrgency }) { const classes = urgency === 'Critical' ? 'bg-(--color-danger-soft) text-(--color-danger)' : urgency === 'High' ? 'bg-(--color-warning-soft) text-(--color-warning)' : 'bg-(--color-surface-subtle) text-(--color-text-secondary)'; return <span className={`shrink-0 rounded-(--radius-full) px-2.5 py-1 text-[10px] font-bold uppercase ${classes}`}>{urgency}</span>; }

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) { return <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div>{eyebrow ? <p className="mb-1 text-sm font-medium text-(--color-text-muted)">{eyebrow}</p> : null}<h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{title}</h1>{description ? <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-(--color-text-secondary)">{description}</p> : null}</div>{action}</header>; }

export function SuccessState({ title, description, children }: { title: string; description: string; children?: ReactNode }) { return <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center"><div className="flex size-16 items-center justify-center rounded-full bg-(--color-success-soft) text-(--color-success)"><Check className="size-8" /></div><h1 className="mt-5 text-2xl font-extrabold">{title}</h1><p className="mt-2 text-sm leading-relaxed text-(--color-text-secondary)">{description}</p>{children ? <div className="mt-6 w-full">{children}</div> : null}</div>; }

export { Plus, Search };
