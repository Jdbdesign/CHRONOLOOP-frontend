// src/components/layout/TopBar.tsx
import { Search, Share2, Bell, ChevronDown } from 'lucide-react'
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
  return (
    <header className={styles.topbar}>
      <div className={styles.searchWrap}>
        <Search className={styles.searchIcon} aria-hidden="true" />
        <input
          className={styles.searchInput}
          type="search"
          placeholder="Search"
          autoComplete="off"
          aria-label="Search"
        />
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

        <button type="button" className={styles.userAvatarBtn} aria-label="Jacob Solayinka, account menu">
          <div className={styles.avatarMd}>
            <img className={styles.avatarImg} src="/avatars/Ellipse 1.png" alt="Jacob Solayinka" />
          </div>
          <ChevronDown size={16} aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
