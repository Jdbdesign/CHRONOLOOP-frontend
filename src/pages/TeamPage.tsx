import { useState, useMemo, useCallback } from 'react'
import { useTeamStore } from '../store/teamStore'
import { useTeamDetailStore } from '../store/teamDetailStore'
import { TeamPageHeader } from '../components/team/TeamPageHeader'
import { TeamKpiGrid } from '../components/team/TeamKpiGrid'
import { TeamDeptTabs } from '../components/team/TeamDeptTabs'
import { TeamMemberGrid } from '../components/team/TeamMemberGrid'
import { TeamWorkloadPanel } from '../components/team/TeamWorkloadPanel'
import { TeamActivityFeed } from '../components/team/TeamActivityFeed'
import { TeamPerfLeaderboard } from '../components/team/TeamPerfLeaderboard'
import { TeamDetailPanel } from '../components/team/TeamDetailPanel'
import { InviteModal } from '../components/team/modals/InviteModal'
import { MemberProfileModal } from '../components/team/modals/MemberProfileModal'

export function TeamPage() {
  const members = useTeamStore((s) => s.members)
  const openDetail = useTeamDetailStore((s) => s.open)

  const [activeFilter, setActiveFilter] = useState('all')
  const [sortMode, setSortMode] = useState('name')
  const [searchQuery, setSearchQuery] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [profileMemberId, setProfileMemberId] = useState<string | null>(null)

  const memberCounts = useMemo(() => {
    const counts: Record<string, number> = { all: members.length }
    members.forEach((m) => {
      const key = m.dept.toLowerCase()
      counts[key] = (counts[key] || 0) + 1
    })
    return counts
  }, [members])

  const filteredSorted = useMemo(() => {
    let list = activeFilter === 'all'
      ? [...members]
      : members.filter((m) => m.dept.toLowerCase() === activeFilter)

    // Sort
    if (sortMode === 'completion') list.sort((a, b) => b.completion - a.completion)
    else if (sortMode === 'tasks') list.sort((a, b) => b.activeTasks - a.activeTasks)
    else if (sortMode === 'velocity') list.sort((a, b) => b.velocity - a.velocity)
    else list.sort((a, b) => a.name.localeCompare(b.name))

    // Search
    const q = searchQuery.toLowerCase().trim()
    if (q) {
      list = list.filter((m) =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.dept.toLowerCase().includes(q),
      )
    }

    return list
  }, [members, activeFilter, sortMode, searchQuery])

  const handleOpenDetail = useCallback((id: string) => openDetail(id), [openDetail])
  const handleQuickView = useCallback((id: string) => setProfileMemberId(id), [])

  const profileMember = profileMemberId ? members.find((m) => m.id === profileMemberId) ?? null : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto', height: '100%' }}>
      <TeamPageHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortMode={sortMode}
        onSortChange={setSortMode}
        onInvite={() => setIsInviteOpen(true)}
      />
      <TeamKpiGrid members={members} />
      <TeamDeptTabs
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        view={view}
        onViewChange={setView}
        memberCounts={memberCounts}
      />
      <TeamMemberGrid members={filteredSorted} view={view} onOpenDetail={handleOpenDetail} />
      <TeamWorkloadPanel members={filteredSorted} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignItems: 'start' }}>
        <TeamActivityFeed members={members} />
        <TeamPerfLeaderboard members={members} />
      </div>

      <TeamDetailPanel onQuickView={handleQuickView} />
      <InviteModal open={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
      <MemberProfileModal open={!!profileMemberId} onClose={() => setProfileMemberId(null)} member={profileMember} />
    </div>
  )
}
