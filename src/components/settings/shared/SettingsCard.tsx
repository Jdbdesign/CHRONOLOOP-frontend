import type { ReactNode } from 'react'
import styles from './SettingsCard.module.css'

interface Props {
  title: string
  subtitle?: string
  headerRight?: ReactNode
  children: ReactNode
  danger?: boolean
}

export function SettingsCard({ title, subtitle, headerRight, children, danger }: Props) {
  return (
    <div className={danger ? styles.dangerZone : styles.card}>
      <div className={styles.header}>
        <div>
          <div className={danger ? styles.dangerTitle : styles.title}>{title}</div>
          {subtitle && <div className={styles.sub}>{subtitle}</div>}
        </div>
        {headerRight}
      </div>
      {children}
    </div>
  )
}
