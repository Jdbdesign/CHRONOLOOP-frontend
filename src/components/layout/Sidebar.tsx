// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CheckSquare,
  Briefcase,
  Zap,
  Users,
  BarChart2,
  CalendarDays,
  GitMerge,
  Settings,
  Sun,
  Moon,
  Mail,
} from 'lucide-react'
import { useThemeStore } from '../../store/themeStore'
import { BrandLogo } from './BrandLogo'
import styles from './Sidebar.module.css'

interface NavItemDef {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end?: boolean
}

// Label reads "Integration" (singular) to match the original index.html:3001-3003 exactly.
const NAV_ITEMS: NavItemDef[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/projects', label: 'Projects', icon: Briefcase },
  { to: '/sprints', label: 'Sprints', icon: Zap },
  { to: '/team', label: 'Team', icon: Users },
  { to: '/reports', label: 'Reports', icon: BarChart2 },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/integrations', label: 'Integration', icon: GitMerge },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <BrandLogo className={styles.brandLogo} />
      </div>

      <nav className={styles.nav} aria-label="Main navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
            }
          >
            <Icon size={16} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.sidebarBottom}>
        <div className={styles.themeToggle} role="group" aria-label="Theme toggle">
          <button
            type="button"
            className={theme === 'light' ? `${styles.themeBtn} ${styles.themeBtnActive}` : styles.themeBtn}
            onClick={() => setTheme('light')}
            aria-pressed={theme === 'light'}
          >
            <Sun size={13} aria-hidden="true" /> Light
          </button>
          <button
            type="button"
            className={theme === 'dark' ? `${styles.themeBtn} ${styles.themeBtnActive}` : styles.themeBtn}
            onClick={() => setTheme('dark')}
            aria-pressed={theme === 'dark'}
          >
            <Moon size={13} aria-hidden="true" /> Dark
          </button>
        </div>
        <button type="button" className={styles.inviteBtn}>
          <Mail size={14} aria-hidden="true" />
          Invite teammates
        </button>
      </div>
    </aside>
  )
}
