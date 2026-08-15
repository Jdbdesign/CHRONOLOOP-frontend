import { Zap, Calendar, Clock, Briefcase } from 'lucide-react'
import { useSprintsStore } from '../../store/sprintsStore'
import { useAnimatedStrokeOffset } from '../../hooks/useAnimatedStrokeOffset'
import { Avatar } from '../ui/Avatar'
import styles from './ActiveSprintBanner.module.css'

const RADIUS = 42
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function ActiveSprintBanner() {
  const sprint = useSprintsStore((s) => s.sprints.find((x) => x.status === 'active'))

  const offset = useAnimatedStrokeOffset(CIRCUMFERENCE, sprint?.progress ?? 0)

  if (!sprint) return null

  const burndownPoints = sprint.burndown.filter((v): v is number => v !== null)
  const n = burndownPoints.length
  const W = 160, H = 36
  const polylinePoints = n > 1
    ? burndownPoints.map((v, i) => `${(i / (n - 1)) * W},${H - (v / sprint.storyPoints) * H}`).join(' ')
    : ''

  return (
    <div className={styles.banner}>
      <div className={styles.bannerInner}>
        <div className={styles.bannerLeft}>
          <span className={styles.bannerBadge}><Zap aria-hidden="true" /> ACTIVE SPRINT</span>
          <div className={styles.bannerName}>{sprint.number} — {sprint.name}</div>
          <div className={styles.bannerGoal}>{sprint.goal}</div>
          <div className={styles.bannerMeta}>
            <span className={styles.bannerMetaItem}><Calendar aria-hidden="true" />{sprint.startDate} — <span className={styles.metaAccent}>{sprint.endDate}</span></span>
            <span className={styles.bannerMetaItem}><Clock aria-hidden="true" /><span className={styles.metaAccent}>{sprint.daysLeft} days</span> remaining</span>
            <span className={styles.bannerMetaItem}><Briefcase aria-hidden="true" />{sprint.project}</span>
            <span className={styles.bannerMetaItem} style={{ gap: 0 }}>
              {sprint.team.map((m) => (
                <Avatar key={m.i} name={m.i} fallbackStyle={{ background: m.c, fontSize: 8 }} style={{ width: 20, height: 20, borderColor: 'var(--bg-card)' }} />
              ))}
            </span>
          </div>
        </div>

        <div className={styles.ringWrap}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <svg className={styles.ringSvg} width="100" height="100" viewBox="0 0 100 100">
              <circle className={styles.ringBg} cx="50" cy="50" r={RADIUS} />
              <circle
                className={styles.ringFill}
                cx="50" cy="50" r={RADIUS}
                stroke={sprint.color}
                strokeDasharray={CIRCUMFERENCE.toFixed(2)}
                strokeDashoffset={offset.toFixed(2)}
              />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
              <div className={styles.ringPct}>{sprint.progress}%</div>
              <div className={styles.ringLabel}>complete</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', textAlign: 'center' }}>{sprint.completedPoints}/{sprint.storyPoints} pts</div>
        </div>

        <div className={styles.taskBreakdown}>
          <div className={styles.breakdownTitle}>Task Breakdown</div>
          <div className={styles.breakdownRow}>
            <span className={styles.breakdownLabel}><span className={styles.breakdownDot} style={{ background: 'var(--accent-green)' }} />Done</span>
            <span className={styles.breakdownCount}>{sprint.tasksDone}</span>
          </div>
          <div className={styles.breakdownRow}>
            <span className={styles.breakdownLabel}><span className={styles.breakdownDot} style={{ background: 'var(--accent-yellow)' }} />In Progress</span>
            <span className={styles.breakdownCount}>{sprint.inProgress}</span>
          </div>
          <div className={styles.breakdownRow}>
            <span className={styles.breakdownLabel}><span className={styles.breakdownDot} style={{ background: 'var(--accent-blue)' }} />To Do</span>
            <span className={styles.breakdownCount}>{sprint.todo}</span>
          </div>
          <div className={styles.miniBurndown}>
            <div className={styles.burndownTitle}>Burndown</div>
            <svg className={styles.burndownSvg} viewBox="0 0 160 36" preserveAspectRatio="none">
              <line x1="0" y1="0" x2="160" y2="36" stroke="var(--border-default)" strokeWidth="1.5" strokeDasharray="4,3" />
              {polylinePoints && (
                <polyline points={polylinePoints} fill="none" stroke="var(--accent-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
