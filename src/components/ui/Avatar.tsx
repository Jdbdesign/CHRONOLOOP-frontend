import * as RadixAvatar from '@radix-ui/react-avatar'
import styles from './Avatar.module.css'

interface AvatarProps {
  src?: string
  name: string
  size?: 'sm' | 'md'
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  const first = words[0]?.[0] ?? ''
  const last = words.length > 1 ? words[words.length - 1][0] : ''
  return (first + last).toUpperCase()
}

export function Avatar({ src, name, size = 'sm' }: AvatarProps) {
  const sizeClass = size === 'md' ? styles.md : styles.sm

  return (
    <RadixAvatar.Root className={`${styles.root} ${sizeClass}`} title={name}>
      <RadixAvatar.Image className={styles.image} src={src} alt={name} />
      <RadixAvatar.Fallback className={styles.fallback}>{getInitials(name)}</RadixAvatar.Fallback>
    </RadixAvatar.Root>
  )
}
