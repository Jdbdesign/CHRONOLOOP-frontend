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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto', height: '100%' }}>
      <ReportsPageHeader />
      <ReportsKpiGrid />

      {/* Row 1: Trend + Donut (2-col) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 14 }}>
        <RptTrendChart onHover={handleHover} onLeave={handleLeave} />
        <RptDonutChart />
      </div>

      {/* Row 2: Velocity + Priority + Team Output (3-col) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        <RptVelocityChart onHover={handleHover} onLeave={handleLeave} />
        <RptPriorityChart />
        <RptTeamOutput />
      </div>

      {/* Row 3: Burndown (full width) */}
      <RptBurndownChart onHover={handleHover} onLeave={handleLeave} />

      {/* Row 4: Tables (2-col) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <RptProjectTable />
        <RptSprintTable />
      </div>

      <RptChartTooltip x={tooltip.x} y={tooltip.y} content={tooltip.content} visible={tooltip.visible} />
    </div>
  )
}
