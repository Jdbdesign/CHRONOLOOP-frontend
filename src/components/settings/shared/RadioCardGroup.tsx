import type { ReactNode } from 'react'
import styles from './RadioCardGroup.module.css'

interface RadioOption {
  id: string
  icon: ReactNode
  label: string
}

interface Props {
  options: RadioOption[]
  value: string
  onChange: (id: string) => void
}

export function RadioCardGroup({ options, value, onChange }: Props) {
  return (
    <div className={styles.group}>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={`${styles.card}${value === opt.id ? ` ${styles.active}` : ''}`}
          onClick={() => onChange(opt.id)}
        >
          <div className={styles.icon}>{opt.icon}</div>
          <div className={styles.label}>{opt.label}</div>
        </button>
      ))}
    </div>
  )
}
