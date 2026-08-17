import { RPT_DATA } from '../../data/mockReportsData'
import { Dropdown } from '../ui/Dropdown'
import { useToastStore } from '../../store/toastStore'
import styles from './RptPanel.module.css'
import tableStyles from './RptTable.module.css'

const STATUS_COLORS: Record<string, string> = { 'Completed': '#22C55E', 'Active': '#4A90FF', 'Planned': '#666' }

export function RptSprintTable() {
  const showToast = useToastStore((s) => s.showToast)

  return (
    <div className={styles.panel} style={{ paddingBottom: 0, overflow: 'hidden' }}>
      <div className={tableStyles.panelHeader}>
        <h2 className={tableStyles.panelTitle}>Sprint Summary</h2>
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <button type="button" className={tableStyles.filterBtn}><span>Last 6 Sprints</span></button>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item active onSelect={() => showToast('Showing last 6 sprints', 'info', 1200)}>Last 6 Sprints</Dropdown.Item>
            <Dropdown.Item onSelect={() => showToast('Showing last 4 sprints', 'info', 1200)}>Last 4 Sprints</Dropdown.Item>
            <Dropdown.Item onSelect={() => showToast('Showing last 3 sprints', 'info', 1200)}>Last 3 Sprints</Dropdown.Item>
            <Dropdown.Item onSelect={() => showToast('Showing all sprints', 'info', 1200)}>All Sprints</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      </div>
      <table className={tableStyles.table}>
        <thead>
          <tr><th>Sprint</th><th>Duration</th><th>Velocity</th><th>vs Target</th><th>Status</th></tr>
        </thead>
        <tbody>
          {RPT_DATA.sprints.map((s) => {
            const vel = s.velocity !== null ? s.velocity : '\u2014'
            let vsTarget = <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{'\u2014'}</span>
            if (s.velocity !== null) {
              const diff = s.velocity - s.target
              vsTarget = <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: diff >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>{diff >= 0 ? '+' : ''}{diff}</span>
            }
            return (
              <tr key={s.name}>
                <td className={tableStyles.primary}>{s.name}</td>
                <td style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{s.start} – {s.end}</td>
                <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 11 }}>{vel}</td>
                <td>{vsTarget}</td>
                <td><span className={tableStyles.statusWrap}><span className={tableStyles.statusDot} style={{ background: STATUS_COLORS[s.status] || '#9a9a9a' }} />{s.status}</span></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
