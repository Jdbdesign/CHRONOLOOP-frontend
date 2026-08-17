import { describe, it, expect, beforeEach } from 'vitest'
import { useIntegrationsStore } from './integrationsStore'

describe('integrationsStore', () => {
  beforeEach(() => {
    useIntegrationsStore.setState({
      apps: useIntegrationsStore.getState().apps.map((a) =>
        a.id === 'google-drive' ? { ...a, status: 'available' } : a
      ),
    })
  })

  it('connectApp changes status to connected', () => {
    useIntegrationsStore.getState().connectApp('google-drive')
    const app = useIntegrationsStore.getState().apps.find((a) => a.id === 'google-drive')
    expect(app?.status).toBe('connected')
  })

  it('disconnectApp changes status to available', () => {
    useIntegrationsStore.getState().connectApp('google-drive')
    useIntegrationsStore.getState().disconnectApp('google-drive')
    const app = useIntegrationsStore.getState().apps.find((a) => a.id === 'google-drive')
    expect(app?.status).toBe('available')
  })

  it('toggleWebhook flips active state', () => {
    const before = useIntegrationsStore.getState().webhooks[2].active
    useIntegrationsStore.getState().toggleWebhook(2)
    expect(useIntegrationsStore.getState().webhooks[2].active).toBe(!before)
  })

  it('removeWebhook removes by index', () => {
    const countBefore = useIntegrationsStore.getState().webhooks.length
    useIntegrationsStore.getState().removeWebhook(0)
    expect(useIntegrationsStore.getState().webhooks.length).toBe(countBefore - 1)
  })

  it('toggleSyncRule flips on state', () => {
    const before = useIntegrationsStore.getState().syncRules[3].on
    useIntegrationsStore.getState().toggleSyncRule(3)
    expect(useIntegrationsStore.getState().syncRules[3].on).toBe(!before)
  })

  it('addApiKey adds a new key to the list', () => {
    const countBefore = useIntegrationsStore.getState().apiKeys.length
    useIntegrationsStore.getState().addApiKey({ label: 'Test Key', scope: 'Read Only', expires: 'Dec 31', rateLimit: '100', ipWhitelist: '' })
    expect(useIntegrationsStore.getState().apiKeys.length).toBe(countBefore + 1)
    expect(useIntegrationsStore.getState().apiKeys.at(-1)?.label).toBe('Test Key')
  })
})
