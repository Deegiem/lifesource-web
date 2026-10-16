"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Droplet,
  MapPin,
  Pencil,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";

import { PageHeader, PageShell } from "@/components/community-member/ui";
import { useRequestStore } from "@/stores/request.store";
import { apiService } from "@/services/api.service";
import { getApiErrorMessage } from "@/lib/axios";
import type { LgaResponse, StateResponse } from "@/features/api/types";

export default function DonorProfilePage() {
  const { donor, loadDonorProfile, updateDonorAvailability, error } =
    useRequestStore();

  const [togglingAvailability, setTogglingAvailability] = useState(false);
  const [localError, setLocalError] = useState("");

  // ---- Edit location state ----
  const [editingLocation, setEditingLocation] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);
  const [states, setStates] = useState<StateResponse[]>([]);
  const [lgas, setLgas] = useState<LgaResponse[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingLgas, setLoadingLgas] = useState(false);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedLgaId, setSelectedLgaId] = useState("");

  useEffect(() => {
    void loadDonorProfile();
  }, [loadDonorProfile]);

  // Load states when opening the editor
  useEffect(() => {
    if (!editingLocation) return;
    if (states.length > 0) return;

    setLoadingStates(true);
    apiService
      .listStates()
      .then(setStates)
      .catch(() => setLocalError("Unable to load states."))
      .finally(() => setLoadingStates(false));
  }, [editingLocation, states.length]);

  // Load LGAs when a state is chosen
  useEffect(() => {
    if (!editingLocation || !selectedStateId) {
      setLgas([]);
      return;
    }

    let cancelled = false;
    setLoadingLgas(true);
    apiService
      .listLgas(selectedStateId)
      .then((result) => {
        if (!cancelled) setLgas(result);
      })
      .catch(() => {
        if (!cancelled) setLocalError("Unable to load LGAs.");
      })
      .finally(() => {
        if (!cancelled) setLoadingLgas(false);
      });

    return () => {
      cancelled = true;
    };
  }, [editingLocation, selectedStateId]);

  const handleToggle = async () => {
    if (!donor) return;
    setTogglingAvailability(true);
    setLocalError("");
    try {
      await updateDonorAvailability(!donor.availability);
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Unable to update availability.",
      );
    } finally {
      setTogglingAvailability(false);
    }
  };

  const startEditingLocation = () => {
    setLocalError("");
    setEditingLocation(true);
    setSelectedStateId("");
    setSelectedLgaId("");
    setLgas([]);
  };

  const cancelEditingLocation = () => {
    setEditingLocation(false);
    setSelectedStateId("");
    setSelectedLgaId("");
    setLgas([]);
  };

  const saveLocation = async () => {
    if (!selectedStateId || !selectedLgaId) return;

    setSavingLocation(true);
    setLocalError("");
    try {
      // PATCH /donors/me with state + lga
      await apiService.updateDonorProfile({
        state_id: selectedStateId,
        lga_id: selectedLgaId,
      });
      await loadDonorProfile();
      setEditingLocation(false);
      setSelectedStateId("");
      setSelectedLgaId("");
    } catch (err) {
      setLocalError(
        getApiErrorMessage(err, "Unable to update your location."),
      );
    } finally {
      setSavingLocation(false);
    }
  };

  const loading = !donor;
  const isEligible = donor?.isEligible ?? false;

  const stateOptions = useMemo(
    () => states.map((s) => ({ value: s.id, label: s.name })),
    [states],
  );

  const lgaOptions = useMemo(
    () => lgas.map((l) => ({ value: l.id, label: l.name })),
    [lgas],
  );

  return (
    <PageShell>
      <Link
        href="/donor/dashboard"
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-(--color-text-secondary) hover:text-(--color-brand-primary)"
      >
        <ArrowLeft className="size-4" />
        Back to dashboard
      </Link>

      <PageHeader
        title="Donor profile"
        description="Your blood type, location, and availability determine which requests reach you."
      />

      {error || localError ? (
        <div
          role="alert"
          className="mb-5 rounded-(--radius-lg) bg-(--color-danger-soft) p-4 text-sm text-(--color-danger)"
        >
          {error || localError}
        </div>
      ) : null}

      {/* Blood type hero (read-only) */}
      <div className="relative mb-5 overflow-hidden rounded-(--radius-xl) border border-(--color-border-default) bg-white p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-(--color-blood-soft) blur-3xl" />

        <div className="relative flex items-center gap-5">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-(--color-blood) to-(--color-blood-hover) text-3xl font-extrabold text-white shadow-lg shadow-(--color-blood)/30">
            {loading ? "…" : donor.bloodType}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-(--color-blood)">
              Your blood type
            </p>
            <p className="mt-1 text-2xl font-extrabold text-(--color-text-primary)">
              {loading ? "Loading…" : donor.bloodType}
            </p>
            <p className="mt-1 text-sm text-(--color-text-secondary)">
              {isEligible
                ? "You're eligible to donate"
                : "Cooldown active — requests will resume later"}
            </p>
          </div>
        </div>
      </div>

      {/* Info rows */}
      <div className="mb-5 divide-y divide-(--color-border-subtle) overflow-hidden rounded-(--radius-xl) border border-(--color-border-default) bg-white">
        {/* Location — editable */}
        <div className="px-4 py-3.5">
          {!editingLocation ? (
            <div className="flex items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-(--color-surface-subtle) text-(--color-brand-primary)">
                <MapPin className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-(--color-text-muted)">Location</p>
                <p className="mt-0.5 text-sm font-semibold text-(--color-text-primary)">
                  {loading ? "…" : `${donor.stateName}, ${donor.lgaName}`}
                </p>
              </div>
              <button
                type="button"
                onClick={startEditingLocation}
                disabled={loading}
                aria-label="Edit location"
                className="flex size-8 shrink-0 items-center justify-center rounded-(--radius-md) text-(--color-text-muted) transition-colors hover:bg-(--color-surface-subtle) hover:text-(--color-brand-primary) disabled:opacity-50"
              >
                <Pencil className="size-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-(--color-brand-primary-soft) text-(--color-brand-primary)">
                  <MapPin className="size-4" />
                </span>
                <p className="text-sm font-bold text-(--color-text-primary)">
                  Update location
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-(--color-text-secondary)">
                    State
                  </span>
                  <select
                    value={selectedStateId}
                    onChange={(e) => {
                      setSelectedStateId(e.target.value);
                      setSelectedLgaId("");
                    }}
                    disabled={loadingStates}
                    className="h-(--control-height-md) w-full rounded-(--radius-md) border border-(--color-border-default) bg-white px-3 text-sm outline-none focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary-soft) disabled:opacity-50"
                  >
                    <option value="">
                      {loadingStates ? "Loading states…" : "Select a state"}
                    </option>
                    {stateOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-(--color-text-secondary)">
                    Local Government Area
                  </span>
                  <select
                    value={selectedLgaId}
                    onChange={(e) => setSelectedLgaId(e.target.value)}
                    disabled={!selectedStateId || loadingLgas}
                    className="h-(--control-height-md) w-full rounded-(--radius-md) border border-(--color-border-default) bg-white px-3 text-sm outline-none focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary-soft) disabled:opacity-50"
                  >
                    <option value="">
                      {!selectedStateId
                        ? "Select a state first"
                        : loadingLgas
                          ? "Loading LGAs…"
                          : "Select an LGA"}
                    </option>
                    {lgaOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void saveLocation()}
                  disabled={
                    savingLocation || !selectedStateId || !selectedLgaId
                  }
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-(--radius-md) bg-(--color-brand-primary) px-3.5 text-xs font-semibold text-white transition-colors hover:bg-(--color-brand-primary-hover) disabled:opacity-50"
                >
                  <Check className="size-3.5" />
                  {savingLocation ? "Saving…" : "Save location"}
                </button>
                <button
                  type="button"
                  onClick={cancelEditingLocation}
                  disabled={savingLocation}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-(--radius-md) border border-(--color-border-default) bg-white px-3.5 text-xs font-semibold text-(--color-text-primary) transition-colors hover:bg-(--color-surface-subtle) disabled:opacity-50"
                >
                  <X className="size-3.5" />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <InfoRow
          icon={<ShieldCheck className="size-4" />}
          label="Eligibility"
          value={loading ? "…" : isEligible ? "Eligible" : "In cooldown"}
          accent={isEligible ? "success" : "warning"}
        />

        <InfoRow
          icon={<Droplet className="size-4" />}
          label="Last donation"
          value={
            loading || !donor.lastDonationDate
              ? "No donations yet"
              : new Date(donor.lastDonationDate).toLocaleDateString()
          }
        />
      </div>

      {/* Availability toggle */}
      <div className="relative overflow-hidden rounded-(--radius-xl) border border-(--color-border-default) bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-(--color-text-primary)">
              Availability
            </p>
            <p className="mt-1 text-xs leading-relaxed text-(--color-text-secondary)">
              {donor?.availability
                ? "You're visible to communities in your area. You'll receive notifications for matching requests."
                : "You're hidden from matching. You won't receive notifications until you turn this back on."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleToggle()}
            disabled={loading || togglingAvailability}
            aria-pressed={donor?.availability ?? false}
            aria-label={
              donor?.availability
                ? "Turn availability off"
                : "Turn availability on"
            }
            className="shrink-0 disabled:opacity-50"
          >
            {donor?.availability ? (
              <ToggleRight className="size-10 text-(--color-success)" />
            ) : (
              <ToggleLeft className="size-10 text-(--color-text-muted)" />
            )}
          </button>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-(--color-surface-subtle) px-3 py-1.5">
          <span
            className={`size-2 rounded-full ${
              donor?.availability
                ? "bg-(--color-success)"
                : "bg-(--color-text-muted)"
            }`}
          />
          <span className="text-xs font-semibold text-(--color-text-secondary)">
            {donor?.availability ? "Available" : "Not available"}
          </span>
        </div>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-(--color-text-muted)">
        Blood type is set during onboarding and cannot be changed here. Contact
        LIFESOURCE support if you need to correct it.
      </p>
    </PageShell>
  );
}

function InfoRow({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: "success" | "warning";
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-(--color-surface-subtle) text-(--color-brand-primary)">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-(--color-text-muted)">{label}</p>
        <p
          className={`mt-0.5 text-sm font-semibold ${
            accent === "success"
              ? "text-(--color-success)"
              : accent === "warning"
                ? "text-(--color-warning)"
                : "text-(--color-text-primary)"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}