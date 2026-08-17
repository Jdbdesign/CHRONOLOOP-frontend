// src/components/layout/TopBar.tsx
import { useState } from 'react'
import { Search, Share2, Bell, ChevronDown, Menu, X } from 'lucide-react'
import { useSettingsStore } from '../../store/settingsStore'
import { useDrawerStore } from '../../store/drawerStore'
import styles from './TopBar.module.css'

interface TeamAvatar {
  src: string
  name: string
}

const TEAM_AVATARS: TeamAvatar[] = [
  { src: '/avatars/Ellipse 2.png', name: 'Aspen Herwitz' },
  { src: '/avatars/Ellipse 3.png', name: 'Roger Dokidis' },
  { src: '/avatars/Ellipse 4.png', name: 'Marley Vaccaro' },
  { src: '/avatars/Ellipse 5.png', name: 'Ryan Culhane' },
]

export function TopBar() {
  const fullName = useSettingsStore((s) => `${s.profile.firstName} ${s.profile.lastName}`)
  const toggleDrawer = useDrawerStore((s) => s.toggle)
  const isDrawerOpen = useDrawerStore((s) => s.isOpen)
  const [searchExpanded, setSearchExpanded] = useState(false)

  return (
    <header className={styles.topbar}>
      <button
        type="button"
        className={styles.hamburger}
        onClick={toggleDrawer}
        aria-label="Open navigation"
        aria-expanded={isDrawerOpen}
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      <div className={`${styles.searchWrap}${searchExpanded ? ` ${styles.searchExpanded}` : ''}`}>
        <Search
          className={styles.searchIcon}
          aria-hidden="true"
          onClick={() => setSearchExpanded(true)}
        />
        <input
          className={styles.searchInput}
          type="search"
          placeholder="Search"
          autoComplete="off"
          aria-label="Search"
          onBlur={() => setSearchExpanded(false)}
        />
        {searchExpanded && (
          <button
            type="button"
            className={styles.searchClose}
            onMouseDown={(e) => { e.preventDefault(); setSearchExpanded(false) }}
            aria-label="Close search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className={styles.topbarRight}>
        <div className={styles.avatarCluster}>
          {TEAM_AVATARS.map(({ src, name }) => (
            <div key={name} className={styles.avatarSm} title={name}>
              <img className={styles.avatarImg} src={src} alt={name} />
            </div>
          ))}
        </div>

        <button type="button" className={styles.shareBtn}>
          <Share2 size={13} aria-hidden="true" /> Share
        </button>

        <button type="button" className={styles.iconBtn} aria-label="Notifications">
          <Bell size={16} aria-hidden="true" />
          <span className={styles.notifBadge}>2</span>
        </button>

        <button type="button" className={styles.userAvatarBtn} aria-label={`${fullName}, account menu`}>
          <div className={styles.avatarMd}>
            <img className={styles.avatarImg} src="/avatars/Ellipse 1.png" alt={fullName} />
          </div>
          <ChevronDown size={14} aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
