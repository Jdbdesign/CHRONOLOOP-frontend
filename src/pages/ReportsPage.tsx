import { useState, useCallback } from 'react'
import { ReportsPageHeader } from '../components/reports/ReportsPageHeader'
import { ReportsKpiGrid } from '../components/reports/ReportsKpiGrid'
import { RptTrendChart } from '../components/reports/RptTrendChart'
import { RptDonutChart } from '../components/reports/RptDonutChart'
import { RptVelocityChart } from '../components/reports/RptVelocityChart'
import { RptPriorityChart } from '../components/reports/RptPriorityChart'
import { RptTeamOutput } from '../components/reports/RptTeamOutput'
import { RptBurndownChart } from '../components/reports/RptBurndownChart'
import { RptProjectTable } from '../components/reports/RptProjectTable'
import { RptSprintTable } from '../components/reports/RptSprintTable'
import { RptChartTooltip } from '../components/reports/RptChartTooltip'
import styles from './ReportsPage.module.css'

export function ReportsPage() {
  const [tooltip, setTooltip] = useState({ x: 0, y: 0, content: '', visible: false })

  const handleHover = useCallback((x: number, y: number, content: string) => {
    if (content) setTooltip({ x, y, content, visible: true })
    else setTooltip((prev) => ({ ...prev, x, y }))
  }, [])

  const handleLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }))
  }, [])

  return (
    <div className={styles.page}>
      <ReportsPageHeader />
      <ReportsKpiGrid />

      {/* Row 1: Trend + Donut (2-col → 1-col on mobile) */}
      <div className={styles.chartRow2col}>
        <RptTrendChart onHover={handleHover} onLeave={handleLeave} />
        <RptDonutChart />
      </div>

      {/* Row 2: Velocity + Priority + Team Output (3-col → 2-col tablet → 1-col mobile) */}
      <div className={styles.chartRow3col}>
        <RptVelocityChart onHover={handleHover} onLeave={handleLeave} />
        <RptPriorityChart />
        <RptTeamOutput />
      </div>

      {/* Row 3: Burndown (full width — unchanged) */}
      <RptBurndownChart onHover={handleHover} onLeave={handleLeave} />

      {/* Row 4: Tables (2-col → 1-col on mobile) */}
      <div className={styles.tableRow2col}>
        <RptProjectTable />
        <RptSprintTable />
      </div>

      <RptChartTooltip x={tooltip.x} y={tooltip.y} content={tooltip.content} visible={tooltip.visible} />
    </div>
  )
}
