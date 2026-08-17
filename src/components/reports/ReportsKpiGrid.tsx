import { CheckCircle2, Percent, Zap, Clock, Briefcase } from 'lucide-react'
import type { ReactNode } from 'react'
import { RPT_DATA } from '../../data/mockReportsData'
import styles from './ReportsKpiGrid.module.css'

const ICON_MAP: Record<string, ReactNode> = {
  'check-circle-2': <CheckCircle2 size={15} />,
  'percent': <Percent size={15} />,
  'zap': <Zap size={15} />,
  'clock': <Clock size={15} />,
  'briefcase': <Briefcase size={15} />,
}

export function ReportsKpiGrid() {
  return (
    <div className={styles.grid}>
      {RPT_DATA.kpis.map((k) => {
        const dir = k.dir as 'up' | 'down' | 'neutral'
        const dirColor = dir === 'up' ? 'var(--accent-green)' : dir === 'down' ? 'var(--accent-red)' : 'var(--text-muted)'
        return (
          <div key={k.label} className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.label}>{k.label}</div>
              <div className={styles.iconWrap} style={{ background: k.bg }}>
                <span style={{ color: k.color }}>{ICON_MAP[k.icon]}</span>
              </div>
            </div>
            <div className={styles.value}>{k.value}</div>
            <div className={styles.deltaRow}>
              <span style={{ fontSize: 10, color: dirColor, display: 'flex', alignItems: 'center', gap: 2 }}>
                {dir === 'up' && <svg viewBox="0 0 10 10" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="2,8 5,2 8,8" /></svg>}
                {dir === 'down' && <svg viewBox="0 0 10 10" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="2,2 5,8 8,2" /></svg>}
                {k.delta}
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{k.sub}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
