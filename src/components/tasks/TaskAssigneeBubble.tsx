import { Avatar } from '../ui/Avatar'
import styles from './TaskAssigneeBubble.module.css'

interface TaskAssigneeBubbleProps {
  assignee: string
  avatarSrc: string | undefined
  color: string
  size: 26 | 22
}

export function TaskAssigneeBubble({ assignee, avatarSrc, color, size }: TaskAssigneeBubbleProps) {
  // Format the two-letter assignee initials as a spaced name so Avatar's getInitials works correctly
  const spacedName = assignee.length === 2 ? `${assignee[0]} ${assignee[1]}` : assignee

  return (
    <Avatar
      src={avatarSrc}
      name={spacedName}
      title={assignee}
      className={styles.bubble}
      style={{ width: size, height: size }}
      fallbackStyle={{ background: color, fontSize: size === 22 ? 8 : 9 }}
    />
  )
}
