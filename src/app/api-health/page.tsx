"use client";

import { useState } from "react";
import { apiService } from "@/services/api.service";
import { getApiErrorMessage } from "@/lib/axios";

export default function ApiHealthPage() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const check = async () => {
    setBusy(true);
    try {
      const result = await apiService.health();
      setStatus(Object.entries(result).map(([key, value]) => `${key}: ${value}`).join(" · ") || "API is healthy.");
    } catch (error) {
      setStatus(getApiErrorMessage(error, "API health check failed."));
    } finally { setBusy(false); }
  };
  return <main className="mx-auto max-w-xl space-y-4 p-8"><h1 className="text-2xl font-bold">LIFESOURCE API health</h1><button disabled={busy} onClick={() => void check()} className="rounded-lg bg-(--color-brand-primary) px-4 py-2 font-semibold text-white">{busy ? "Checking…" : "Check API"}</button>{status ? <p role="status">{status}</p> : null}</main>;
}