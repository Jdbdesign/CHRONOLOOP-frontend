import styles from './RptChartTooltip.module.css'

interface Props {
  x: number
  y: number
  content: string
  visible: boolean
}

export function RptChartTooltip({ x, y, content, visible }: Props) {
  if (!visible || !content) return null

  // Position to the right of cursor, clamp to viewport
  const left = x + 14
  const top = y - 20

  return (
    <div className={styles.tooltip} style={{ left, top }}>
      {content.split('\n').map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  )
}
