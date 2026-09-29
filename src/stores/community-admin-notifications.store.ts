import { create } from 'zustand';
import { getCANotifications } from '@/services/community-admin-notifications.service';
import { CANotification } from '@/features/community-admin/notifications-types';

interface CANotificationsState {
  items: CANotification[]; isLoading: boolean; error: string | null;
  loadItems: () => Promise<void>;
  markAllRead: () => void;
  markRead: (id: number) => void;
}
export const useCANotificationsStore = create<CANotificationsState>((set) => ({
  items: [], isLoading: false, error: null,
  loadItems: async () => {
    set({ isLoading: true, error: null });
    try { const items = await getCANotifications(); set({ items, isLoading: false }); }
    catch { set({ error: 'Failed', isLoading: false }); }
  },
  markAllRead: () => set(state => ({ items: state.items.map(n => ({ ...n, read: true })) })),
  markRead: (id) => set(state => ({ items: state.items.map(n => n.id === id ? ({ ...n, read: true }) : n) }))
}));
