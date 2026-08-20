import { create } from 'zustand'
import type { IntApp, IntWebhook, IntSyncRule, IntApiKey } from '../data/mockIntegrations'
import { INT_APPS, INT_WEBHOOKS, INT_SYNC_ROWS, INT_KEYS } from '../data/mockIntegrations'
import * as integrationsService from '../services/integrationsService'
import type { NewApiKeyInput } from '../services/integrationsService'

interface IntegrationsState {
  apps: IntApp[]
  webhooks: IntWebhook[]
  syncRules: IntSyncRule[]
  apiKeys: IntApiKey[]
  connectApp: (id: string) => Promise<void>
  disconnectApp: (id: string) => Promise<void>
  toggleWebhook: (index: number) => Promise<void>
  removeWebhook: (index: number) => Promise<void>
  toggleSyncRule: (index: number) => Promise<void>
  addApiKey: (input: NewApiKeyInput) => Promise<void>
}

export const useIntegrationsStore = create<IntegrationsState>((set, get) => ({
  apps: INT_APPS,
  webhooks: [...INT_WEBHOOKS],
  syncRules: [...INT_SYNC_ROWS],
  apiKeys: [...INT_KEYS],

  connectApp: async (id) => {
    const apps = await integrationsService.connectAppStatus(get().apps, id)
    set({ apps })
  },

  disconnectApp: async (id) => {
    const apps = await integrationsService.disconnectAppStatus(get().apps, id)
    set({ apps })
  },

  toggleWebhook: async (index) => {
    const webhooks = await integrationsService.toggleWebhookAt(get().webhooks, index)
    set({ webhooks })
  },

  removeWebhook: async (index) => {
    await integrationsService.removeWebhookAt(get().webhooks, index)
    set((state) => ({ webhooks: state.webhooks.filter((_, i) => i !== index) }))
  },

  toggleSyncRule: async (index) => {
    const syncRules = await integrationsService.toggleSyncRuleAt(get().syncRules, index)
    set({ syncRules })
  },

  addApiKey: async (input) => {
    const newKey = await integrationsService.buildNewApiKey(input)
    set((state) => ({ apiKeys: [...state.apiKeys, newKey] }))
  },
}))
