"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Clock3, Droplet, Filter, Search, SlidersHorizontal, X } from "lucide-react";

import {
  PageShell,
  PageHeader,
  RequestCard,
  SelectField,
} from "@/components/community-member/ui";
import {
  BLOOD_TYPES,
  type BloodType,
  type RequestUrgency,
} from "@/features/request/types";
import { useRequestStore } from "@/stores/request.store";

const URGENCY_OPTIONS: RequestUrgency[] = ["Critical", "High", "Medium"];

export default function DonorOpenRequestsPage() {
  const { requests, donor, loadOpenRequests, loadDonorProfile } =
    useRequestStore();

  const [search, setSearch] = useState("");
  const [bloodType, setBloodType] = useState<BloodType | "">("");
  const [urgency, setUrgency] = useState<RequestUrgency | "">("");
  const [location, setLocation] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    void loadOpenRequests();
    void loadDonorProfile();
  }, [loadOpenRequests, loadDonorProfile]);

  const locationOptions = useMemo(
    () =>
      Array.from(new Set(requests.map((request) => request.hospital.state))).sort(),
    [requests],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        !query ||
        request.id.toLowerCase().includes(query) ||
        request.bloodType.toLowerCase().includes(query) ||
        request.hospital.name.toLowerCase().includes(query) ||
        request.hospital.lga.toLowerCase().includes(query) ||
        request.hospital.state.toLowerCase().includes(query);

      const matchesBloodType = !bloodType || request.bloodType === bloodType;
      const matchesUrgency = !urgency || request.urgency === urgency;
      const matchesLocation = !location || request.hospital.state === location;

      return (
        matchesSearch && matchesBloodType && matchesUrgency && matchesLocation
      );
    });
  }, [requests, search, bloodType, urgency, location]);

  const activeFilterCount = [bloodType, urgency, location].filter(Boolean).length;

  const clearFilters = () => {
    setBloodType("");
    setUrgency("");
    setLocation("");
  };

  return (
    <PageShell>
      <PageHeader
        title="Open Requests"
        description="Browse active blood requests from communities and find requests you can support."
      />

      <div className="mb-6 space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-(--radius-lg) border border-(--color-border-default) bg-white px-3">
            <Search className="size-4 shrink-0 text-(--color-text-muted)" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search hospital, blood type or reference"
              className="h-(--control-height-md) min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-(--color-text-muted)"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="rounded-(--radius-md) p-1 text-(--color-text-muted) hover:bg-(--color-surface-subtle) hover:text-(--color-text-primary)"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
            className="inline-flex min-h-(--control-height-md) shrink-0 items-center justify-center gap-2 rounded-(--radius-lg) border border-(--color-border-default) bg-white px-4 text-sm font-semibold text-(--color-text-primary) hover:bg-(--color-surface-subtle)"
          >
            <SlidersHorizontal className="size-4" />
            Filters
            {activeFilterCount > 0 ? (
              <span className="flex size-5 items-center justify-center rounded-full bg-(--color-brand-primary) text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </button>
        </div>

        {filtersOpen ? (
          <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-white p-4 shadow-(--shadow-sm)">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-(--color-brand-primary)" />
                <h2 className="text-sm font-bold">Filter requests</h2>
              </div>
              {activeFilterCount > 0 ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-semibold text-(--color-brand-primary) hover:text-(--color-brand-primary-hover)"
                >
                  Clear filters
                </button>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <SelectField
                label="Blood type"
                value={bloodType}
                onChange={(value) => setBloodType(value as BloodType | "")}
                placeholder="All blood types"
                options={BLOOD_TYPES.map((blood) => ({
                  value: blood,
                  label: blood,
                }))}
              />

              <SelectField
                label="Urgency"
                value={urgency}
                onChange={(value) => setUrgency(value as RequestUrgency | "")}
                placeholder="All urgency levels"
                options={URGENCY_OPTIONS.map((level) => ({
                  value: level,
                  label: level,
                }))}
              />

              <SelectField
                label="Location"
                value={location}
                onChange={setLocation}
                placeholder="All locations"
                options={locationOptions.map((state) => ({
                  value: state,
                  label: state,
                }))}
              />
            </div>
          </div>
        ) : null}
      </div>

      {donor?.cooldownUntil ? (
        <div className="mb-5 flex items-start gap-3 rounded-(--radius-lg) border-l-4 border-(--color-warning) bg-(--color-warning-soft) p-4">
          <Clock3 className="mt-0.5 size-4 shrink-0 text-(--color-warning)" />
          <div>
            <p className="text-sm font-semibold text-(--color-text-primary)">
              You&apos;re in donor cooldown
            </p>
            <p className="mt-0.5 text-xs text-(--color-text-secondary)">
              You can browse, but acceptance is disabled until eligibility
              returns.
            </p>
          </div>
        </div>
      ) : null}

      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-(--color-text-secondary)">
          {filtered.length} {filtered.length === 1 ? "request" : "requests"} found
        </p>
        {activeFilterCount > 0 ? (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-(--color-text-secondary) hover:text-(--color-brand-primary)"
          >
            <X className="size-3.5" />
            Reset
          </button>
        ) : null}
      </div>

      {requests.length === 0 ? (
        <div className="relative overflow-hidden rounded-(--radius-xl) border border-(--color-border-default) bg-white p-10 text-center">
          <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-(--color-blood-soft) blur-2xl" />

          <div className="relative mx-auto flex size-16 items-center justify-center rounded-full bg-(--color-blood-soft)">
            <Droplet className="size-7 text-(--color-blood)" />
          </div>

          <p className="relative mt-5 text-base font-bold text-(--color-text-primary)">
            No open requests nearby
          </p>
          <p className="relative mx-auto mt-2 max-w-sm text-sm leading-relaxed text-(--color-text-secondary)">
            When someone in your area needs your blood type, requests will
            appear here. Keep your location and availability up to date to get
            matched faster.
          </p>
          <Link
            href="/donor/dashboard"
            className="relative mt-6 inline-flex min-h-(--control-height-md) items-center justify-center rounded-(--radius-md) border border-(--color-border-default) bg-white px-5 text-sm font-semibold text-(--color-text-primary) transition-colors hover:bg-(--color-surface-subtle)"
          >
            Update my availability
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-(--radius-xl) border border-dashed border-(--color-border-default) bg-white px-6 py-12 text-center">
          <p className="text-sm font-semibold text-(--color-text-primary)">
            No requests match your filters
          </p>
          <p className="mt-1 text-sm text-(--color-text-secondary)">
            Try changing the search or clearing one or more filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              clearFilters();
            }}
            className="mt-4 inline-flex min-h-(--control-height-md) items-center justify-center rounded-(--radius-md) bg-(--color-brand-primary) px-4 text-sm font-semibold text-white hover:bg-(--color-brand-primary-hover)"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((request) => (
            <RequestCard
              key={request.id}
              request={request as never}
              href={`/donor/requests/${request.id}`}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}