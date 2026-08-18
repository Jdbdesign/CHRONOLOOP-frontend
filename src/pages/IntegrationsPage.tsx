import { useState, useCallback } from 'react'
import { IntPageHeader } from '../components/integrations/IntPageHeader'
import { IntKpiGrid } from '../components/integrations/IntKpiGrid'
import { IntAppCatalogue } from '../components/integrations/IntAppCatalogue'
import { IntSyncSettings, IntActivityPanel, IntApiKeysPanel, IntUsagePanel, IntWebhooksPanel } from '../components/integrations/IntSidebarPanels'
import { ConnectModal } from '../components/integrations/modals/ConnectModal'
import { ManageModal } from '../components/integrations/modals/ManageModal'
import { NewApiKeyModal } from '../components/integrations/modals/NewApiKeyModal'
import styles from './IntegrationsPage.module.css'

export function IntegrationsPage() {
  const [connectAppId, setConnectAppId] = useState<string | null>(null)
  const [manageAppId, setManageAppId] = useState<string | null>(null)
  const [isNewKeyOpen, setIsNewKeyOpen] = useState(false)

  const handleConnect = useCallback((id: string) => setConnectAppId(id), [])
  const handleManage = useCallback((id: string) => setManageAppId(id), [])

  return (
    <div className={styles.page}>
      <IntPageHeader onNewKey={() => setIsNewKeyOpen(true)} />
      <IntKpiGrid />

      <div className={styles.twoCol}>
        {/* Left column */}
        <div className={styles.mainCol}>
          <IntAppCatalogue onConnect={handleConnect} onManage={handleManage} />
          <IntSyncSettings />
        </div>

        {/* Right sidebar */}
        <div className={styles.sideCol}>
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
