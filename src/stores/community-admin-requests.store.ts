
import { create } from 'zustand';
import { getCARequests, getCARequestsById } from '@/services/community-admin-requests.service';
import { CARequests } from '@/features/community-admin/requests-types';

interface CARequestsState {
  items: CARequests[];
  selectedItem: CARequests | null;
  isLoading: boolean;
  error: string | null;
  loadItems: () => Promise<void>;
  loadItem: (id: string) => Promise<void>;
}

export const useCARequestsStore = create<CARequestsState>((set) => ({
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,
  
  loadItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await getCARequests();
      set({ items, isLoading: false });
    } catch {
      set({ error: 'Failed to load', isLoading: false });
    }
  },
  
  loadItem: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const item = await getCARequestsById(id);
      set({ selectedItem: item, isLoading: false });
    } catch {
      set({ error: 'Failed to load', isLoading: false });
    }
  }
}));
