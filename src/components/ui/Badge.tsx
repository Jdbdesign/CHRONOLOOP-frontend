import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import styles from './Badge.module.css'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, children, ...rest },
  ref,
) {
  const combined = [styles.badge, className].filter(Boolean).join(' ')

  return (
    <span ref={ref} className={combined} {...rest}>
      {children}
    </span>
  )
})

Badge.displayName = 'Badge'
