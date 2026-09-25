const fs = require('fs');
const path = require('path');

const featuresDir = path.join(__dirname, 'src/features/community-admin');
const servicesDir = path.join(__dirname, 'src/services');
const storesDir = path.join(__dirname, 'src/stores');

// 1. Audit Log
fs.writeFileSync(path.join(featuresDir, 'audit-log-types.ts'), `export interface CAAuditLog { id: string; actor: string; action: string; entity: string; time: string; result: string; }\n`);
fs.writeFileSync(path.join(featuresDir, 'audit-log-data.ts'), `import { CAAuditLog } from './audit-log-types';
export const MOCK_AUDIT_LOGS: CAAuditLog[] = [
  { id: '1', actor: 'Emeka Adeyemi', action: 'Join request approved', entity: 'Danladi Usman', time: 'Dec 12 · 10:02', result: 'Success' },
  { id: '2', actor: 'Emeka Adeyemi', action: 'Member invited', entity: '+234 806 001 0002', time: 'Dec 11 · 14:30', result: 'Success' },
  { id: '3', actor: 'System', action: 'Request fulfilled', entity: 'REQ-0037', time: 'Dec 11 · 09:15', result: 'Success' },
  { id: '4', actor: 'Emeka Adeyemi', action: 'Escalation submitted', entity: 'ESC-0003', time: 'Dec 10 · 16:45', result: 'Success' },
  { id: '5', actor: 'Emeka Adeyemi', action: 'Join request rejected', entity: 'Aisha Bello', time: 'Dec 10 · 11:20', result: 'Success' },
  { id: '6', actor: 'System', action: 'Donor broadcast sent', entity: 'REQ-0041', time: 'Dec 10 · 10:32', result: 'Success' },
  { id: '7', actor: 'Emeka Adeyemi', action: 'Member removed', entity: 'Former Member', time: 'Dec 9 · 23:00', result: 'Success' },
  { id: '8', actor: 'System', action: 'Request created', entity: 'REQ-0041', time: 'Dec 9 · 10:02', result: 'Success' }
];\n`);
fs.writeFileSync(path.join(servicesDir, 'community-admin-audit-log.service.ts'), `import { CAAuditLog } from '@/features/community-admin/audit-log-types';
import { MOCK_AUDIT_LOGS } from '@/features/community-admin/audit-log-data';
export const getCAAuditLogs = async (): Promise<CAAuditLog[]> => new Promise(res => setTimeout(() => res(MOCK_AUDIT_LOGS), 500));
export const getCAAuditLogById = async (id: string): Promise<CAAuditLog | null> => new Promise(res => setTimeout(() => res(MOCK_AUDIT_LOGS.find(i => i.id === id) || null), 500));\n`);
fs.writeFileSync(path.join(storesDir, 'community-admin-audit-log.store.ts'), `import { create } from 'zustand';
import { getCAAuditLogs, getCAAuditLogById } from '@/services/community-admin-audit-log.service';
import { CAAuditLog } from '@/features/community-admin/audit-log-types';

interface CAAuditLogState {
  items: CAAuditLog[]; isLoading: boolean; error: string | null;
  loadItems: () => Promise<void>;
}
export const useCAAuditLogStore = create<CAAuditLogState>((set) => ({
  items: [], isLoading: false, error: null,
  loadItems: async () => {
    set({ isLoading: true, error: null });
    try { const items = await getCAAuditLogs(); set({ items, isLoading: false }); }
    catch { set({ error: 'Failed', isLoading: false }); }
  }
}));\n`);

// 2. Notifications
fs.writeFileSync(path.join(featuresDir, 'notifications-types.ts'), `export interface CANotification { id: number; icon: string; title: string; desc: string; time: string; read: boolean; dest: string; }\n`);
fs.writeFileSync(path.join(featuresDir, 'notifications-data.ts'), `import { CANotification } from './notifications-types';
export const MOCK_NOTIFICATIONS: CANotification[] = [
  { id: 1, icon: '👤', title: 'New Join Request', desc: 'Danladi Usman requested to join Al-Hikmah Community.', time: '12 min ago', read: false, dest: 'ca-join-requests' },
  { id: 2, icon: '👤', title: 'New Join Request', desc: 'Ngozi Okonkwo requested to join Al-Hikmah Community.', time: '2 hrs ago', read: false, dest: 'ca-join-requests' },
  { id: 3, icon: '✓', title: 'Override Approved', desc: 'ESC-0002 early cooldown reactivation approved by Super Admin.', time: '3 hrs ago', read: false, dest: 'ca-escalations' },
  { id: 4, icon: '◈', title: 'Request Fulfilled', desc: 'REQ-0037 — B− blood request fulfilled. 3 donors confirmed.', time: '5 hrs ago', read: true, dest: 'ca-requests' },
  { id: 5, icon: '⚠', title: 'Escalation Submitted', desc: 'ESC-0003 is now pending Super Admin review.', time: '1 day ago', read: true, dest: 'ca-escalations' },
  { id: 6, icon: '✗', title: 'Override Rejected', desc: 'ESC-0001 more-than-10-donors request rejected by Super Admin.', time: '2 days ago', read: true, dest: 'ca-escalations' },
  { id: 7, icon: '✉', title: 'Invitation Sent', desc: 'Membership invite sent to +234 806 001 0002.', time: '2 days ago', read: true, dest: 'ca-members' },
];\n`);
fs.writeFileSync(path.join(servicesDir, 'community-admin-notifications.service.ts'), `import { CANotification } from '@/features/community-admin/notifications-types';
import { MOCK_NOTIFICATIONS } from '@/features/community-admin/notifications-data';
export const getCANotifications = async (): Promise<CANotification[]> => new Promise(res => setTimeout(() => res(MOCK_NOTIFICATIONS), 500));\n`);
fs.writeFileSync(path.join(storesDir, 'community-admin-notifications.store.ts'), `import { create } from 'zustand';
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
}));\n`);

console.log("Scaffold complete.");
