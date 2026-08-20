import type { PendingInvite } from '../data/mockSettingsData'

export interface ProfileState {
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

export interface WorkspaceState {
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

export interface NotificationToggles {
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

export interface SettingsSessionEntry {
  icon: string
  device: string
  meta: string
  current?: boolean
}

export function mergeProfile(profile: ProfileState, updates: Partial<ProfileState>): Promise<ProfileState> {
  return Promise.resolve({ ...profile, ...updates })
}

export function mergeWorkspace(workspace: WorkspaceState, updates: Partial<WorkspaceState>): Promise<WorkspaceState> {
  return Promise.resolve({ ...workspace, ...updates })
}

export function toggleNotificationFlag(
  notifications: NotificationToggles,
  key: keyof NotificationToggles,
): Promise<NotificationToggles> {
  return Promise.resolve({ ...notifications, [key]: !notifications[key] })
}

export function withoutSessionAt(
  sessions: SettingsSessionEntry[],
  index: number,
): Promise<SettingsSessionEntry[]> {
  return Promise.resolve(sessions.filter((_, i) => i !== index))
}

export function keepOnlyCurrentSession(sessions: SettingsSessionEntry[]): Promise<SettingsSessionEntry[]> {
  return Promise.resolve(sessions.filter((session) => session.current))
}

export function setRoleOverride(
  roleOverrides: Record<string, string>,
  memberId: string,
  role: string,
): Promise<Record<string, string>> {
  return Promise.resolve({ ...roleOverrides, [memberId]: role })
}

export function buildNewInvite(email: string, role: string): Promise<PendingInvite> {
  return Promise.resolve({ email, role, sent: 'Today', expires: 'In 7 days' })
}

export function withoutInvite(invites: PendingInvite[], email: string): Promise<PendingInvite[]> {
  return Promise.resolve(invites.filter((inv) => inv.email !== email))
}
