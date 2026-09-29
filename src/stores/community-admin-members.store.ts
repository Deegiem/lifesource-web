
import { create } from 'zustand';
import { getCAMembers, getCAMembersById } from '@/services/community-admin-members.service';
import { CAMembers } from '@/features/community-admin/members-types';

interface CAMembersState {
  items: CAMembers[];
  selectedItem: CAMembers | null;
  isLoading: boolean;
  error: string | null;
  loadItems: () => Promise<void>;
  loadItem: (id: string) => Promise<void>;
}

export const useCAMembersStore = create<CAMembersState>((set) => ({
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,
  
  loadItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await getCAMembers();
      set({ items, isLoading: false });
    } catch {
      set({ error: 'Failed to load', isLoading: false });
    }
  },
  
  loadItem: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const item = await getCAMembersById(id);
      set({ selectedItem: item, isLoading: false });
    } catch {
      set({ error: 'Failed to load', isLoading: false });
    }
  }
}));
