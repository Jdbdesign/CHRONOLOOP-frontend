import { RPT_DATA } from '../../data/mockReportsData'
import { Dropdown } from '../ui/Dropdown'
import { useToastStore } from '../../store/toastStore'
import styles from './RptPanel.module.css'
import tableStyles from './RptTable.module.css'

const STATUS_COLORS: Record<string, string> = { 'Completed': '#22C55E', 'In Progress': '#4A90FF', 'On Hold': '#EAB308', 'Overdue': '#FF4D4D' }

export function RptProjectTable() {
  const showToast = useToastStore((s) => s.showToast)

  return (
    <div className={styles.panel} style={{ paddingBottom: 0, overflow: 'hidden' }}>
      <div className={tableStyles.panelHeader}>
        <h2 className={tableStyles.panelTitle}>Project Performance</h2>
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <button type="button" className={tableStyles.filterBtn}><span>All Projects</span></button>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item active onSelect={() => showToast('Filtered by: All Projects', 'info', 1200)}>All Projects</Dropdown.Item>
            <Dropdown.Item onSelect={() => showToast('Filtered by: In Progress', 'info', 1200)}>In Progress</Dropdown.Item>
            <Dropdown.Item onSelect={() => showToast('Filtered by: Completed', 'info', 1200)}>Completed</Dropdown.Item>
            <Dropdown.Item onSelect={() => showToast('Filtered by: On Hold', 'info', 1200)}>On Hold</Dropdown.Item>
            <Dropdown.Item onSelect={() => showToast('Filtered by: Overdue', 'info', 1200)}>Overdue</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      </div>
      <table className={tableStyles.table}>
        <thead>
          <tr><th>Project</th><th>Status</th><th>Progress</th><th>Due</th><th>Health</th></tr>
        </thead>
        <tbody>
          {RPT_DATA.projects.map((p) => {
            const pct = Math.round(p.done / p.total * 100)
            const barColor = p.health === 'good' ? '#00D4AA' : p.health === 'warn' ? '#EAB308' : '#FF4D4D'
            return (
              <tr key={p.name}>
                <td className={tableStyles.primary}>{p.name}</td>
                <td><span className={tableStyles.statusWrap}><span className={tableStyles.statusDot} style={{ background: STATUS_COLORS[p.status] || '#9a9a9a' }} />{p.status}</span></td>
                <td style={{ minWidth: 110 }}>
                  <div className={tableStyles.progressWrap}>
                    <div className={tableStyles.progressTrack}><div className={tableStyles.progressFill} style={{ width: `${pct}%`, background: barColor }} /></div>
                    <div className={tableStyles.progressPct}>{pct}%</div>
                  </div>
                </td>
                <td className={tableStyles.mono}>{p.due}</td>
                <td><span className={`${tableStyles.healthBadge} ${tableStyles[p.health]}`}>{p.health === 'good' ? '● Good' : p.health === 'warn' ? '● At Risk' : '● Critical'}</span></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
