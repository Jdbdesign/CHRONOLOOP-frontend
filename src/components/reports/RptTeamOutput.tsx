import { Avatar } from '../ui/Avatar'
import { RPT_DATA } from '../../data/mockReportsData'
import styles from './RptPanel.module.css'
import teamStyles from './RptTeamOutput.module.css'

export function RptTeamOutput() {
  const data = RPT_DATA.teamOutput
  const max = Math.max(...data.map((d) => d.total))

  return (
    <div className={styles.panel}>
      <div className={styles.chartHeader}>
        <div>
          <div className={styles.chartTitle}>Team Output</div>
          <div className={styles.chartSubtitle}>Completed tasks this period</div>
        </div>
      </div>
      <div className={teamStyles.rows}>
        {data.map((d) => (
          <div key={d.initials} className={teamStyles.row}>
            <Avatar name={d.initials} fallbackStyle={{ background: d.color, width: 22, height: 22, fontSize: 8 }} style={{ width: 22, height: 22 }} />
            <div className={teamStyles.name}>{d.name}</div>
            <div className={teamStyles.track}>
              <div className={teamStyles.fill} style={{ width: `${(d.completed / max * 100).toFixed(1)}%`, background: d.color, opacity: 0.85 }} />
            </div>
            <div className={teamStyles.count}>{d.completed}/{d.total}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
