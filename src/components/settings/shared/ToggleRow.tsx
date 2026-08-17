import styles from './ToggleRow.module.css'

interface Props {
  label: string
  description?: string
  checked: boolean
  onChange: (val: boolean) => void
  disabled?: boolean
}

export function ToggleRow({ label, description, checked, onChange, disabled }: Props) {
  return (
    <div className={styles.row}>
      <div className={styles.info}>
        <div className={styles.label}>{label}</div>
        {description && <div className={styles.desc}>{description}</div>}
      </div>
      <label className={styles.toggle}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} />
        <span className={styles.slider} />
      </label>
    </div>
  )
}
