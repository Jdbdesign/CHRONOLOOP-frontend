import styles from './Chip.module.css'

interface ChipProps {
  dotColor: string
  count: number | string
  label: string
  active?: boolean
  onClick?: () => void
}

export function Chip({ dotColor, count, label, active, onClick }: ChipProps) {
  const combined = [styles.chip, active && styles.active].filter(Boolean).join(' ')

  return (
    <button type="button" className={combined} onClick={onClick} aria-pressed={Boolean(active)}>
      <span className={styles.dot} style={{ background: dotColor }} aria-hidden="true" />
      <span className={styles.num}>{count}</span>
      <span className={styles.label}>{label}</span>
    </button>
  )
}
