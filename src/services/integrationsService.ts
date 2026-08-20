import type { IntApp, IntWebhook, IntSyncRule, IntApiKey } from '../data/mockIntegrations'

export interface NewApiKeyInput {
  label: string
  scope: string
  expires: string
  rateLimit: string
  ipWhitelist: string
}

export function connectAppStatus(apps: IntApp[], id: string): Promise<IntApp[]> {
  return Promise.resolve(
    apps.map((a) => (a.id === id ? { ...a, status: 'connected' as const, syncedAt: 'Just now', users: 1 } : a)),
  )
}

export function disconnectAppStatus(apps: IntApp[], id: string): Promise<IntApp[]> {
  return Promise.resolve(
    apps.map((a) => (a.id === id ? { ...a, status: 'available' as const, syncedAt: null, users: 0, calls: 0 } : a)),
  )
}

export function toggleWebhookAt(webhooks: IntWebhook[], index: number): Promise<IntWebhook[]> {
  return Promise.resolve(webhooks.map((w, i) => (i === index ? { ...w, active: !w.active } : w)))
}

export function removeWebhookAt(webhooks: IntWebhook[], index: number): Promise<IntWebhook[]> {
  return Promise.resolve(webhooks.filter((_, i) => i !== index))
}

export function toggleSyncRuleAt(rules: IntSyncRule[], index: number): Promise<IntSyncRule[]> {
  return Promise.resolve(rules.map((r, i) => (i === index ? { ...r, on: !r.on } : r)))
}

export function buildNewApiKey(input: NewApiKeyInput): Promise<IntApiKey> {
  return Promise.resolve({
    id: `k_${Date.now()}`,
    label: input.label,
    val: `ck_new_••••••••${Math.random().toString(36).slice(-4)}`,
    scope: input.scope,
    created: 'Today',
    expires: input.expires || 'Never',
  })
}
