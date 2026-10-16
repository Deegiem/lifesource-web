"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminBreadcrumbs } from "@/components/super-admin/ui/admin-breadcrumbs";
import { AdminCard } from "@/components/super-admin/ui/admin-card";
import { AdminErrorState } from "@/components/super-admin/ui/admin-error-state";
import { AdminLoadingState } from "@/components/super-admin/ui/admin-loading-state";
import { AdminPageHeader } from "@/components/super-admin/ui/admin-page-header";
import { useSuperAdminHospitalsStore } from "@/stores/super-admin-hospitals.store";
import { apiService } from "@/services/api.service";
import type { HospitalUpdate, LgaResponse, StateResponse } from "@/features/api/types";

export default function EditHospitalPage() {
  const router = useRouter();
  const params = useParams<{ hospitalId: string }>();
  const hospitalId = params.hospitalId;

  const {
    hospitals,
    isLoading,
    isSubmitting,
    loadHospitals,
    updateHospital,
  } = useSuperAdminHospitalsStore();

  const hospital = hospitals.find((h) => h.id === hospitalId);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [stateId, setStateId] = useState("");
  const [lgaId, setLgaId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Baseline snapshot for change detection
  const [baseline, setBaseline] = useState<string | null>(null);

  // Dropdown data
  const [states, setStates] = useState<StateResponse[]>([]);
  const [lgas, setLgas] = useState<LgaResponse[]>([]);

  const [formError, setFormError] = useState("");

  // Load hospitals if we came in cold (hard refresh, direct link)
  useEffect(() => {
    if (!hospitals.length) void loadHospitals();
  }, [hospitals.length, loadHospitals]);

  // Hydrate the form when we have the hospital, and snapshot the baseline
  useEffect(() => {
    if (!hospital) return;

    const nextName = hospital.name;
    const nextPhone = hospital.phone;
    const nextAddress = hospital.address;
    const nextStateId = hospital.stateId;
    const nextLgaId = hospital.lgaId;
    const nextLatitude =
      hospital.latitude !== null ? String(hospital.latitude) : "";
    const nextLongitude =
      hospital.longitude !== null ? String(hospital.longitude) : "";
    const nextIsActive = hospital.status === "active";

    setName(nextName);
    setPhone(nextPhone);
    setAddress(nextAddress);
    setStateId(nextStateId);
    setLgaId(nextLgaId);
    setLatitude(nextLatitude);
    setLongitude(nextLongitude);
    setIsActive(nextIsActive);

    // Snapshot the initial state so we can detect changes later
    setBaseline(
      JSON.stringify({
        name: nextName,
        phone: nextPhone,
        address: nextAddress,
        stateId: nextStateId,
        lgaId: nextLgaId,
        latitude: nextLatitude,
        longitude: nextLongitude,
        isActive: nextIsActive,
      }),
    );
  }, [hospital]);

  // Load states once
  useEffect(() => {
    void apiService
      .listStates()
      .then(setStates)
      .catch(() => setStates([]));
  }, []);

  // Load LGAs whenever stateId changes
  useEffect(() => {
    if (!stateId) {
      setLgas([]);
      return;
    }
    void apiService
      .listLgas(stateId)
      .then(setLgas)
      .catch(() => setLgas([]));
  }, [stateId]);

  // Compute whether anything has changed vs the baseline
  const hasChanges =
    baseline !== null &&
    baseline !==
      JSON.stringify({
        name,
        phone,
        address,
        stateId,
        lgaId,
        latitude,
        longitude,
        isActive,
      });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");

    if (
      !name.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !stateId ||
      !lgaId
    ) {
      setFormError("Please fill in name, phone, address, state and LGA.");
      return;
    }

    const payload: HospitalUpdate = {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      state_id: stateId,
      lga_id: lgaId,
      latitude: latitude.trim() ? Number(latitude) : null,
      longitude: longitude.trim() ? Number(longitude) : null,
      is_active: isActive,
    };

    try {
      await updateHospital(hospitalId, payload);
      router.push(`/super-admin/hospitals/${hospitalId}`);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Unable to save changes.",
      );
    }
  };

  // --- early states ---

  if (isLoading && !hospital) {
    return (
      <div className="space-y-6">
        <AdminCard>
          <AdminLoadingState />
        </AdminCard>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="space-y-6">
        <AdminCard>
          <AdminErrorState message="Hospital not found." />
        </AdminCard>
      </div>
    );
  }

  // --- render ---

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminBreadcrumbs
        items={[
          { label: "Hospitals", href: "/super-admin/hospitals" },
          {
            label: hospital.name,
            href: `/super-admin/hospitals/${hospital.id}`,
          },
          { label: "Edit" },
        ]}
      />

      <Link
        href={`/super-admin/hospitals/${hospital.id}`}
        className="inline-flex items-center gap-2 text-sm text-(--color-admin-muted) hover:text-(--color-admin-text)"
      >
        <ArrowLeft className="size-4" />
        Back to hospital
      </Link>

      <AdminPageHeader title="Edit hospital" description={hospital.id} />

      <AdminCard className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field
            label="Hospital name"
            value={name}
            onChange={setName}
            required
          />
          <Field label="Phone" value={phone} onChange={setPhone} required />
          <Field
            label="Address"
            value={address}
            onChange={setAddress}
            required
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              label="State"
              value={stateId}
              onChange={(value) => {
                setStateId(value);
                setLgaId("");
              }}
              options={states.map((s) => ({ value: s.id, label: s.name }))}
              placeholder="Select state"
              required
            />

            <SelectField
              label="LGA"
              value={lgaId}
              onChange={setLgaId}
              options={lgas.map((l) => ({ value: l.id, label: l.name }))}
              placeholder={stateId ? "Select LGA" : "Select a state first"}
              disabled={!stateId || lgas.length === 0}
              required
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Latitude"
              value={latitude}
              onChange={setLatitude}
              placeholder="e.g. 7.35105"
            />
            <Field
              label="Longitude"
              value={longitude}
              onChange={setLongitude}
              placeholder="e.g. 3.86249"
            />
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="size-4 accent-(--color-admin-accent)"
            />
            <span className="text-sm font-semibold">
              Active (hospital can receive requests)
            </span>
          </label>

          {formError && (
            <p className="rounded-md bg-(--color-admin-danger-soft) p-3 text-sm text-(--color-admin-danger)">
              {formError}
            </p>
          )}

          {!hasChanges && !isSubmitting && (
            <p className="text-xs text-(--color-admin-muted)">
              Make a change to enable saving.
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link
              href={`/super-admin/hospitals/${hospital.id}`}
              className="inline-flex h-(--control-height-lg) items-center justify-center rounded-(--radius-lg) border border-(--color-admin-border) px-5 text-sm font-semibold"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting || !hasChanges}
              className="inline-flex h-(--control-height-lg) items-center justify-center rounded-(--radius-lg) bg-(--color-admin-accent) px-5 text-sm font-semibold text-(--color-text-inverse) disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}

// ---------- local field components ----------

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-admin-border) bg-(--color-admin-card) px-4 text-sm text-(--color-admin-text) outline-none placeholder:text-(--color-admin-muted) focus:border-(--color-admin-accent) focus:ring-2 focus:ring-(--color-admin-accent-soft)"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        className="h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-admin-border) bg-(--color-admin-card) px-4 text-sm text-(--color-admin-text) outline-none focus:border-(--color-admin-accent) focus:ring-2 focus:ring-(--color-admin-accent-soft) disabled:opacity-50"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}