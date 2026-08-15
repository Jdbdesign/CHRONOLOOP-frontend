import { Zap, PlayCircle, CheckCircle2, TrendingUp, Target } from 'lucide-react'
import { StatCard } from '../dashboard/StatCard'
import { useSprintsStore } from '../../store/sprintsStore'
import styles from './SprintKpiGrid.module.css'

export function SprintKpiGrid() {
  const sprints = useSprintsStore((s) => s.sprints)

  const total = sprints.length
  const active = sprints.filter((s) => s.status === 'active').length
  const completed = sprints.filter((s) => s.status === 'completed').length
  const vSprints = sprints.filter((s) => s.velocity !== null)
  const avgVel = vSprints.length ? Math.round(vSprints.reduce((sum, s) => sum + (s.velocity ?? 0), 0) / vSprints.length) : 0
  const totalPts = sprints.reduce((sum, s) => sum + s.completedPoints, 0)

  return (
    <div className={styles.grid}>
      <StatCard index={0} label="Total Sprints" icon={<Zap aria-hidden="true" />} target={total} delta="up" deltaText="Across all projects" />
      <StatCard index={1} label="Active Sprint" icon={<PlayCircle aria-hidden="true" style={{ color: 'var(--accent-blue)' }} />} target={active} delta="up" deltaText="Currently running" iconBackground="rgba(74,144,255,0.12)" />
      <StatCard index={2} label="Completed" icon={<CheckCircle2 aria-hidden="true" style={{ color: 'var(--accent-green)' }} />} target={completed} delta="up" deltaText="Delivered" iconBackground="rgba(34,197,94,0.12)" />
      <StatCard index={3} label="Avg Velocity" icon={<TrendingUp aria-hidden="true" style={{ color: 'var(--accent-teal)' }} />} target={avgVel} delta="up" deltaText="Points per sprint" iconBackground="rgba(0,212,170,0.12)" />
      <StatCard index={4} label="Points Delivered" icon={<Target aria-hidden="true" style={{ color: 'var(--accent-purple)' }} />} target={totalPts} delta="up" deltaText="Story points total" iconBackground="rgba(168,85,247,0.12)" />
    </div>
  )
}
