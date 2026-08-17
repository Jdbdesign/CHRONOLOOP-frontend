import { create } from 'zustand'
import type { IntApp, IntWebhook, IntSyncRule, IntApiKey } from '../data/mockIntegrations'
import { INT_APPS, INT_WEBHOOKS, INT_SYNC_ROWS, INT_KEYS } from '../data/mockIntegrations'

interface NewApiKeyInput {
  label: string
  scope: string
  expires: string
  rateLimit: string
  ipWhitelist: string
}

interface IntegrationsState {
  apps: IntApp[]
  webhooks: IntWebhook[]
  syncRules: IntSyncRule[]
  apiKeys: IntApiKey[]
  connectApp: (id: string) => void
  disconnectApp: (id: string) => void
  toggleWebhook: (index: number) => void
  removeWebhook: (index: number) => void
  toggleSyncRule: (index: number) => void
  addApiKey: (input: NewApiKeyInput) => void
}

export const useIntegrationsStore = create<IntegrationsState>((set) => ({
  apps: INT_APPS,
  webhooks: [...INT_WEBHOOKS],
  syncRules: [...INT_SYNC_ROWS],
  apiKeys: [...INT_KEYS],

  connectApp: (id) => set((state) => ({
    apps: state.apps.map((a) => a.id === id ? { ...a, status: 'connected' as const, syncedAt: 'Just now', users: 1 } : a),
  })),

  disconnectApp: (id) => set((state) => ({
    apps: state.apps.map((a) => a.id === id ? { ...a, status: 'available' as const, syncedAt: null, users: 0, calls: 0 } : a),
  })),

  toggleWebhook: (index) => set((state) => ({
    webhooks: state.webhooks.map((w, i) => i === index ? { ...w, active: !w.active } : w),
  })),

  removeWebhook: (index) => set((state) => ({
    webhooks: state.webhooks.filter((_, i) => i !== index),
  })),

  toggleSyncRule: (index) => set((state) => ({
    syncRules: state.syncRules.map((r, i) => i === index ? { ...r, on: !r.on } : r),
  })),

  addApiKey: (input) => set((state) => ({
    apiKeys: [...state.apiKeys, {
      id: `k_${Date.now()}`,
      label: input.label,
      val: `ck_new_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022${Math.random().toString(36).slice(-4)}`,
      scope: input.scope,
      created: 'Today',
      expires: input.expires || 'Never',
    }],
  })),
}))
