import { useState } from 'react'
import { Search } from 'lucide-react'
import { useIntegrationsStore } from '../../store/integrationsStore'
import { IntAppCard } from './IntAppCard'
import styles from './IntAppCatalogue.module.css'

const CATEGORIES = ['All', 'Communication', 'Development', 'Productivity', 'Design', 'Analytics', 'Storage']

interface Props {
  onConnect: (id: string) => void
  onManage: (id: string) => void
}

export function IntAppCatalogue({ onConnect, onManage }: Props) {
  const apps = useIntegrationsStore((s) => s.apps)
  const [activeCat, setActiveCat] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = apps.filter((a) => {
    const catMatch = activeCat === 'All' || a.category === activeCat
    const searchMatch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase())
    return catMatch && searchMatch
  })

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <div className={styles.panelTitle}>App Catalogue</div>
          <div className={styles.panelSub}>Connect your tools to supercharge your workflow</div>
        </div>
        <div className={styles.searchWrap}>
          <Search className={styles.searchIcon} />
          <input className={styles.searchInput} placeholder="Search apps\u2026" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className={styles.filterTabs}>
        {CATEGORIES.map((cat) => (
          <button key={cat} type="button" className={`${styles.filterTab}${activeCat === cat ? ` ${styles.filterTabActive}` : ''}`} onClick={() => setActiveCat(cat)}>{cat}</button>
        ))}
      </div>
      {filtered.length ? (
        <div className={styles.grid}>
          {filtered.map((app) => (
            <IntAppCard key={app.id} app={app} onConnect={onConnect} onManage={onManage} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>No integrations found</div>
      )}
    </div>
  )
}
