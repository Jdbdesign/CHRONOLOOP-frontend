import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  children: ReactNode
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { hoverable, className, children, ...rest },
  ref,
) {
  const combined = [styles.card, hoverable && styles.hoverable, className].filter(Boolean).join(' ')

  return (
    <div ref={ref} className={combined} {...rest}>
      {children}
    </div>
  )
})

Card.displayName = 'Card'
