export interface SettingsSession {
  icon: string
  device: string
  meta: string
  current?: boolean
}

export interface LoginActivity {
  success: boolean
  event: string
  meta: string
  time: string
}

export interface Invoice {
  description: string
  date: string
  amount: string
  status: 'paid' | 'pending'
}

export interface PendingInvite {
  email: string
  role: string
  sent: string
  expires: string
}

export const SESSIONS: SettingsSession[] = [
  { icon: 'monitor', device: 'Windows 11 — Chrome 124', meta: 'Lagos, Nigeria · 192.168.1.1', current: true },
  { icon: 'smartphone', device: 'iPhone 15 Pro — Safari', meta: 'Lagos, Nigeria · 2 hours ago' },
  { icon: 'tablet', device: 'iPad Air — Chrome', meta: 'Abuja, Nigeria · 3 days ago' },
  { icon: 'laptop', device: 'MacBook Air — Firefox 125', meta: 'London, UK · 1 week ago' },
]

export const LOGIN_ACTIVITY: LoginActivity[] = [
  { success: true, event: 'Successful login · Windows Chrome', meta: 'Lagos, Nigeria · 192.168.1.1', time: 'Today 09:14' },
  { success: true, event: 'Successful login · iPhone Safari', meta: 'Lagos, Nigeria · 102.88.64.22', time: 'Today 07:32' },
  { success: false, event: 'Failed login attempt · Unknown device', meta: 'Amsterdam, NL · 185.220.101.5', time: 'Jun 4 23:47' },
  { success: true, event: 'Successful login · MacBook Firefox', meta: 'London, UK · 81.102.154.1', time: 'May 28 14:05' },
]

export const INVOICES: Invoice[] = [
  { description: 'Professional Plan — June 2026', date: 'Jun 5, 2026', amount: '$49.00', status: 'paid' },
  { description: 'Professional Plan — May 2026', date: 'May 5, 2026', amount: '$49.00', status: 'paid' },
  { description: 'Professional Plan — April 2026', date: 'Apr 5, 2026', amount: '$49.00', status: 'paid' },
  { description: 'Professional Plan — March 2026', date: 'Mar 5, 2026', amount: '$49.00', status: 'paid' },
  { description: 'Starter → Pro Upgrade', date: 'Feb 12, 2026', amount: '$29.00', status: 'paid' },
]

export const PENDING_INVITES: PendingInvite[] = [
  { email: 'david.k@partner.io', role: 'Member', sent: 'Jun 3, 2026', expires: 'Jun 10' },
  { email: 'sarah.m@external.com', role: 'Viewer', sent: 'Jun 4, 2026', expires: 'Jun 11' },
]

export const ROLE_PERMISSIONS = [
  { perm: 'Create & edit tasks', owner: true, admin: true, member: true, viewer: false },
  { perm: 'Delete tasks', owner: true, admin: true, member: false, viewer: false },
  { perm: 'Manage projects', owner: true, admin: true, member: true, viewer: false },
  { perm: 'Manage sprints', owner: true, admin: true, member: true, viewer: false },
  { perm: 'Invite members', owner: true, admin: true, member: false, viewer: false },
  { perm: 'Manage integrations', owner: true, admin: true, member: false, viewer: false },
  { perm: 'Access billing', owner: true, admin: false, member: false, viewer: false },
  { perm: 'Delete workspace', owner: true, admin: false, member: false, viewer: false },
]

// Workspace role assignments for TEAM_MEMBERS (sourced from teamStore)
export const TEAM_ROLE_MAP: Record<string, { role: string; status: 'online' | 'away' | 'offline'; lastActive: string }> = {
  tm1: { role: 'Admin', status: 'online', lastActive: '5 min ago' },   // Aspen — Senior Dev
  tm2: { role: 'Member', status: 'online', lastActive: '12 min ago' }, // Roger — Designer
  tm3: { role: 'Member', status: 'away', lastActive: '45 min ago' },   // Marley — Full Stack
  tm4: { role: 'Admin', status: 'online', lastActive: '3 min ago' },   // Ryan — PM
  tm5: { role: 'Member', status: 'online', lastActive: '8 min ago' },  // Sofia — Frontend
  tm6: { role: 'Member', status: 'offline', lastActive: 'Yesterday' }, // David — DevOps
  tm7: { role: 'Member', status: 'away', lastActive: '2 hours ago' },  // Nina — Designer
  tm8: { role: 'Viewer', status: 'offline', lastActive: '3 days ago' }, // Marcus — Analyst
}
