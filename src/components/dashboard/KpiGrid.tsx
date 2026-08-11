// src/components/dashboard/KpiGrid.tsx
import { ClipboardList, Briefcase, FileText, ClipboardCheck, Clock } from 'lucide-react'
import { StatCard } from './StatCard'
import { useTasksStore } from '../../store/tasksStore'
import styles from './KpiGrid.module.css'

export function KpiGrid() {
  const todoKpiOverride = useTasksStore((s) => s.todoKpiOverride)

  return (
    <div className={styles.grid}>
      <StatCard index={0} label="To-do" icon={<ClipboardList aria-hidden="true" />} target={todoKpiOverride ?? 45} delta="up" deltaText="Up 4.5% since yesterday" />
      <StatCard index={1} label="Total Project" icon={<Briefcase aria-hidden="true" />} target={10} delta="up" deltaText="Up 4.5% since yesterday" />
      <StatCard index={2} label="Assigned Tasks" icon={<FileText aria-hidden="true" />} target={15} delta="up" deltaText="Up 4.5% since past week" />
      <StatCard index={3} label="Completed Task" icon={<ClipboardCheck aria-hidden="true" />} target={7} delta="down" deltaText="Down 12% since three days" />
      <StatCard index={4} label="Overdue Tasks" icon={<Clock aria-hidden="true" />} target={5} delta="down" deltaText="Up 10% since yesterday" overdue />
    </div>
  )
}
