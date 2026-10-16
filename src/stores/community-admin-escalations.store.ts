import { create } from "zustand";

export interface EscalationRow {
  ref: string;
  related: string;
  type: string;
  reason: string;
  date: string;
  status: "Draft" | "Pending Review" | "Approved" | "Rejected";
}

interface State {
  items: EscalationRow[];
  isLoading: boolean;
  error: string | null;
  loadItems: () => Promise<void>;
  submit: (input: {
    type: "donor-cap" | "cooldown";
    relatedId: string;
    reason: string;
  }) => Promise<void>;
}

export const useCAEscalationsStore = create<State>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  loadItems: async () => {
    // No escalations endpoint in the supplied API yet.
    // When it exists, fetch here.
    set({ isLoading: false });
  },

  submit: async (input) => {
    // Stub for now — no backend endpoint.
    // When POST /community/escalations exists, call it here.
    const newRow: EscalationRow = {
      ref: `ESC-${Date.now().toString().slice(-6)}`,
      related: input.relatedId,
      type: input.type === "donor-cap" ? "More than 10 donors" : "Early cooldown reactivation",
      reason: input.reason,
      date: new Date().toLocaleDateString(),
      status: "Pending Review",
    };
    set((state) => ({ items: [newRow, ...state.items] }));
  },
}));