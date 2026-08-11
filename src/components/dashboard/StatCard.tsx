// src/components/dashboard/StatCard.tsx
import type { ReactNode } from 'react'
import { Card } from '../ui/Card'
import { useCountUp } from '../../hooks/useCountUp'
import styles from './StatCard.module.css'

interface StatCardProps {
  label: string
  icon: ReactNode
  target: number
  delta: 'up' | 'down'
  deltaText: string
  index: number
  overdue?: boolean
}

export function StatCard({ label, icon, target, delta, deltaText, index, overdue }: StatCardProps) {
  const value = useCountUp(target)

  return (
    <Card
      hoverable
      tabIndex={0}
      className={styles.card}
      style={{ animationDelay: `${120 + index * 80}ms` }}
    >
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        <div className={[styles.iconWrap, overdue && styles.overdue].filter(Boolean).join(' ')}>{icon}</div>
      </div>
      <div className={styles.value}>{value}</div>
      <div className={[styles.delta, styles[delta]].join(' ')}>
        <span>{delta === 'up' ? '▲' : '▼'} {deltaText}</span>
      </div>
    </Card>
  )
}
