import { RPT_DATA } from '../../data/mockReportsData'
import styles from './RptPanel.module.css'
import barStyles from './RptPriorityChart.module.css'

export function RptPriorityChart() {
  const data = RPT_DATA.priorityBreakdown
  const max = Math.max(...data.map((d) => d.count))

  return (
    <div className={styles.panel}>
      <div className={styles.chartHeader}>
        <div>
          <div className={styles.chartTitle}>Priority Breakdown</div>
          <div className={styles.chartSubtitle}>Open tasks by priority level</div>
        </div>
      </div>
      <div className={barStyles.bars}>
        {data.map((d) => (
          <div key={d.label} className={barStyles.row}>
            <div className={barStyles.label}>{d.label}</div>
            <div className={barStyles.track}>
              <div className={barStyles.fill} style={{ width: `${(d.count / max * 100).toFixed(1)}%`, background: d.color }} />
            </div>
            <div className={barStyles.count}>{d.count}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
