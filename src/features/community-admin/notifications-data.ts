import { CANotification } from './notifications-types';
export const MOCK_NOTIFICATIONS: CANotification[] = [
  { id: 1, icon: '👤', title: 'New Join Request', desc: 'Danladi Usman requested to join Al-Hikmah Community.', time: '12 min ago', read: false, dest: 'ca-join-requests' },
  { id: 2, icon: '👤', title: 'New Join Request', desc: 'Ngozi Okonkwo requested to join Al-Hikmah Community.', time: '2 hrs ago', read: false, dest: 'ca-join-requests' },
  { id: 3, icon: '✓', title: 'Override Approved', desc: 'ESC-0002 early cooldown reactivation approved by Super Admin.', time: '3 hrs ago', read: false, dest: 'ca-escalations' },
  { id: 4, icon: '◈', title: 'Request Fulfilled', desc: 'REQ-0037 — B− blood request fulfilled. 3 donors confirmed.', time: '5 hrs ago', read: true, dest: 'ca-requests' },
  { id: 5, icon: '⚠', title: 'Escalation Submitted', desc: 'ESC-0003 is now pending Super Admin review.', time: '1 day ago', read: true, dest: 'ca-escalations' },
  { id: 6, icon: '✗', title: 'Override Rejected', desc: 'ESC-0001 more-than-10-donors request rejected by Super Admin.', time: '2 days ago', read: true, dest: 'ca-escalations' },
  { id: 7, icon: '✉', title: 'Invitation Sent', desc: 'Membership invite sent to +234 806 001 0002.', time: '2 days ago', read: true, dest: 'ca-members' },
];
