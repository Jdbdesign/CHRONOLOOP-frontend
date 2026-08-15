import { Zap } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { useAnimatedWidth } from '../../hooks/useAnimatedWidth'
import type { Sprint } from '../../types/sprint'
import styles from './SprintBoardCard.module.css'

interface SprintBoardCardProps {
  sprint: Sprint
  onOpenDetail: (id: string) => void
}

export function SprintBoardCard({ sprint, onOpenDetail }: SprintBoardCardProps) {
  const fillWidth = useAnimatedWidth(sprint.progress)

  return (
    <div className={styles.card} onClick={() => onOpenDetail(sprint.id)}>
      <div className={styles.num}>{sprint.number}</div>
      <div className={styles.name}>{sprint.name}</div>
      <div className={styles.goal}>{sprint.goal}</div>
      <div className={styles.footer}>
        <span className={styles.pts}><Zap aria-hidden="true" />{sprint.completedPoints}/{sprint.storyPoints} pts</span>
        <div className={styles.footerAvatars}>
          {sprint.team.slice(0, 2).map((m) => (
            <Avatar key={m.i} name={m.i} className={styles.avatar} fallbackStyle={{ background: m.c, fontSize: 8 }} style={{ width: 20, height: 20 }} />
          ))}
        </div>
      </div>
      <div style={{ marginTop: 8 }}>
        <div className={styles.progTrack}><div className={styles.progFill} style={{ background: sprint.color, width: `${fillWidth}%` }} /></div>
      </div>
    </div>
  )
}
