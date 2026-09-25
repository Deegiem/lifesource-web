"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminCard } from "@/components/super-admin/ui/admin-card";
import { AdminErrorState } from "@/components/super-admin/ui/admin-error-state";
import { AdminPageHeader } from "@/components/super-admin/ui/admin-page-header";
import { useSuperAdminHospitalsStore } from "@/stores/super-admin-hospitals.store";

export default function NewHospitalPage() {
  const router = useRouter();
  const { createHospital, isSubmitting, error } = useSuperAdminHospitalsStore();
  const [form, setForm] = useState({ name: "", address: "", state: "", lga: "", latitude: "", longitude: "" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await createHospital({
        name: form.name.trim(),
        address: form.address.trim(),
        state: form.state.trim(),
        lga: form.lga.trim(),
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      });
      router.push("/super-admin/hospitals");
    } catch { }
  }

  return (
    // Add Hospital   
    <div className="mx-auto max-w-(--container-md) space-y-6">
      <Link href="/super-admin/hospitals" className="inline-flex items-center gap-2 text-sm text-(--color-admin-muted) hover:text-(--color-admin-text)"><ArrowLeft className="size-4" />Back to hospitals</Link>
      <AdminPageHeader title="Add Hospital" description="Add a hospital to the platform's preloaded hospital directory." />
      <AdminCard className="p-6">
        {error && <div className="mb-5"><AdminErrorState message={error} /></div>}
        <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
          {[
            ["name", "Hospital name", "text", true],
            ["address", "Address", "text", true],
            ["state", "State", "text", true],
            ["lga", "LGA", "text", true],
            ["latitude", "Latitude", "number", false],
            ["longitude", "Longitude", "number", false],
          ].map(([key, label, type, required]) => (
            <label key={key as string} className="space-y-2">
              <span className="text-sm font-semibold">{label as string}</span>
              <input type={type as string} step={type === "number" ? "any" : undefined} value={form[key as keyof typeof form]} onChange={(event) => setForm((current) => ({ ...current, [key as string]: event.target.value }))} required={Boolean(required)} className="h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-admin-border) bg-(--color-admin-card) px-4 text-sm text-(--color-admin-text) outline-none placeholder:text-(--color-admin-muted) focus:border-(--color-admin-accent) focus:ring-2 focus:ring-(--color-admin-accent-soft)" />
            </label>
          ))}
          <button type="submit" disabled={isSubmitting} className="sm:col-span-2 h-(--control-height-lg) rounded-(--radius-lg) bg-(--color-admin-accent) text-sm font-semibold text-(--color-text-inverse) disabled:opacity-60">{isSubmitting ? "Saving..." : "Save Hospital"}</button>
        </form>
      </AdminCard>
    </div>
  );
}
