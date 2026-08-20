import { create } from 'zustand'
import type { PendingInvite } from '../data/mockSettingsData'
import { PENDING_INVITES } from '../data/mockSettingsData'
import * as settingsService from '../services/settingsService'
import type {
  NotificationToggles,
  ProfileState,
  SettingsSessionEntry,
  WorkspaceState,
} from '../services/settingsService'

interface SettingsState {
  // Profile
  profile: ProfileState
  updateProfile: (updates: Partial<ProfileState>) => Promise<void>

  // Workspace
  workspace: WorkspaceState
  updateWorkspace: (updates: Partial<WorkspaceState>) => Promise<void>

  // Notifications
  notifications: NotificationToggles
  toggleNotification: (key: keyof NotificationToggles) => Promise<void>
  digestFrequency: string
  setDigestFrequency: (freq: string) => void

  // Appearance
  accentColor: string
  setAccentColor: (color: string) => void

  // Security — sessions
  sessions: SettingsSessionEntry[]
  revokeSession: (index: number) => Promise<void>
  revokeAllSessions: () => Promise<void>

  // Team & Roles
  roleOverrides: Record<string, string>
  setMemberRole: (memberId: string, role: string) => Promise<void>
  pendingInvites: PendingInvite[]
  addInvite: (email: string, role: string) => Promise<void>
  revokeInvite: (email: string) => Promise<void>
  resendInvite: (email: string) => void
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
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
  updateProfile: async (updates) => {
    await settingsService.mergeProfile(get().profile, updates)
    set((state) => ({ profile: { ...state.profile, ...updates } }))
  },

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
  updateWorkspace: async (updates) => {
    await settingsService.mergeWorkspace(get().workspace, updates)
    set((state) => ({ workspace: { ...state.workspace, ...updates } }))
  },

  notifications: {
    all: true,
    dnd: false,
    emailAssigned: true,
    emailComments: true,
    emailDue1: true,
    emailDue3: false,
    emailSprint: true,
    emailProject: true,
    emailWeekly: true,
    appStatus: true,
    appNewMember: true,
    appIntegration: true,
    appOverdue: true,
    appMentions: true,
  },
  toggleNotification: async (key) => {
    const notifications = await settingsService.toggleNotificationFlag(get().notifications, key)
    set({ notifications })
  },
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
  revokeSession: async (index) => {
    await settingsService.withoutSessionAt(get().sessions, index)
    set((state) => ({ sessions: state.sessions.filter((_, i) => i !== index) }))
  },
  revokeAllSessions: async () => {
    await settingsService.keepOnlyCurrentSession(get().sessions)
    set((state) => ({ sessions: state.sessions.filter((session) => session.current) }))
  },

  roleOverrides: {},
  setMemberRole: async (memberId, role) => {
    await settingsService.setRoleOverride(get().roleOverrides, memberId, role)
    set((state) => ({ roleOverrides: { ...state.roleOverrides, [memberId]: role } }))
  },
  pendingInvites: [...PENDING_INVITES],
  addInvite: async (email, role) => {
    const newInvite = await settingsService.buildNewInvite(email, role)
    set((s) => ({ pendingInvites: [...s.pendingInvites, newInvite] }))
  },
  revokeInvite: async (email) => {
    await settingsService.withoutInvite(get().pendingInvites, email)
    set((state) => ({ pendingInvites: state.pendingInvites.filter((inv) => inv.email !== email) }))
  },
  resendInvite: () => {
    /* toast only — no real email system */
  },
}))
