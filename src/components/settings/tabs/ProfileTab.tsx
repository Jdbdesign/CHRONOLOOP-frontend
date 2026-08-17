import { Upload } from 'lucide-react'
import { SettingsCard } from '../shared/SettingsCard'
import { Button } from '../../ui/Button'
import { useToastStore } from '../../../store/toastStore'
import { useSettingsStore } from '../../../store/settingsStore'

export function ProfileTab() {
  const showToast = useToastStore((s) => s.showToast)
  const profile = useSettingsStore((s) => s.profile)
  const updateProfile = useSettingsStore((s) => s.updateProfile)

  const inputStyle = { width: '100%', height: 38, padding: '0 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif" } as const
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }
  const selectStyle = { ...inputStyle, cursor: 'pointer' } as const

  return (
    <>
      <SettingsCard title="Personal Information" subtitle="Update your photo, name, and personal details">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
            <img src="/avatars/Ellipse 1.png" alt={`${profile.firstName} ${profile.lastName}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontFamily: "'Syne'", fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{profile.firstName} {profile.lastName}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{profile.jobTitle} · ChronoLoop</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Button variant="secondary" style={{ height: 28, fontSize: 11, padding: '0 10px' }} onClick={() => showToast('Photo upload coming soon', 'info', 2000)}><Upload size={11} /> Upload Photo</Button>
              <Button variant="secondary" style={{ height: 28, fontSize: 11, padding: '0 10px' }} onClick={() => showToast('Avatar removed', 'success', 1800)}>Remove</Button>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}><label style={labelStyle}>First Name</label><input style={inputStyle} value={profile.firstName} onChange={(e) => updateProfile({ firstName: e.target.value })} /></div>
          <div style={{ flex: 1 }}><label style={labelStyle}>Last Name</label><input style={inputStyle} value={profile.lastName} onChange={(e) => updateProfile({ lastName: e.target.value })} /></div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}><label style={labelStyle}>Job Title</label><input style={inputStyle} value={profile.jobTitle} onChange={(e) => updateProfile({ jobTitle: e.target.value })} /></div>
          <div style={{ flex: 1 }}><label style={labelStyle}>Department</label><select style={selectStyle} value={profile.department} onChange={(e) => updateProfile({ department: e.target.value })}><option>Product</option><option>Engineering</option><option>Design</option><option>Marketing</option><option>Operations</option></select></div>
        </div>
        <div style={{ marginBottom: 12 }}><label style={labelStyle}>Bio</label><textarea style={{ ...inputStyle, height: 'auto', minHeight: 80, padding: '10px 12px', resize: 'vertical' }} value={profile.bio} onChange={(e) => updateProfile({ bio: e.target.value })} /></div>
      </SettingsCard>

      <SettingsCard title="Contact & Links" subtitle="How people can reach you">
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}><label style={labelStyle}>Email Address</label><div style={{ position: 'relative' }}><input style={{ ...inputStyle, paddingRight: 90 }} value={profile.email} onChange={(e) => updateProfile({ email: e.target.value })} /><span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(34,197,94,0.12)', color: 'var(--accent-green)', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>Verified</span></div></div>
          <div style={{ flex: 1 }}><label style={labelStyle}>Phone</label><input style={inputStyle} value={profile.phone} onChange={(e) => updateProfile({ phone: e.target.value })} placeholder="+1 (555) 000-0000" /></div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}><label style={labelStyle}>LinkedIn</label><input style={inputStyle} value={profile.linkedin} onChange={(e) => updateProfile({ linkedin: e.target.value })} placeholder="linkedin.com/in/username" /></div>
          <div style={{ flex: 1 }}><label style={labelStyle}>Twitter / X</label><input style={inputStyle} value={profile.twitter} onChange={(e) => updateProfile({ twitter: e.target.value })} placeholder="@username" /></div>
        </div>
      </SettingsCard>

      <SettingsCard title="Regional Settings" subtitle="Configure your locale and time preferences">
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}><label style={labelStyle}>Timezone</label><select style={selectStyle} value={profile.timezone} onChange={(e) => updateProfile({ timezone: e.target.value })}><option>UTC-05:00 — Eastern Time (US &amp; Canada)</option><option>UTC+00:00 — London / Dublin</option><option>UTC+01:00 — West Africa Time (Lagos)</option><option>UTC+05:30 — Mumbai, Chennai</option><option>UTC+08:00 — Singapore, Beijing</option></select></div>
          <div style={{ flex: 1 }}><label style={labelStyle}>Language</label><select style={selectStyle} value={profile.language} onChange={(e) => updateProfile({ language: e.target.value })}><option>English (US)</option><option>English (UK)</option><option>French</option><option>Spanish</option><option>German</option></select></div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}><label style={labelStyle}>Date Format</label><select style={selectStyle} value={profile.dateFormat} onChange={(e) => updateProfile({ dateFormat: e.target.value })}><option>MM/DD/YYYY</option><option>DD/MM/YYYY</option><option>YYYY-MM-DD</option></select></div>
          <div style={{ flex: 1 }}><label style={labelStyle}>Time Format</label><select style={selectStyle} value={profile.timeFormat} onChange={(e) => updateProfile({ timeFormat: e.target.value })}><option>12-hour (AM/PM)</option><option>24-hour</option></select></div>
        </div>
      </SettingsCard>
    </>
  )
}
