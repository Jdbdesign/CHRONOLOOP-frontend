import { useState, useCallback } from 'react'
import { IntPageHeader } from '../components/integrations/IntPageHeader'
import { IntKpiGrid } from '../components/integrations/IntKpiGrid'
import { IntAppCatalogue } from '../components/integrations/IntAppCatalogue'
import { IntSyncSettings, IntActivityPanel, IntApiKeysPanel, IntUsagePanel, IntWebhooksPanel } from '../components/integrations/IntSidebarPanels'
import { ConnectModal } from '../components/integrations/modals/ConnectModal'
import { ManageModal } from '../components/integrations/modals/ManageModal'
import { NewApiKeyModal } from '../components/integrations/modals/NewApiKeyModal'

export function IntegrationsPage() {
  const [connectAppId, setConnectAppId] = useState<string | null>(null)
  const [manageAppId, setManageAppId] = useState<string | null>(null)
  const [isNewKeyOpen, setIsNewKeyOpen] = useState(false)

  const handleConnect = useCallback((id: string) => setConnectAppId(id), [])
  const handleManage = useCallback((id: string) => setManageAppId(id), [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto', height: '100%' }}>
      <IntPageHeader onNewKey={() => setIsNewKeyOpen(true)} />
      <IntKpiGrid />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14, alignItems: 'start' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <IntAppCatalogue onConnect={handleConnect} onManage={handleManage} />
          <IntSyncSettings />
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <IntActivityPanel />
          <IntApiKeysPanel />
          <IntUsagePanel />
          <IntWebhooksPanel />
        </div>
      </div>

      <ConnectModal appId={connectAppId} onClose={() => setConnectAppId(null)} />
      <ManageModal appId={manageAppId} onClose={() => setManageAppId(null)} />
      <NewApiKeyModal open={isNewKeyOpen} onClose={() => setIsNewKeyOpen(false)} />
    </div>
  )
}
