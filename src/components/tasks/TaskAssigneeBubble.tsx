import { Avatar } from '../ui/Avatar'
import styles from './TaskAssigneeBubble.module.css'

interface TaskAssigneeBubbleProps {
  assignee: string
  avatarSrc: string | undefined
  color: string
  size: number
  fontSize?: number
}

export function TaskAssigneeBubble({ assignee, avatarSrc, color, size, fontSize }: TaskAssigneeBubbleProps) {
  return (
    <Avatar
      src={avatarSrc}
      name={assignee}
      className={styles.bubble}
      style={{ width: size, height: size }}
      fallbackStyle={{ background: color, fontSize: fontSize ?? (size === 22 ? 8 : 9) }}
    />
  )
}
