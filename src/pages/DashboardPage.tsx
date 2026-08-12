import { DashboardHeader } from '../components/dashboard/DashboardHeader'
import { KpiGrid } from '../components/dashboard/KpiGrid'
import { CriticalProjectsPanel } from '../components/dashboard/CriticalProjectsPanel'
import { TeamStatusPanel } from '../components/dashboard/TeamStatusPanel'
import { CalendarWidget } from '../components/dashboard/CalendarWidget'
import { AddTaskModal } from '../components/dashboard/modals/AddTaskModal'
import { ActivityModal } from '../components/dashboard/modals/ActivityModal'
import { InviteModal } from '../components/dashboard/modals/InviteModal'
import { MemberDetailModal } from '../components/dashboard/modals/MemberDetailModal'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.visuallyHidden}>Dashboard</h1>

      <DashboardHeader />
      <KpiGrid />

      <div className={styles.middleRow}>
        <CriticalProjectsPanel />
        <TeamStatusPanel />
      </div>

      <CalendarWidget />

      <AddTaskModal />
      <ActivityModal />
      <InviteModal />
      <MemberDetailModal />
    </div>
  )
}
