
import { create } from 'zustand';
import { getCAJoinRequests, getCAJoinRequestsById } from '@/services/community-admin-join-requests.service';
import { CAJoinRequests } from '@/features/community-admin/join-requests-types';

interface CAJoinRequestsState {
  items: CAJoinRequests[];
  selectedItem: CAJoinRequests | null;
  isLoading: boolean;
  error: string | null;
  loadItems: () => Promise<void>;
  loadItem: (id: string) => Promise<void>;
  updateItemStatus: (name: string, status: string) => void;
}

export const useCAJoinRequestsStore = create<CAJoinRequestsState>((set) => ({
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,
  
  loadItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await getCAJoinRequests();
      set({ items, isLoading: false });
    } catch {
      set({ error: 'Failed to load', isLoading: false });
    }
  },
  
  loadItem: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const item = await getCAJoinRequestsById(id);
      set({ selectedItem: item, isLoading: false });
    } catch {
      set({ error: 'Failed to load', isLoading: false });
    }
  },
  
  updateItemStatus: (name: string, status: string) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.name === name ? { ...item, status } : item
      ),
    }));
  }
}));
