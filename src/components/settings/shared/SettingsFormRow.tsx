import type { CSSProperties, ReactNode } from 'react'
import styles from './SettingsFormRow.module.css'

interface Props {
  children: ReactNode
  style?: CSSProperties
}

export function SettingsFormRow({ children, style }: Props) {
  return (
    <div className={styles.row} style={style}>
      {children}
    </div>
  )
}
