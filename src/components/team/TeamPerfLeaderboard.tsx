import { useMemo } from 'react'
import { Avatar } from '../ui/Avatar'
import type { TeamMember } from '../../types/teamMember'
import styles from './TeamPerfLeaderboard.module.css'

interface Props {
  members: TeamMember[]
}

export function TeamPerfLeaderboard({ members }: Props) {
  const sorted = useMemo(() => [...members].sort((a, b) => b.completion - a.completion), [members])

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Performance Leaderboard</h2>
        <button type="button" className={styles.dropBtn}>
          <span>This Sprint</span>
        </button>
      </div>
      <div className={styles.list}>
        {sorted.map((m, i) => (
          <div key={m.id} className={styles.row}>
            <div className={styles.rank}>#{i + 1}</div>
            <Avatar name={m.initials} fallbackStyle={{ background: m.color, width: 26, height: 26, fontSize: 9 }} style={{ width: 26, height: 26 }} />
            <div className={styles.name}>{m.name.split(' ')[0]} {m.name.split(' ')[1]?.[0]}.</div>
            <div className={styles.barWrap}><div className={styles.bar} style={{ width: `${m.completion}%`, background: m.color }} /></div>
            <div className={styles.pct}>{m.completion}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
