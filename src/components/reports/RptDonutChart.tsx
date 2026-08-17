import { RPT_DATA } from '../../data/mockReportsData'
import styles from './RptPanel.module.css'
import donutStyles from './RptDonutChart.module.css'

export function RptDonutChart() {
  const data = RPT_DATA.projectStatus
  const total = data.reduce((s, d) => s + d.value, 0)
  const r = 50, cx = 65, cy = 65, sw = 20
  const circ = 2 * Math.PI * r

  // Pre-compute cumulative fractions
  const cumFracs = data.reduce<number[]>((acc, _, i) => {
    const prev = i === 0 ? 0 : acc[i - 1] + data[i - 1].value / total
    acc.push(prev)
    return acc
  }, [])

  return (
    <div className={styles.panel}>
      <div className={styles.chartHeader}>
        <div>
          <div className={styles.chartTitle}>Project Status</div>
          <div className={styles.chartSubtitle}>All projects · current distribution</div>
        </div>
      </div>
      <div className={donutStyles.wrap}>
        <svg viewBox="0 0 130 130" width="130" height="130" style={{ flexShrink: 0 }}>
          {data.map((d, i) => {
            const frac = d.value / total
            const dash = frac * circ
            const gapLen = (1 - frac) * circ + 0.5
            const offset = -(cumFracs[i] * circ)
            return (
              <circle
                key={d.label}
                cx={cx} cy={cy} r={r}
                fill="none" stroke={d.color} strokeWidth={sw}
                strokeDasharray={`${dash.toFixed(2)} ${gapLen.toFixed(2)}`}
                strokeDashoffset={offset.toFixed(2)}
                transform={`rotate(-90 ${cx} ${cy})`}
                strokeLinecap="butt"
              />
            )
          })}
          <text x={cx} y={cy - 5} textAnchor="middle" fontFamily="Syne,sans-serif" fontSize="22" fontWeight="700" style={{ fill: 'var(--text-primary)' }}>{total}</text>
          <text x={cx} y={cy + 11} textAnchor="middle" fontSize="9" style={{ fill: 'var(--text-secondary)' }}>Projects</text>
        </svg>
        <div className={donutStyles.legend}>
          {data.map((d) => {
            const pct = Math.round(d.value / total * 100)
            return (
              <div key={d.label} className={donutStyles.legendItem}>
                <div className={donutStyles.swatch} style={{ background: d.color }} />
                <span>{d.label}</span>
                <span className={donutStyles.pct}>{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
