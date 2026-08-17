import { RPT_DATA } from '../../data/mockReportsData'
import styles from './RptPanel.module.css'

interface Props {
  onHover?: (x: number, y: number, content: string) => void
  onLeave?: () => void
}

export function RptBurndownChart({ onHover, onLeave }: Props) {
  const data = RPT_DATA.burndown
  const svgW = 560, svgH = 160, padL = 32, padR = 12, padT = 10, padB = 28
  const cW = svgW - padL - padR, cH = svgH - padT - padB
  const maxPts = 80, days = 13
  const xOf = (d: number) => padL + (d / days) * cW
  const yOf = (v: number) => padT + cH - (v / maxPts) * cH

  const idealPts = `${xOf(0).toFixed(1)},${yOf(80).toFixed(1)} ${xOf(13).toFixed(1)},${yOf(0).toFixed(1)}`
  const actualPts = data.map((p) => `${xOf(p.day).toFixed(1)},${yOf(p.actual).toFixed(1)}`).join(' ')
  const areaPts = `${xOf(0).toFixed(1)},${yOf(0).toFixed(1)} ${actualPts} ${xOf(13).toFixed(1)},${yOf(0).toFixed(1)}`

  return (
    <div className={styles.panel}>
      <div className={styles.chartHeader}>
        <div>
          <div className={styles.chartTitle}>Sprint Burndown — Sprint 5: Team &amp; Reports</div>
          <div className={styles.chartSubtitle}>Remaining story points vs ideal line · 2-week sprint · 80 pts</div>
        </div>
        <div className={styles.legend}>
          <div className={styles.legendItem}><div className={styles.legendLine} style={{ background: '#666' }} /><span>Ideal</span></div>
          <div className={styles.legendItem}><div className={styles.legendLine} style={{ background: '#FF8C42' }} /><span>Actual</span></div>
        </div>
      </div>
      <div className={styles.svgWrap}>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ color: 'var(--text-primary)', width: '100%' }}>
          {/* Grid */}
          {[0, 20, 40, 60, 80].map((v) => {
            const y = yOf(v)
            return (
              <g key={v}>
                <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
                <text x={padL - 4} y={y + 3} textAnchor="end" fontSize="8" fill="currentColor" opacity="0.38">{v}</text>
              </g>
            )
          })}
          <line x1={padL} y1={padT + cH} x2={svgW - padR} y2={padT + cH} stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />

          {/* X-axis labels */}
          {Array.from({ length: 7 }, (_, i) => i * 2).map((d) => (
            <text key={d} x={xOf(d)} y={svgH - 6} textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.38">D{d}</text>
          ))}

          {/* Ideal line */}
          <polyline points={idealPts} fill="none" stroke="#666" strokeWidth="1.5" strokeDasharray="5 4" />

          {/* Area + actual line */}
          <polygon points={areaPts} fill="#FF8C42" opacity="0.08" />
          <polyline points={actualPts} fill="none" stroke="#FF8C42" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

          {/* Dots */}
          {data.map((p) => (
            <circle key={p.day} cx={xOf(p.day)} cy={yOf(p.actual)} r="3" fill="#FF8C42" strokeWidth="1.5" style={{ stroke: 'var(--bg-card)' }} />
          ))}

          {/* Hover areas */}
          {data.map((p, i) => (
            <circle
              key={`hover-${i}`}
              cx={xOf(p.day)} cy={yOf(p.actual)} r="9"
              fill="transparent" style={{ cursor: 'crosshair' }}
              onMouseEnter={(e) => {
                const delta = p.actual - p.ideal
                const status = delta > 0 ? `▲ Behind by ${delta} pts` : delta < 0 ? `▼ Ahead by ${Math.abs(delta)} pts` : '✓ On track'
                onHover?.(e.clientX, e.clientY, `Day ${p.day}\nIdeal: ${p.ideal} pts\nActual: ${p.actual} pts\n${status}`)
              }}
              onMouseMove={(e) => onHover?.(e.clientX, e.clientY, '')}
              onMouseLeave={onLeave}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}
