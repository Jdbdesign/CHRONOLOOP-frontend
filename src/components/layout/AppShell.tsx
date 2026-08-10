import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import styles from './AppShell.module.css'

export function AppShell() {
  return (
    <div className={styles.appLayout}>
      <Sidebar />
      <main className={styles.mainContent}>
        <TopBar />
        <div className={styles.contentScroll}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
