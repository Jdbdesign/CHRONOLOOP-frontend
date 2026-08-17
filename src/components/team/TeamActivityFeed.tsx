import { useMemo } from 'react'
import { Avatar } from '../ui/Avatar'
import type { TeamMember } from '../../types/teamMember'
import { parseRelativeTime } from '../../data/mockTeamMembers'
import styles from './TeamActivityFeed.module.css'

interface Props {
  members: TeamMember[]
}

export function TeamActivityFeed({ members }: Props) {
  const feed = useMemo(() => {
    const all = members.flatMap((m) => m.activity.map((a) => ({ ...a, member: m })))
    all.sort((a, b) => parseRelativeTime(a.time) - parseRelativeTime(b.time))
    return all.slice(0, 8)
  }, [members])

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Team Activity</h2>
        <button type="button" className={styles.dropBtn}>
          <span>Today</span>
        </button>
      </div>
      <div>
        {feed.map((a, i) => (
          <div key={i} className={styles.item}>
            <Avatar name={a.member.initials} fallbackStyle={{ background: a.member.color, width: 28, height: 28, fontSize: 10 }} style={{ width: 28, height: 28 }} />
            <div className={styles.content}>
              <div className={styles.text}><strong>{a.member.name.split(' ')[0]}</strong> {a.text}</div>
              <div className={styles.time}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
