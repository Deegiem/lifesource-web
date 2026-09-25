
import { create } from 'zustand';
import { getCAEscalations, getCAEscalationsById } from '@/services/community-admin-escalations.service';
import { CAEscalations } from '@/features/community-admin/escalations-types';

interface CAEscalationsState {
  items: CAEscalations[];
  selectedItem: CAEscalations | null;
  isLoading: boolean;
  error: string | null;
  loadItems: () => Promise<void>;
  loadItem: (id: string) => Promise<void>;
}

export const useCAEscalationsStore = create<CAEscalationsState>((set) => ({
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,
  
  loadItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await getCAEscalations();
      set({ items, isLoading: false });
    } catch {
      set({ error: 'Failed to load', isLoading: false });
    }
  },
  
  loadItem: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const item = await getCAEscalationsById(id);
      set({ selectedItem: item, isLoading: false });
    } catch {
      set({ error: 'Failed to load', isLoading: false });
    }
  }
}));
