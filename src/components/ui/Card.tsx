import type { HTMLAttributes, ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  children: ReactNode
}

export function Card({ hoverable, className, children, ...rest }: CardProps) {
  const combined = [styles.card, hoverable && styles.hoverable, className].filter(Boolean).join(' ')

  return (
    <div className={combined} {...rest}>
      {children}
    </div>
  )
}
