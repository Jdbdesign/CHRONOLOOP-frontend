import { useMemo } from 'react'
import { Users, Radio, Moon, TrendingUp, Zap } from 'lucide-react'
import { StatCard } from '../dashboard/StatCard'
import type { TeamMember } from '../../types/teamMember'
import styles from './TeamKpiGrid.module.css'

interface Props {
  members: TeamMember[]
}

export function TeamKpiGrid({ members }: Props) {
  const { total, online, offline, avgCompletion, avgVelocity } = useMemo(() => {
    const t = members.length
    const on = members.filter((m) => m.online).length
    return {
      total: t,
      online: on,
      offline: t - on,
      avgCompletion: t ? Math.round(members.reduce((s, m) => s + m.completion, 0) / t) : 0,
      avgVelocity: t ? Math.round(members.reduce((s, m) => s + m.velocity, 0) / t) : 0,
    }
  }, [members])

  return (
    <div className={styles.kpiGrid}>
      <StatCard label="Total Members" icon={<Users size={16} />} target={total} delta="up" deltaText="1 member added this month" index={0} />
      <StatCard label="Active Now" icon={<Radio size={16} />} target={online} delta="up" deltaText={`${online} members online right now`} index={1} iconBackground="rgba(34,197,94,0.12)" />
      <StatCard label="Offline" icon={<Moon size={16} />} target={offline} delta="down" deltaText={`${offline} members currently offline`} index={2} iconBackground="rgba(154,154,154,0.1)" />
      <StatCard label="Avg Completion" icon={<TrendingUp size={16} />} target={avgCompletion} delta="up" deltaText="Up 3.2% this sprint" index={3} iconBackground="rgba(0,212,170,0.12)" />
      <StatCard label="Avg Velocity" icon={<Zap size={16} />} target={avgVelocity} delta="up" deltaText="Up 8% vs last sprint" index={4} iconBackground="rgba(168,85,247,0.12)" />
    </div>
  )
}
