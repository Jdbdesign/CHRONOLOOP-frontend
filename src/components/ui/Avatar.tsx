import { forwardRef } from 'react'
import type { ComponentRef } from 'react'
import * as RadixAvatar from '@radix-ui/react-avatar'
import styles from './Avatar.module.css'

interface AvatarProps {
  src?: string
  name: string
  size?: 'sm' | 'md'
  className?: string
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  const first = words[0]?.[0] ?? ''
  const last = words.length > 1 ? words[words.length - 1][0] : ''
  return (first + last).toUpperCase()
}

export const Avatar = forwardRef<ComponentRef<typeof RadixAvatar.Root>, AvatarProps>(
  function Avatar({ src, name, size = 'sm', className }, ref) {
    const sizeClass = size === 'md' ? styles.md : styles.sm
    const combined = [styles.root, sizeClass, className].filter(Boolean).join(' ')

    return (
      <RadixAvatar.Root ref={ref} className={combined} title={name}>
        <RadixAvatar.Image className={styles.image} src={src} alt={name} />
        <RadixAvatar.Fallback className={styles.fallback}>{getInitials(name)}</RadixAvatar.Fallback>
      </RadixAvatar.Root>
    )
  },
)

Avatar.displayName = 'Avatar'
