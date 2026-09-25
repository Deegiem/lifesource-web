import { CAAuditLog } from './audit-log-types';
export const MOCK_AUDIT_LOGS: CAAuditLog[] = [
  { id: '1', actor: 'Emeka Adeyemi', action: 'Join request approved', entity: 'Danladi Usman', time: 'Dec 12 · 10:02', result: 'Success' },
  { id: '2', actor: 'Emeka Adeyemi', action: 'Member invited', entity: '+234 806 001 0002', time: 'Dec 11 · 14:30', result: 'Success' },
  { id: '3', actor: 'System', action: 'Request fulfilled', entity: 'REQ-0037', time: 'Dec 11 · 09:15', result: 'Success' },
  { id: '4', actor: 'Emeka Adeyemi', action: 'Escalation submitted', entity: 'ESC-0003', time: 'Dec 10 · 16:45', result: 'Success' },
  { id: '5', actor: 'Emeka Adeyemi', action: 'Join request rejected', entity: 'Aisha Bello', time: 'Dec 10 · 11:20', result: 'Success' },
  { id: '6', actor: 'System', action: 'Donor broadcast sent', entity: 'REQ-0041', time: 'Dec 10 · 10:32', result: 'Success' },
  { id: '7', actor: 'Emeka Adeyemi', action: 'Member removed', entity: 'Former Member', time: 'Dec 9 · 23:00', result: 'Success' },
  { id: '8', actor: 'System', action: 'Request created', entity: 'REQ-0041', time: 'Dec 9 · 10:02', result: 'Success' }
];
