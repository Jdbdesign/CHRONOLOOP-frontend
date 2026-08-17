import { useEffect, useRef } from 'react'
import { X, ExternalLink, MessageSquare, Plus, Mail, Clock, MapPin, Calendar } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { useTeamDetailStore } from '../../store/teamDetailStore'
import { useTeamStore } from '../../store/teamStore'
import { useToastStore } from '../../store/toastStore'
import styles from './TeamDetailPanel.module.css'

interface Props {
  onQuickView: (id: string) => void
}

export function TeamDetailPanel({ onQuickView }: Props) {
  const openMemberId = useTeamDetailStore((s) => s.openMemberId)
  const close = useTeamDetailStore((s) => s.close)
  const members = useTeamStore((s) => s.members)
  const showToast = useToastStore((s) => s.showToast)
  const panelRef = useRef<HTMLDivElement>(null)

  const member = openMemberId ? members.find((m) => m.id === openMemberId) : null
  const isOpen = !!member

  // Escape to close
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, close])

  const total = member ? member.completedTasks + member.activeTasks : 0
  const doneW = member && total ? Math.round((member.completedTasks / total) * 100) : 0
  const inpW = member && total ? Math.round((member.inProgressTasks / total) * 100) : 0
  const todoW = member && total ? Math.round((member.todoTasks / total) * 100) : 0

  return (
    <>
      <div className={`${styles.overlay}${isOpen ? ` ${styles.overlayOpen}` : ''}`} onClick={close} />
      <div ref={panelRef} className={`${styles.panel}${isOpen ? ` ${styles.panelOpen}` : ''}`}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>Member Profile</span>
          <div className={styles.headerActions}>
            <button type="button" className={styles.headerBtn} title="Quick View" aria-label="Quick View" onClick={() => { if (member) onQuickView(member.id) }}>
              <ExternalLink size={16} aria-hidden="true" />
            </button>
            <button type="button" className={styles.headerBtn} title="Close" aria-label="Close" onClick={close}>
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {member && (
          <>
            <div className={styles.body}>
              <div className={styles.hero}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar name={member.initials} fallbackStyle={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}88)`, width: 72, height: 72, fontSize: 24 }} style={{ width: 72, height: 72 }} />
                  <div style={{ position: 'absolute', bottom: 3, right: 3, width: 14, height: 14, borderRadius: '50%', border: '2.5px solid var(--bg-card)', background: member.online ? 'var(--accent-green)' : 'var(--text-muted)' }} />
                </div>
                <div>
                  <div className={styles.heroName}>{member.name}</div>
                  <div className={styles.heroRole}>{member.role} &middot; {member.dept}</div>
                  <div className={styles.heroStatus}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: member.online ? 'var(--accent-green)' : 'var(--text-muted)' }} />
                    {member.online ? 'Online now' : 'Offline'}
                  </div>
                </div>
              </div>

              <div>
                <div className={styles.sectionLabel}>Performance</div>
                <div className={styles.statGrid}>
                  <div className={styles.statCell}>
                    <div className={styles.statNum} style={{ color: member.color }}>{member.activeTasks}</div>
                    <div className={styles.statLbl}>Active Tasks</div>
                  </div>
                  <div className={styles.statCell}>
                    <div className={styles.statNum}>{member.completedTasks}</div>
                    <div className={styles.statLbl}>Completed</div>
                  </div>
                  <div className={styles.statCell}>
                    <div className={styles.statNum} style={{ color: 'var(--accent-teal)' }}>{member.velocity}</div>
                    <div className={styles.statLbl}>Velocity</div>
                  </div>
                </div>
              </div>

              <div>
                <div className={styles.sectionLabel}>Completion Rate</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Overall Progress</span>
                  <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: 'var(--text-primary)' }}>{member.completion}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--border-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${member.completion}%`, background: member.color, borderRadius: 3, transition: 'width 700ms var(--ease-out)' }} />
                </div>
              </div>

              <div>
                <div className={styles.sectionLabel}>Task Breakdown</div>
                <div className={styles.taskRow}>
                  <div className={styles.taskLbl}>Completed</div>
                  <div className={styles.taskTrack}><div className={styles.taskBar} style={{ width: `${doneW}%`, background: 'var(--accent-green)' }} /></div>
                  <div className={styles.taskNum}>{member.completedTasks}</div>
                </div>
                <div className={styles.taskRow}>
                  <div className={styles.taskLbl}>In Progress</div>
                  <div className={styles.taskTrack}><div className={styles.taskBar} style={{ width: `${inpW}%`, background: 'var(--accent-yellow)' }} /></div>
                  <div className={styles.taskNum}>{member.inProgressTasks}</div>
                </div>
                <div className={styles.taskRow}>
                  <div className={styles.taskLbl}>To Do</div>
                  <div className={styles.taskTrack}><div className={styles.taskBar} style={{ width: `${todoW}%`, background: 'var(--accent-blue)' }} /></div>
                  <div className={styles.taskNum}>{member.todoTasks}</div>
                </div>
              </div>

              <div>
                <div className={styles.sectionLabel}>Contact &amp; Info</div>
                <div className={styles.infoGrid}>
                  <div className={styles.infoCell}><div className={styles.infoLabel}>Email</div><div className={styles.infoVal}><Mail size={11} />{member.email}</div></div>
                  <div className={styles.infoCell}><div className={styles.infoLabel}>Timezone</div><div className={styles.infoVal}><Clock size={11} />{member.timezone}</div></div>
                  <div className={styles.infoCell}><div className={styles.infoLabel}>Location</div><div className={styles.infoVal}><MapPin size={11} />{member.location}</div></div>
                  <div className={styles.infoCell}><div className={styles.infoLabel}>Joined</div><div className={styles.infoVal}><Calendar size={11} />{member.joinDate}</div></div>
                </div>
              </div>

              <div>
                <div className={styles.sectionLabel}>Projects ({member.projects.length})</div>
                <div className={styles.projList}>
                  {member.projects.map((p) => (
                    <div key={p.name} className={styles.projItem}>
                      <div className={styles.projDot} style={{ background: p.color }} />
                      <div className={styles.projName}>{p.name}</div>
                      <div className={styles.projBadge}>Active</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className={styles.sectionLabel}>Recent Activity</div>
                {member.activity.map((a, i) => (
                  <div key={i} className={styles.actItem}>
                    <div className={styles.actDot} style={{ background: a.dot }} />
                    <div className={styles.actText}>{a.text}</div>
                    <div className={styles.actTime}>{a.time}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.footer}>
              <Button variant="secondary" style={{ flex: 1 }} onClick={() => showToast('Opening message composer\u2026', 'info', 2000)}>
                <MessageSquare size={13} /> Message
              </Button>
              <Button variant="primary" style={{ flex: 1 }} onClick={() => { close(); showToast('Opening task assignment\u2026', 'info', 2000) }}>
                <Plus size={13} /> Assign Task
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
