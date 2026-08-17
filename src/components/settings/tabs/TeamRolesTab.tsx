import { Send } from 'lucide-react'
import { useState } from 'react'
import { SettingsCard } from '../shared/SettingsCard'
import { Button } from '../../ui/Button'
import { Avatar } from '../../ui/Avatar'
import { useToastStore } from '../../../store/toastStore'
import { useTeamStore } from '../../../store/teamStore'
import { useSettingsStore } from '../../../store/settingsStore'
import { TEAM_ROLE_MAP, ROLE_PERMISSIONS } from '../../../data/mockSettingsData'

const ROLE_COLORS: Record<string, string> = { Owner: 'var(--accent-purple)', Admin: 'var(--accent-blue)', Member: 'var(--accent-green)', Viewer: 'var(--text-secondary)', Guest: 'var(--accent-orange)' }

export function TeamRolesTab() {
  const showToast = useToastStore((s) => s.showToast)
  const teamMembers = useTeamStore((s) => s.members)
  const roleOverrides = useSettingsStore((s) => s.roleOverrides)
  const setMemberRole = useSettingsStore((s) => s.setMemberRole)
  const pendingInvites = useSettingsStore((s) => s.pendingInvites)
  const addInvite = useSettingsStore((s) => s.addInvite)
  const revokeInvite = useSettingsStore((s) => s.revokeInvite)
  const profileName = useSettingsStore((s) => `${s.profile.firstName} ${s.profile.lastName}`)
  const profileEmail = useSettingsStore((s) => s.profile.email)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Member')

  return (
    <>
      <SettingsCard title="Team Members" subtitle={`${teamMembers.length + 1} members · ${pendingInvites.length} pending invitations`}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead><tr style={{ borderBottom: '1px solid var(--border-default)' }}>
            <th style={{ textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 10px 8px 0' }}>Member</th>
            <th style={{ textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0 10px 8px' }}>Role</th>
            <th style={{ textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0 10px 8px' }}>Status</th>
            <th style={{ textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0 10px 8px' }}>Last Active</th>
            <th />
          </tr></thead>
          <tbody>
            {/* Owner row — Jacob Solayinka */}
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '10px 10px 10px 0' }}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 30, height: 30, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}><img src="/avatars/Ellipse 1.png" alt={profileName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div><div><div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{profileName}</div><div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{profileEmail}</div></div></div></td>
              <td style={{ padding: '10px' }}><span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: 'rgba(168,85,247,0.12)', color: ROLE_COLORS.Owner }}>Owner</span></td>
              <td style={{ padding: '10px' }}><span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-green)' }} />Online</span></td>
              <td style={{ padding: '10px', fontFamily: "'DM Mono', monospace", fontSize: 11 }}>Now</td>
              <td style={{ padding: '10px 0' }}><button type="button" style={{ fontSize: 11, color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => showToast('Cannot modify workspace owner', 'info', 2000)}>···</button></td>
            </tr>
            {/* Team members from store */}
            {teamMembers.map((m) => {
              const roleInfo = TEAM_ROLE_MAP[m.id] || { role: 'Member', status: 'offline', lastActive: 'Unknown' }
              const currentRole = roleOverrides[m.id] || roleInfo.role
              const statusColor = roleInfo.status === 'online' ? 'var(--accent-green)' : roleInfo.status === 'away' ? 'var(--accent-yellow)' : 'var(--text-muted)'
              return (
                <tr key={m.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '10px 10px 10px 0' }}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={m.initials} fallbackStyle={{ background: m.color, width: 30, height: 30, fontSize: 10 }} style={{ width: 30, height: 30 }} /><div><div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{m.name}</div><div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.email}</div></div></div></td>
                  <td style={{ padding: '10px' }}><select value={currentRole} onChange={(e) => { setMemberRole(m.id, e.target.value); showToast(`${m.name.split(' ')[0]} is now ${e.target.value}`, 'success', 1800) }} style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: `${ROLE_COLORS[currentRole] || 'var(--text-muted)'}18`, color: ROLE_COLORS[currentRole] || 'var(--text-muted)', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans'" }}><option>Admin</option><option>Member</option><option>Viewer</option><option>Guest</option></select></td>
                  <td style={{ padding: '10px' }}><span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor }} />{roleInfo.status.charAt(0).toUpperCase() + roleInfo.status.slice(1)}</span></td>
                  <td style={{ padding: '10px', fontFamily: "'DM Mono', monospace", fontSize: 11 }}>{roleInfo.lastActive}</td>
                  <td style={{ padding: '10px 0' }}><button type="button" style={{ fontSize: 11, color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => showToast('Member options coming soon', 'info', 1800)}>···</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </SettingsCard>

      <SettingsCard title="Invite New Member" subtitle="Send an email invitation to join the workspace">
        <form onSubmit={(e) => { e.preventDefault(); if (!inviteEmail.trim()) { showToast('Please enter an email', 'error', 2000); return }; addInvite(inviteEmail.trim(), inviteRole); showToast('Invitation sent!', 'success', 2000); setInviteEmail('') }} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}><label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label><input type="email" placeholder="colleague@company.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} style={{ width: '100%', height: 38, padding: '0 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }} /></div>
          <div style={{ flex: '0 0 140px' }}><label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</label><select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} style={{ width: '100%', height: 38, padding: '0 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}><option>Member</option><option>Admin</option><option>Viewer</option><option>Guest</option></select></div>
          <div style={{ flex: '0 0 auto', alignSelf: 'flex-end' }}><Button variant="primary" type="submit" style={{ height: 39 }}><Send size={13} /> Send Invite</Button></div>
        </form>
      </SettingsCard>

      <SettingsCard title="Pending Invitations" subtitle={`${pendingInvites.length} invites awaiting acceptance`}>
        {pendingInvites.map((inv) => (
          <div key={inv.email} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <div><div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{inv.email}</div><div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Invited as {inv.role} · Sent {inv.sent} · Expires {inv.expires}</div></div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" style={{ fontSize: 11, color: 'var(--accent-blue)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans'" }} onClick={() => showToast('Invitation resent', 'success', 1800)}>Resend</button>
              <button type="button" style={{ fontSize: 11, color: 'var(--accent-red)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans'" }} onClick={() => { revokeInvite(inv.email); showToast('Invitation revoked', 'info', 1800) }}>Revoke</button>
            </div>
          </div>
        ))}
        {!pendingInvites.length && <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '10px 0' }}>No pending invitations</div>}
      </SettingsCard>

      <SettingsCard title="Role Permissions" subtitle="What each role can do in the workspace">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
            <thead><tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 10px 8px 0' }}>Permission</th>
              <th style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--accent-purple)', padding: '0 0 8px' }}>Owner</th>
              <th style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--accent-blue)', padding: '0 0 8px' }}>Admin</th>
              <th style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--accent-green)', padding: '0 0 8px' }}>Member</th>
              <th style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', padding: '0 0 8px' }}>Viewer</th>
            </tr></thead>
            <tbody>
              {ROLE_PERMISSIONS.map((row) => (
                <tr key={row.perm} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '8px 10px 8px 0', fontSize: 12, color: 'var(--text-primary)' }}>{row.perm}</td>
                  {[row.owner, row.admin, row.member, row.viewer].map((has, i) => (
                    <td key={i} style={{ textAlign: 'center', padding: '8px 0', color: has ? 'var(--accent-green)' : 'var(--border-default)' }}>{has ? '✓' : '—'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>
    </>
  )
}
