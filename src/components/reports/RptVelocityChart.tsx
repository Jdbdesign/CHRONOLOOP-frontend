import { RPT_DATA } from '../../data/mockReportsData'
import styles from './RptPanel.module.css'

interface Props {
  onHover?: (x: number, y: number, content: string) => void
  onLeave?: () => void
}

export function RptVelocityChart({ onHover, onLeave }: Props) {
  const data = RPT_DATA.sprintVelocity
  const svgW = 280, svgH = 140, padL = 28, padR = 8, padT = 10, padB = 24
  const cW = svgW - padL - padR, cH = svgH - padT - padB
  const maxPts = 50, n = data.length
  const groupW = cW / n
  const bw = Math.min(24, groupW * 0.55)
  const targetY = padT + cH - (40 / maxPts) * cH

  return (
    <div className={styles.panel}>
      <div className={styles.chartHeader}>
        <div>
          <div className={styles.chartTitle}>Sprint Velocity</div>
          <div className={styles.chartSubtitle}>Story points · last 6 sprints</div>
        </div>
      </div>
      <div className={styles.svgWrap}>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ color: 'var(--text-primary)', width: '100%' }}>
          {/* Grid */}
          {[0, 10, 20, 30, 40, 50].map((v) => {
            const y = padT + cH - (v / maxPts) * cH
            return (
              <g key={v}>
                <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
                {v > 0 && v % 20 === 0 && <text x={padL - 3} y={y + 3} textAnchor="end" fontSize="8" fill="currentColor" opacity="0.38">{v}</text>}
              </g>
            )
          })}
          <line x1={padL} y1={padT + cH} x2={svgW - padR} y2={padT + cH} stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />

          {/* Target line */}
          <line x1={padL} y1={targetY} x2={svgW - padR} y2={targetY} stroke="#EAB308" strokeWidth="1" strokeDasharray="4 3" opacity="0.55" />
          <text x={svgW - padR - 2} y={targetY - 3} textAnchor="end" fontSize="8" fill="#EAB308" opacity="0.7">Target</text>

          {/* Bars */}
          {data.map((d, i) => {
            const x = padL + i * groupW + (groupW - bw) / 2
            const h = (d.pts / maxPts) * cH
            const y = padT + cH - h
            const fill = d.pts >= 40 ? '#4A90FF' : '#A855F7'
            return (
              <g key={d.name}>
                <rect x={x} y={y} width={bw} height={h} rx="4" fill={fill} opacity="0.88" />
                <text x={x + bw / 2} y={y - 4} textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.65">{d.pts}</text>
                <text x={padL + i * groupW + groupW / 2} y={svgH - 5} textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.4">{d.name}</text>
                <rect
                  x={padL + i * groupW} y={padT} width={groupW} height={cH}
                  fill="transparent" style={{ cursor: 'crosshair' }}
                  onMouseEnter={(e) => {
                    const diff = d.pts - 40
                    onHover?.(e.clientX, e.clientY, `${d.name}\nVelocity: ${d.pts} pts\nvs Target: ${diff >= 0 ? '+' : ''}${diff}`)
                  }}
                  onMouseMove={(e) => onHover?.(e.clientX, e.clientY, '')}
                  onMouseLeave={onLeave}
                />
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
