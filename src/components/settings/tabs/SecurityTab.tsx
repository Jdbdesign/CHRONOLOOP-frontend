import { useState } from 'react'
import { Lock, ShieldCheck, ShieldOff, LogOut, Monitor, Smartphone, Tablet, Laptop } from 'lucide-react'
import { SettingsCard } from '../shared/SettingsCard'
import { ToggleRow } from '../shared/ToggleRow'
import { Button } from '../../ui/Button'
import { useToastStore } from '../../../store/toastStore'
import { useSettingsStore } from '../../../store/settingsStore'
import { LOGIN_ACTIVITY } from '../../../data/mockSettingsData'

const DEVICE_ICONS: Record<string, typeof Monitor> = { monitor: Monitor, smartphone: Smartphone, tablet: Tablet, laptop: Laptop }

export function SecurityTab() {
  const showToast = useToastStore((s) => s.showToast)
  const sessions = useSettingsStore((s) => s.sessions)
  const revokeSession = useSettingsStore((s) => s.revokeSession)
  const revokeAllSessions = useSettingsStore((s) => s.revokeAllSessions)
  const [pwdStrength, setPwdStrength] = useState(0)

  return (
    <>
      <SettingsCard title="Change Password" subtitle="Use a strong, unique password for your account">
        <form onSubmit={(e) => { e.preventDefault(); showToast('Password updated successfully!', 'success', 2000) }}>
          <div style={{ marginBottom: 12 }}><label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Password</label><input type="password" placeholder="Enter current password" style={{ width: '100%', height: 38, padding: '0 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }} /></div>
          <div style={{ marginBottom: 6 }}><label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Password</label><input type="password" placeholder="Min. 8 characters" onChange={(e) => setPwdStrength(Math.min(4, Math.floor(e.target.value.length / 3)))} style={{ width: '100%', height: 38, padding: '0 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }} />
            <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>{[0,1,2,3].map((i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < pwdStrength ? (pwdStrength <= 1 ? 'var(--accent-red)' : pwdStrength <= 2 ? 'var(--accent-yellow)' : 'var(--accent-green)') : 'var(--border-subtle)' }} />)}</div>
          </div>
          <div style={{ marginBottom: 14 }}><label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confirm New Password</label><input type="password" placeholder="Repeat new password" style={{ width: '100%', height: 38, padding: '0 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }} /></div>
          <Button variant="primary" type="submit" style={{ height: 34 }}><Lock size={13} /> Update Password</Button>
        </form>
      </SettingsCard>

      <SettingsCard title="Two-Factor Authentication" subtitle="Add an extra layer of security to your account">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 10, marginBottom: 12 }}>
          <ShieldOff size={20} style={{ color: 'var(--text-muted)' }} />
          <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>2FA is not enabled</div><div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Your account is protected by password only</div></div>
          <Button variant="primary" style={{ height: 32, fontSize: 12 }} onClick={() => showToast('2FA setup wizard coming soon', 'info', 2000)}><ShieldCheck size={13} /> Enable 2FA</Button>
        </div>
        <ToggleRow label="Backup codes" description="Generate one-time recovery codes for account access" checked={false} onChange={() => showToast('Enable 2FA first to generate backup codes', 'info', 2500)} />
        <ToggleRow label="Require 2FA for new logins" description="Always prompt for 2FA on unrecognized devices" checked={false} onChange={() => {}} disabled />
      </SettingsCard>

      <SettingsCard title="Active Sessions" subtitle="Devices currently signed in to your account" headerRight={<Button variant="secondary" style={{ height: 28, fontSize: 11, padding: '0 10px' }} onClick={() => { revokeAllSessions(); showToast('All other sessions revoked', 'success', 2000) }}><LogOut size={11} /> Revoke All</Button>}>
        {sessions.map((s, i) => {
          const Icon = DEVICE_ICONS[s.icon] || Monitor
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}><Icon size={15} /></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{s.device}</div><div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{s.meta} {s.current && <span style={{ background: 'rgba(74,144,255,0.12)', color: 'var(--accent-blue)', fontSize: 9, fontWeight: 600, padding: '1px 6px', borderRadius: 8, marginLeft: 6 }}>Current</span>}</div></div>
              {!s.current && <button type="button" style={{ fontSize: 11, color: 'var(--accent-red)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans'" }} onClick={() => { revokeSession(i); showToast('Session revoked', 'success', 1800) }}>Revoke</button>}
            </div>
          )
        })}
      </SettingsCard>

      <SettingsCard title="Login Activity" subtitle="Recent authentication history">
        {LOGIN_ACTIVITY.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: a.success ? 'var(--accent-green)' : 'var(--accent-red)', marginTop: 5, flexShrink: 0 }} />
            <div style={{ flex: 1 }}><div style={{ fontSize: 12, color: 'var(--text-primary)' }}>{a.event}</div><div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{a.meta}</div></div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', fontFamily: "'DM Mono', monospace" }}>{a.time}</div>
          </div>
        ))}
      </SettingsCard>
    </>
  )
}
