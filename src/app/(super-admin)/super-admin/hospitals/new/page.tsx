"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminCard } from "@/components/super-admin/ui/admin-card";
import { AdminErrorState } from "@/components/super-admin/ui/admin-error-state";
import { AdminPageHeader } from "@/components/super-admin/ui/admin-page-header";
import { useSuperAdminHospitalsStore } from "@/stores/super-admin-hospitals.store";
import { apiService } from "@/services/api.service";
import { getApiErrorMessage } from "@/lib/axios";
import type { LgaResponse, StateResponse } from "@/features/api/types";

export default function NewHospitalPage() {
  const router = useRouter();
  const { createHospital, isSubmitting, error } = useSuperAdminHospitalsStore();
  const [form, setForm] = useState({ name: "", phone: "", address: "", state_id: "", lga_id: "", latitude: "", longitude: "" });
  const [states, setStates] = useState<StateResponse[]>([]);
  const [lgas, setLgas] = useState<LgaResponse[]>([]);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    void apiService.listStates().then(setStates).catch((error: unknown) => setFormError(getApiErrorMessage(error, "Unable to load states.")));
  }, []);

  useEffect(() => {
    if (!form.state_id) return;
    void apiService.listLgas(form.state_id).then(setLgas).catch((error: unknown) => setFormError(getApiErrorMessage(error, "Unable to load LGAs.")));
  }, [form.state_id]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await createHospital({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        state_id: form.state_id,
        lga_id: form.lga_id,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      });
      router.push("/super-admin/hospitals");
    } catch { }
  }

  return (
    // Add Hospital   
    <div className="mx-auto max-w-md space-y-6">
      <Link href="/super-admin/hospitals" className="inline-flex items-center gap-2 text-sm text-(--color-admin-muted) hover:text-(--color-admin-text)"><ArrowLeft className="size-4" />Back to hospitals</Link>
      <AdminPageHeader title="Add Hospital" description="Add a hospital to the platform's preloaded hospital directory." />
      <AdminCard className="p-6">
        {(error || formError) && <div className="mb-5"><AdminErrorState message={error ?? formError} /></div>}
        <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
          {[
            ["name", "Hospital name", "text", true],
            ["phone", "Phone number", "tel", true],
            ["address", "Address", "text", true],
            ["latitude", "Latitude", "number", false],
            ["longitude", "Longitude", "number", false],
          ].map(([key, label, type, required]) => (
            <label key={key as string} className="space-y-2">
              <span className="text-sm font-semibold">{label as string}</span>
              <input type={type as string} step={type === "number" ? "any" : undefined} value={form[key as keyof typeof form]} onChange={(event) => setForm((current) => ({ ...current, [key as string]: event.target.value }))} required={Boolean(required)} className="h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-admin-border) bg-(--color-admin-card) px-4 text-sm text-(--color-admin-text) outline-none placeholder:text-(--color-admin-muted) focus:border-(--color-admin-accent) focus:ring-2 focus:ring-(--color-admin-accent-soft)" />
            </label>
          ))}
          <label className="space-y-2">
            <span className="text-sm font-semibold">State</span>
            <select value={form.state_id} onChange={(event) => { setLgas([]); setForm((current) => ({ ...current, state_id: event.target.value, lga_id: "" })); }} required className="h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-admin-border) bg-(--color-admin-card) px-4 text-sm">
              <option value="">Select a state</option>{states.map((state) => <option key={state.id} value={state.id}>{state.name}</option>)}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold">Local Government Area</span>
            <select value={form.lga_id} onChange={(event) => setForm((current) => ({ ...current, lga_id: event.target.value }))} required disabled={!form.state_id} className="h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-admin-border) bg-(--color-admin-card) px-4 text-sm disabled:opacity-50">
              <option value="">Select an LGA</option>{lgas.map((lga) => <option key={lga.id} value={lga.id}>{lga.name}</option>)}
            </select>
          </label>
          <button type="submit" disabled={isSubmitting} className="sm:col-span-2 h-(--control-height-lg) rounded-(--radius-lg) bg-(--color-admin-accent) text-sm font-semibold text-(--color-text-inverse) disabled:opacity-60">{isSubmitting ? "Saving..." : "Save Hospital"}</button>
        </form>
      </AdminCard>
    </div>
  );
}
