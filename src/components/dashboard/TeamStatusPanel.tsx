// src/components/dashboard/TeamStatusPanel.tsx
import { useEffect, useState } from 'react'
import { ChevronDown, Layers, Briefcase, Plus } from 'lucide-react'
import { Dropdown } from '../ui/Dropdown'
import { Avatar } from '../ui/Avatar'
import { DASHBOARD_TEAM_MEMBERS } from '../../data/mockDashboardTeam'
import { DASHBOARD_CRITICAL_PROJECTS } from '../../data/mockDashboardProjects'
import { useDashboardUiStore } from '../../store/dashboardUiStore'
import { useToastStore } from '../../store/toastStore'
import styles from './TeamStatusPanel.module.css'

const ROLES = ['All roles', 'Developer', 'Designer', 'Manager']

export function TeamStatusPanel() {
  const openActivity = useDashboardUiStore((s) => s.openActivity)
  const openInvite = useDashboardUiStore((s) => s.openInvite)
  const openMember = useDashboardUiStore((s) => s.openMember)
  const showToast = useToastStore((s) => s.showToast)
  const [role, setRole] = useState('Developer')
  const [project, setProject] = useState('All Projects')
  const [projectLabel, setProjectLabel] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  function selectProject(title: string) {
    setProject(title)
    setProjectLabel(title)
    showToast(`Project: ${title}`, 'info', 2000)
  }

  useEffect(() => {
    const timer = setTimeout(() => setProgress(85), 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Team Status</h2>
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <button type="button" className={styles.roleBtn}>
              {role} <ChevronDown aria-hidden="true" />
            </button>
          </Dropdown.Trigger>
          <Dropdown.Content>
            {ROLES.map((r) => (
              <Dropdown.Item key={r} active={r === role} onSelect={() => { setRole(r); showToast(`Filtering by ${r}`, 'info', 2000) }}>
                {r}
              </Dropdown.Item>
            ))}
          </Dropdown.Content>
        </Dropdown.Root>
      </div>

      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <button type="button" className={styles.selectProjectBtn}>
            {projectLabel ?? 'Select Project'} <ChevronDown aria-hidden="true" />
          </button>
        </Dropdown.Trigger>
        <Dropdown.Content align="start">
          <Dropdown.Item icon={<Layers aria-hidden="true" />} active={project === 'All Projects'} onSelect={() => selectProject('All Projects')}>
            All Projects
          </Dropdown.Item>
          <Dropdown.Divider />
          {DASHBOARD_CRITICAL_PROJECTS.map((p) => (
            <Dropdown.Item key={p.id} icon={<Briefcase aria-hidden="true" />} active={project === p.title} onSelect={() => selectProject(p.title)}>
              {p.title}
            </Dropdown.Item>
          ))}
          <Dropdown.Item icon={<Briefcase aria-hidden="true" />} active={project === 'ChronoLoop Launch'} onSelect={() => selectProject('ChronoLoop Launch')}>
            ChronoLoop Launch
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>

      <div className={styles.progressRow}>
        <div className={styles.progressBarWrap}>
          <div className={styles.progressTrack} role="progressbar" aria-valuenow={85} aria-valuemin={0} aria-valuemax={100}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </div>
        <span className={styles.progressPct}>85%</span>
        <button type="button" className={styles.viewActivity} onClick={openActivity}>
          View Activity
        </button>
      </div>

      <div className={styles.grid}>
        {DASHBOARD_TEAM_MEMBERS.map((member) => (
          <button key={member.id} type="button" className={styles.member} onClick={() => openMember(member.id)}>
            <Avatar src={member.avatarSrc} name={member.name} style={{ width: 38, height: 38 }} />
            <div className={styles.memberName}>{member.name}</div>
            <div className={styles.memberEmail}>{member.gridEmail}</div>
          </button>
        ))}
        <button type="button" className={styles.addIndividual} onClick={openInvite}>
          <div className={styles.addCircle}><Plus aria-hidden="true" /></div>
          <div className={styles.addLabel}>Add Individual</div>
        </button>
      </div>
    </section>
  )
}
