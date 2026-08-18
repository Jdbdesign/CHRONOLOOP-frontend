import { Archive, Send, Trash2, Copy } from 'lucide-react'
import { SettingsCard } from '../shared/SettingsCard'
import { SettingsFormRow } from '../shared/SettingsFormRow'
import { Button } from '../../ui/Button'
import { useToastStore } from '../../../store/toastStore'

export function WorkspaceTab() {
  const showToast = useToastStore((s) => s.showToast)
  const inputStyle = { width: '100%', height: 38, padding: '0 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif" } as const
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }

  return (
    <>
      <SettingsCard title="Workspace Identity" subtitle="Name, logo, and URL of your workspace">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 10, background: 'var(--bg-input)', border: '1px dashed var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 10, color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }}>Logo</div>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 10 }}><label style={labelStyle}>Workspace Name</label><input style={inputStyle} defaultValue="ChronoLoop" /></div>
            <div><label style={labelStyle}>Workspace URL</label>
              <div style={{ display: 'flex', border: '1px solid var(--border-subtle)', borderRadius: 8, overflow: 'hidden', background: 'var(--bg-input)' }}>
                <span style={{ display: 'flex', alignItems: 'center', padding: '0 10px', background: 'var(--border-subtle)', color: 'var(--text-muted)', fontSize: 12, borderRight: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' }}>app.chronoloop.io/</span>
                <input style={{ flex: 1, border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: 13, padding: '9px 12px', fontFamily: "'DM Sans', sans-serif", outline: 'none' }} defaultValue="my-workspace" />
                <button type="button" style={{ padding: '0 10px', background: 'transparent', border: 'none', borderLeft: '1px solid var(--border-subtle)', cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => showToast('URL copied!', 'success', 1500)}><Copy size={13} /></button>
              </div>
            </div>
          </div>
        </div>
        <div><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, height: 'auto', minHeight: 80, padding: '10px 12px', resize: 'vertical' }} defaultValue="Managing product sprints, tasks, and team collaboration for ChronoLoop's core platform." /></div>
      </SettingsCard>

      <SettingsCard title="Workspace Preferences" subtitle="Default settings applied across your workspace">
        <SettingsFormRow style={{ marginBottom: 12 }}>
          <div><label style={labelStyle}>Default Currency</label><select style={{ ...inputStyle, cursor: 'pointer' }} defaultValue="USD — US Dollar"><option>USD — US Dollar</option><option>EUR — Euro</option><option>GBP — British Pound</option><option>NGN — Nigerian Naira</option></select></div>
          <div><label style={labelStyle}>Fiscal Year Start</label><select style={{ ...inputStyle, cursor: 'pointer' }} defaultValue="January"><option>January</option><option>April</option><option>July</option><option>October</option></select></div>
        </SettingsFormRow>
        <SettingsFormRow style={{ marginBottom: 12 }}>
          <div><label style={labelStyle}>Week Starts On</label><select style={{ ...inputStyle, cursor: 'pointer' }} defaultValue="Monday"><option>Sunday</option><option>Monday</option><option>Saturday</option></select></div>
          <div><label style={labelStyle}>Sprint Duration</label><select style={{ ...inputStyle, cursor: 'pointer' }} defaultValue="2 weeks"><option>1 week</option><option>2 weeks</option><option>3 weeks</option><option>4 weeks</option></select></div>
        </SettingsFormRow>
        <SettingsFormRow>
          <div><label style={labelStyle}>Working Hours From</label><input type="time" style={{ ...inputStyle, colorScheme: 'dark' }} defaultValue="09:00" /></div>
          <div><label style={labelStyle}>Working Hours To</label><input type="time" style={{ ...inputStyle, colorScheme: 'dark' }} defaultValue="18:00" /></div>
        </SettingsFormRow>
      </SettingsCard>

      <SettingsCard title={'\u26A0\uFE0F Danger Zone'} danger>
        {[
          { title: 'Archive Workspace', desc: 'Pause all activity. Data is preserved and workspace can be restored later.', icon: <Archive size={12} />, label: 'Archive' },
          { title: 'Transfer Ownership', desc: 'Assign workspace ownership to another admin member.', icon: <Send size={12} />, label: 'Transfer' },
          { title: 'Delete Workspace', desc: 'Permanently delete this workspace and all its data. This action cannot be undone.', icon: <Trash2 size={12} />, label: 'Delete' },
        ].map((item) => (
          <div key={item.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <div><div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{item.title}</div><div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div></div>
            <Button variant="secondary" style={{ color: 'var(--accent-red)', borderColor: 'rgba(255,77,77,0.3)', flexShrink: 0 }} onClick={() => showToast(`${item.title}? This cannot be undone.`, 'info', 3000)}>{item.icon} {item.label}</Button>
          </div>
        ))}
      </SettingsCard>
    </>
  )
}
