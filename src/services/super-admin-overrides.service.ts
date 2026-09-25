import {
  getOverrideRequest,
  overrideRequests,
} from "@/features/super-admin/override-data";
import type { OverrideRequestDetail } from "@/features/super-admin/override-types";

export async function getOverrideRequests() {
  return overrideRequests;
}

export async function getOverrideRequestById(
  id: string
): Promise<OverrideRequestDetail | null> {
  return getOverrideRequest(id);
}

export async function decideOverride(
  id: string,
  decision: "approved" | "rejected"
) {
  // Replace with POST /overrides/:id/decision when backend is ready.
  return { id, status: decision };
}
