import { forwardRef } from 'react'
import type { ComponentRef, CSSProperties } from 'react'
import * as RadixAvatar from '@radix-ui/react-avatar'
import styles from './Avatar.module.css'

interface AvatarProps {
  src?: string
  name: string
  size?: 'sm' | 'md'
  className?: string
  style?: CSSProperties
  fallbackStyle?: CSSProperties
  title?: string
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  const first = words[0]?.[0] ?? ''
  const last = words.length > 1 ? words[words.length - 1][0] : ''
  return (first + last).toUpperCase()
}

export const Avatar = forwardRef<ComponentRef<typeof RadixAvatar.Root>, AvatarProps>(
  function Avatar({ src, name, size = 'sm', className, style, fallbackStyle, title }, ref) {
    const sizeClass = size === 'md' ? styles.md : styles.sm
    const combined = [styles.root, sizeClass, className].filter(Boolean).join(' ')
    const displayTitle = title ?? name

    return (
      <RadixAvatar.Root ref={ref} className={combined} style={style} title={displayTitle}>
        <RadixAvatar.Image className={styles.image} src={src} alt={displayTitle} />
        <RadixAvatar.Fallback className={styles.fallback} style={fallbackStyle}>{getInitials(name)}</RadixAvatar.Fallback>
      </RadixAvatar.Root>
    )
  },
)

Avatar.displayName = 'Avatar'
