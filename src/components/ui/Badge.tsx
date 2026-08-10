import type { ReactNode } from 'react'
import styles from './Badge.module.css'

interface BadgeProps {
  children: ReactNode
}

export function Badge({ children }: BadgeProps) {
  return <span className={styles.badge}>{children}</span>
}
