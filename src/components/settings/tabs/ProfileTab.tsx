import { Upload } from 'lucide-react'
import { SettingsCard } from '../shared/SettingsCard'
import { Button } from '../../ui/Button'
import { useToastStore } from '../../../store/toastStore'

export function ProfileTab() {
  const showToast = useToastStore((s) => s.showToast)
  const inputStyle = { width: '100%', height: 38, padding: '0 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif" } as const
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }
  const selectStyle = { ...inputStyle, cursor: 'pointer' } as const

  return (
    <>
      <SettingsCard title="Personal Information" subtitle="Update your photo, name, and personal details">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #4A90FF, #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
            <img src="/avatars/Ellipse 1.png" alt="Jacob Solayinka" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontFamily: "'Syne'", fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Jacob Solayinka</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Product Manager · ChronoLoop</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Button variant="secondary" style={{ height: 28, fontSize: 11, padding: '0 10px' }} onClick={() => showToast('Photo upload coming soon', 'info', 2000)}><Upload size={11} /> Upload Photo</Button>
              <Button variant="secondary" style={{ height: 28, fontSize: 11, padding: '0 10px' }} onClick={() => showToast('Avatar removed', 'success', 1800)}>Remove</Button>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}><label style={labelStyle}>First Name</label><input style={inputStyle} defaultValue="Jacob" /></div>
          <div style={{ flex: 1 }}><label style={labelStyle}>Last Name</label><input style={inputStyle} defaultValue="Solayinka" /></div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}><label style={labelStyle}>Job Title</label><input style={inputStyle} defaultValue="Product Manager" /></div>
          <div style={{ flex: 1 }}><label style={labelStyle}>Department</label><select style={selectStyle} defaultValue="Product"><option>Product</option><option>Engineering</option><option>Design</option><option>Marketing</option><option>Operations</option></select></div>
        </div>
        <div style={{ marginBottom: 12 }}><label style={labelStyle}>Bio</label><textarea style={{ ...inputStyle, height: 'auto', minHeight: 80, padding: '10px 12px', resize: 'vertical' }} defaultValue="Building better products one sprint at a time. Passionate about team collaboration and clean workflows." /></div>
      </SettingsCard>

      <SettingsCard title="Contact & Links" subtitle="How people can reach you">
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}><label style={labelStyle}>Email Address</label><div style={{ position: 'relative' }}><input style={{ ...inputStyle, paddingRight: 90 }} defaultValue="jacobsolayinka19@gmail.com" /><span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(34,197,94,0.12)', color: 'var(--accent-green)', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>Verified</span></div></div>
          <div style={{ flex: 1 }}><label style={labelStyle}>Phone</label><input style={inputStyle} placeholder="+1 (555) 000-0000" /></div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}><label style={labelStyle}>LinkedIn</label><input style={inputStyle} placeholder="linkedin.com/in/username" /></div>
          <div style={{ flex: 1 }}><label style={labelStyle}>Twitter / X</label><input style={inputStyle} placeholder="@username" /></div>
        </div>
      </SettingsCard>

      <SettingsCard title="Regional Settings" subtitle="Configure your locale and time preferences">
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}><label style={labelStyle}>Timezone</label><select style={selectStyle} defaultValue="UTC+01:00 — West Africa Time (Lagos)"><option>UTC-05:00 — Eastern Time (US & Canada)</option><option>UTC+00:00 — London / Dublin</option><option>UTC+01:00 — West Africa Time (Lagos)</option><option>UTC+05:30 — Mumbai, Chennai</option><option>UTC+08:00 — Singapore, Beijing</option></select></div>
          <div style={{ flex: 1 }}><label style={labelStyle}>Language</label><select style={selectStyle} defaultValue="English (US)"><option>English (US)</option><option>English (UK)</option><option>French</option><option>Spanish</option><option>German</option></select></div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}><label style={labelStyle}>Date Format</label><select style={selectStyle} defaultValue="MM/DD/YYYY"><option>MM/DD/YYYY</option><option>DD/MM/YYYY</option><option>YYYY-MM-DD</option></select></div>
          <div style={{ flex: 1 }}><label style={labelStyle}>Time Format</label><select style={selectStyle} defaultValue="12-hour (AM/PM)"><option>12-hour (AM/PM)</option><option>24-hour</option></select></div>
        </div>
      </SettingsCard>
    </>
  )
}
