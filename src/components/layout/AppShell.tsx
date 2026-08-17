import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { useDrawerStore } from '../../store/drawerStore'
import styles from './AppShell.module.css'

export function AppShell() {
  const isDrawerOpen = useDrawerStore((s) => s.isOpen)
  const closeDrawer = useDrawerStore((s) => s.close)
  const location = useLocation()

  // Close drawer on route change
  useEffect(() => {
    closeDrawer()
  }, [location.pathname, closeDrawer])

  // Close drawer on Escape
  useEffect(() => {
    if (!isDrawerOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isDrawerOpen, closeDrawer])

  return (
    <div className={styles.appLayout}>
      <div
        className={`${styles.drawerOverlay}${isDrawerOpen ? ` ${styles.drawerOverlayOpen}` : ''}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <Sidebar isDrawerOpen={isDrawerOpen} />
      <main className={styles.mainContent}>
        <TopBar />
        <div className={styles.contentScroll}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
