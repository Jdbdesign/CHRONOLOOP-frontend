import styles from './BoardTabSwitcher.module.css'

export interface BoardTab {
  key: string
  label: string
  color: string
  count: number
}

interface Props {
  tabs: BoardTab[]
  activeKey: string
  onChange: (key: string) => void
}

export function BoardTabSwitcher({ tabs, activeKey, onChange }: Props) {
  return (
    <div className={styles.wrapper} role="tablist" aria-label="Board columns">
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.tab}${isActive ? ` ${styles.tabActive}` : ''}`}
            style={isActive ? { background: tab.color } : undefined}
            onClick={() => onChange(tab.key)}
          >
            <span className={styles.dot} style={{ background: tab.color }} />
            {tab.label}
            <span className={styles.count}>{tab.count}</span>
          </button>
        )
      })}
    </div>
  )
}
