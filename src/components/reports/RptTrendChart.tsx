import { RPT_DATA } from '../../data/mockReportsData'
import styles from './RptPanel.module.css'

interface Props {
  onHover?: (x: number, y: number, content: string) => void
  onLeave?: () => void
}

export function RptTrendChart({ onHover, onLeave }: Props) {
  const data = RPT_DATA.weeklyTasks
  const labels = RPT_DATA.weekLabels
  const svgW = 560, svgH = 160, padL = 32, padR = 10, padT = 10, padB = 30
  const cW = svgW - padL - padR, cH = svgH - padT - padB
  const maxVal = 40, n = data.length
  const groupW = cW / n
  const bw = Math.max(8, Math.min(16, groupW * 0.38))
  const gap = 3

  return (
    <div className={styles.panel}>
      <div className={styles.chartHeader}>
        <div>
          <div className={styles.chartTitle}>Task Completion Trend</div>
          <div className={styles.chartSubtitle}>Weekly completed vs assigned — last 12 weeks</div>
        </div>
        <div className={styles.legend}>
          <div className={styles.legendItem}><div className={styles.legendDot} style={{ background: '#00D4AA' }} /><span>Completed</span></div>
          <div className={styles.legendItem}><div className={styles.legendDot} style={{ background: '#4A90FF', opacity: 0.45 }} /><span>Assigned</span></div>
        </div>
      </div>
      <div className={styles.svgWrap}>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="xMidYMid meet" style={{ color: 'var(--text-primary)' }}>
          {/* Layer 1: Grid lines (bottom) */}
          <g>
            {[0, 10, 20, 30, 40].map((v) => {
              const y = padT + cH - (v / maxVal) * cH
              return (
                <g key={v}>
                  <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
                  {v > 0 && <text x={padL - 4} y={y + 3} textAnchor="end" fontSize="8" fill="currentColor" opacity="0.4">{v}</text>}
                </g>
              )
            })}
            <line x1={padL} y1={padT + cH} x2={svgW - padR} y2={padT + cH} stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
          </g>

          {/* Layer 2: Bars (middle) */}
          <g>
            {data.map(([total, comp], i) => {
              const gx = padL + i * groupW
              const cx = gx + (groupW - bw * 2 - gap) / 2
              const th = (total / maxVal) * cH
              const ch = (comp / maxVal) * cH
              return (
                <g key={i}>
                  <rect x={cx} y={padT + cH - th} width={bw} height={th} rx="3" fill="#4A90FF" opacity="0.3" />
                  <rect x={cx + bw + gap} y={padT + cH - ch} width={bw} height={ch} rx="3" fill="#00D4AA" opacity="0.9" />
                </g>
              )
            })}
          </g>

          {/* Layer 3: X-axis labels */}
          <g>
            {data.map((_, i) => {
              if (i % 2 !== 0) return null
              const gx = padL + i * groupW
              return <text key={i} x={gx + groupW / 2} y={svgH - 6} textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.38">{labels[i]}</text>
            })}
          </g>

          {/* Layer 4: Hover zones (top — invisible, captures mouse events) */}
          <g>
            {data.map(([total, comp], i) => {
              const gx = padL + i * groupW
              return (
                <rect
                  key={i}
                  x={gx} y={padT} width={groupW} height={cH}
                  fill="transparent" style={{ cursor: 'crosshair' }}
                  onMouseEnter={(e) => {
                    const rate = Math.round(comp / total * 100)
                    onHover?.(e.clientX, e.clientY, `${labels[i]}\nCompleted: ${comp}\nAssigned: ${total}\nRate: ${rate}%`)
                  }}
                  onMouseMove={(e) => onHover?.(e.clientX, e.clientY, '')}
                  onMouseLeave={onLeave}
                />
              )
            })}
          </g>
        </svg>
      </div>
    </div>
  )
}
