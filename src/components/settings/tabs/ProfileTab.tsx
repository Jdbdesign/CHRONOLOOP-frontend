import { useState } from 'react'
import { Upload } from 'lucide-react'
import { SettingsCard } from '../shared/SettingsCard'
import { SettingsFormRow } from '../shared/SettingsFormRow'
import { Button } from '../../ui/Button'
import { useToastStore } from '../../../store/toastStore'
import { useSettingsStore } from '../../../store/settingsStore'

export function ProfileTab() {
  const showToast = useToastStore((s) => s.showToast)
  const profile = useSettingsStore((s) => s.profile)
  const updateProfile = useSettingsStore((s) => s.updateProfile)

  // Local state for the 8 free-text fields below, committed to the store on blur
  // rather than on every keystroke. updateProfile is async (Promise.resolve().then(set)),
  // so binding value={profile.X} directly caused the controlled input's caret to jump to
  // the end after every keystroke: React reconciles the DOM value from stale props before
  // the async store update lands. Matches the local-FormState-then-commit pattern already
  // used in AddTaskModal.tsx. No resync effect: nothing else in the app writes to `profile`
  // besides this component (confirmed via grep for updateProfile call sites), so profile
  // never changes out from under this component while mounted.
  const [local, setLocal] = useState(profile)

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
        <SettingsFormRow style={{ marginBottom: 12 }}>
          <div><label style={labelStyle}>First Name</label><input style={inputStyle} value={local.firstName} onChange={(e) => setLocal((prev) => ({ ...prev, firstName: e.target.value }))} onBlur={() => updateProfile({ firstName: local.firstName })} /></div>
          <div><label style={labelStyle}>Last Name</label><input style={inputStyle} value={local.lastName} onChange={(e) => setLocal((prev) => ({ ...prev, lastName: e.target.value }))} onBlur={() => updateProfile({ lastName: local.lastName })} /></div>
        </SettingsFormRow>
        <SettingsFormRow style={{ marginBottom: 12 }}>
          <div><label style={labelStyle}>Job Title</label><input style={inputStyle} value={local.jobTitle} onChange={(e) => setLocal((prev) => ({ ...prev, jobTitle: e.target.value }))} onBlur={() => updateProfile({ jobTitle: local.jobTitle })} /></div>
          <div><label style={labelStyle}>Department</label><select style={selectStyle} value={profile.department} onChange={(e) => updateProfile({ department: e.target.value })}><option>Product</option><option>Engineering</option><option>Design</option><option>Marketing</option><option>Operations</option></select></div>
        </SettingsFormRow>
        <div style={{ marginBottom: 12 }}><label style={labelStyle}>Bio</label><textarea style={{ ...inputStyle, height: 'auto', minHeight: 80, padding: '10px 12px', resize: 'vertical' }} value={local.bio} onChange={(e) => setLocal((prev) => ({ ...prev, bio: e.target.value }))} onBlur={() => updateProfile({ bio: local.bio })} /></div>
      </SettingsCard>

      <SettingsCard title="Contact & Links" subtitle="How people can reach you">
        <SettingsFormRow style={{ marginBottom: 12 }}>
          <div><label style={labelStyle}>Email Address</label><div style={{ position: 'relative' }}><input style={{ ...inputStyle, paddingRight: 90 }} value={local.email} onChange={(e) => setLocal((prev) => ({ ...prev, email: e.target.value }))} onBlur={() => updateProfile({ email: local.email })} /><span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(34,197,94,0.12)', color: 'var(--accent-green)', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>Verified</span></div></div>
          <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={local.phone} onChange={(e) => setLocal((prev) => ({ ...prev, phone: e.target.value }))} onBlur={() => updateProfile({ phone: local.phone })} placeholder="+1 (555) 000-0000" /></div>
        </SettingsFormRow>
        <SettingsFormRow>
          <div><label style={labelStyle}>LinkedIn</label><input style={inputStyle} value={local.linkedin} onChange={(e) => setLocal((prev) => ({ ...prev, linkedin: e.target.value }))} onBlur={() => updateProfile({ linkedin: local.linkedin })} placeholder="linkedin.com/in/username" /></div>
          <div><label style={labelStyle}>Twitter / X</label><input style={inputStyle} value={local.twitter} onChange={(e) => setLocal((prev) => ({ ...prev, twitter: e.target.value }))} onBlur={() => updateProfile({ twitter: local.twitter })} placeholder="@username" /></div>
        </SettingsFormRow>
      </SettingsCard>

      <SettingsCard title="Regional Settings" subtitle="Configure your locale and time preferences">
        <SettingsFormRow style={{ marginBottom: 12 }}>
          <div><label style={labelStyle}>Timezone</label><select style={selectStyle} value={profile.timezone} onChange={(e) => updateProfile({ timezone: e.target.value })}><option>UTC-05:00 — Eastern Time (US &amp; Canada)</option><option>UTC+00:00 — London / Dublin</option><option>UTC+01:00 — West Africa Time (Lagos)</option><option>UTC+05:30 — Mumbai, Chennai</option><option>UTC+08:00 — Singapore, Beijing</option></select></div>
          <div><label style={labelStyle}>Language</label><select style={selectStyle} value={profile.language} onChange={(e) => updateProfile({ language: e.target.value })}><option>English (US)</option><option>English (UK)</option><option>French</option><option>Spanish</option><option>German</option></select></div>
        </SettingsFormRow>
        <SettingsFormRow>
          <div><label style={labelStyle}>Date Format</label><select style={selectStyle} value={profile.dateFormat} onChange={(e) => updateProfile({ dateFormat: e.target.value })}><option>MM/DD/YYYY</option><option>DD/MM/YYYY</option><option>YYYY-MM-DD</option></select></div>
          <div><label style={labelStyle}>Time Format</label><select style={selectStyle} value={profile.timeFormat} onChange={(e) => updateProfile({ timeFormat: e.target.value })}><option>12-hour (AM/PM)</option><option>24-hour</option></select></div>
        </SettingsFormRow>
      </SettingsCard>
    </>
  )
}
