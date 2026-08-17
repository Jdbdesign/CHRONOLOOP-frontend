import { create } from 'zustand'
import type { PendingInvite } from '../data/mockSettingsData'
import { PENDING_INVITES } from '../data/mockSettingsData'

interface ProfileState {
  firstName: string
  lastName: string
  jobTitle: string
  department: string
  bio: string
  email: string
  phone: string
  linkedin: string
  twitter: string
  timezone: string
  language: string
  dateFormat: string
  timeFormat: string
}

interface WorkspaceState {
  name: string
  url: string
  description: string
  currency: string
  fiscalYear: string
  weekStart: string
  sprintDuration: string
  workFrom: string
  workTo: string
}

interface NotificationToggles {
  all: boolean
  dnd: boolean
  emailAssigned: boolean
  emailComments: boolean
  emailDue1: boolean
  emailDue3: boolean
  emailSprint: boolean
  emailProject: boolean
  emailWeekly: boolean
  appStatus: boolean
  appNewMember: boolean
  appIntegration: boolean
  appOverdue: boolean
  appMentions: boolean
}

interface SettingsState {
  // Profile
  profile: ProfileState
  updateProfile: (updates: Partial<ProfileState>) => void

  // Workspace
  workspace: WorkspaceState
  updateWorkspace: (updates: Partial<WorkspaceState>) => void

  // Notifications
  notifications: NotificationToggles
  toggleNotification: (key: keyof NotificationToggles) => void
  digestFrequency: string
  setDigestFrequency: (freq: string) => void

  // Appearance
  accentColor: string
  setAccentColor: (color: string) => void

  // Security — sessions
  sessions: { icon: string; device: string; meta: string; current?: boolean }[]
  revokeSession: (index: number) => void
  revokeAllSessions: () => void

  // Team & Roles
  roleOverrides: Record<string, string>
  setMemberRole: (memberId: string, role: string) => void
  pendingInvites: PendingInvite[]
  addInvite: (email: string, role: string) => void
  revokeInvite: (email: string) => void
  resendInvite: (email: string) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  profile: {
    firstName: 'Jacob',
    lastName: 'Solayinka',
    jobTitle: 'Product Manager',
    department: 'Product',
    bio: 'Building better products one sprint at a time. Passionate about team collaboration and clean workflows.',
    email: 'jacobsolayinka19@gmail.com',
    phone: '',
    linkedin: '',
    twitter: '',
    timezone: 'UTC+01:00 — West Africa Time (Lagos)',
    language: 'English (US)',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12-hour (AM/PM)',
  },
  updateProfile: (updates) => set((s) => ({ profile: { ...s.profile, ...updates } })),

  workspace: {
    name: 'ChronoLoop',
    url: 'my-workspace',
    description: "Managing product sprints, tasks, and team collaboration for ChronoLoop's core platform.",
    currency: 'USD — US Dollar',
    fiscalYear: 'January',
    weekStart: 'Monday',
    sprintDuration: '2 weeks',
    workFrom: '09:00',
    workTo: '18:00',
  },
  updateWorkspace: (updates) => set((s) => ({ workspace: { ...s.workspace, ...updates } })),

  notifications: {
    all: true, dnd: false,
    emailAssigned: true, emailComments: true, emailDue1: true, emailDue3: false, emailSprint: true, emailProject: true, emailWeekly: true,
    appStatus: true, appNewMember: true, appIntegration: true, appOverdue: true, appMentions: true,
  },
  toggleNotification: (key) => set((s) => ({ notifications: { ...s.notifications, [key]: !s.notifications[key] } })),
  digestFrequency: 'immediate',
  setDigestFrequency: (freq) => set({ digestFrequency: freq }),

  accentColor: '#4A90FF',
  setAccentColor: (color) => {
    document.documentElement.style.setProperty('--accent-blue', color)
    set({ accentColor: color })
  },

  sessions: [
    { icon: 'monitor', device: 'Windows 11 — Chrome 124', meta: 'Lagos, Nigeria · 192.168.1.1', current: true },
    { icon: 'smartphone', device: 'iPhone 15 Pro — Safari', meta: 'Lagos, Nigeria · 2 hours ago' },
    { icon: 'tablet', device: 'iPad Air — Chrome', meta: 'Abuja, Nigeria · 3 days ago' },
    { icon: 'laptop', device: 'MacBook Air — Firefox 125', meta: 'London, UK · 1 week ago' },
  ],
  revokeSession: (index) => set((s) => ({ sessions: s.sessions.filter((_, i) => i !== index) })),
  revokeAllSessions: () => set((s) => ({ sessions: s.sessions.filter((sess) => sess.current) })),

  roleOverrides: {},
  setMemberRole: (memberId, role) => set((s) => ({ roleOverrides: { ...s.roleOverrides, [memberId]: role } })),
  pendingInvites: [...PENDING_INVITES],
  addInvite: (email, role) => set((s) => ({
    pendingInvites: [...s.pendingInvites, { email, role, sent: 'Today', expires: 'In 7 days' }],
  })),
  revokeInvite: (email) => set((s) => ({ pendingInvites: s.pendingInvites.filter((inv) => inv.email !== email) })),
  resendInvite: () => { /* toast only — no real email system */ },
}))
