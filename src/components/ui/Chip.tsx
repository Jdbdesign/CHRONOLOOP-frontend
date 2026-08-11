import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import styles from './Chip.module.css'

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  dotColor: string
  count: number | string
  label: string
  active?: boolean
  onClick?: () => void
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { dotColor, count, label, active, onClick, className, ...rest },
  ref,
) {
  const combined = [styles.chip, active && styles.active, className].filter(Boolean).join(' ')

  return (
    <button
      ref={ref}
      type="button"
      className={combined}
      onClick={onClick}
      aria-pressed={Boolean(active)}
      {...rest}
    >
      <span className={styles.dot} style={{ background: dotColor }} aria-hidden="true" />
      <span className={styles.num}>{count}</span>
      <span className={styles.label}>{label}</span>
    </button>
  )
})

Chip.displayName = 'Chip'
