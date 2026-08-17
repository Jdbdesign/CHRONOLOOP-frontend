import { useState } from 'react'
import { Moon, Sun, Monitor, AlignJustify, AlignCenter, LayoutGrid } from 'lucide-react'
import { SettingsCard } from '../shared/SettingsCard'
import { ToggleRow } from '../shared/ToggleRow'
import { RadioCardGroup } from '../shared/RadioCardGroup'
import { useToastStore } from '../../../store/toastStore'
import { useThemeStore } from '../../../store/themeStore'

const COLORS = ['#4A90FF', '#A855F7', '#00D4AA', '#FF8C42', '#EC4899', '#EAB308', '#22C55E', '#06B6D4']

export function AppearanceTab() {
  const showToast = useToastStore((s) => s.showToast)
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const [density, setDensity] = useState('comfortable')
  const [fontSize, setFontSize] = useState('medium')
  const [accentColor, setAccentColor] = useState('#4A90FF')
  const [toggles, setToggles] = useState({ labels: true, animate: true, reduceMotion: false })

  const handleTheme = (val: string) => {
    if (val === 'dark' || val === 'light') setTheme(val)
    else { /* system — themeStore only supports dark/light, default to dark */ setTheme('dark') }
    showToast(`Theme updated to ${val.charAt(0).toUpperCase() + val.slice(1)}`, 'success', 1800)
  }

  return (
    <>
      <SettingsCard title="Theme" subtitle="Choose the overall look and feel of the app">
        <RadioCardGroup
          options={[
            { id: 'dark', icon: <Moon size={17} />, label: 'Dark' },
            { id: 'light', icon: <Sun size={17} />, label: 'Light' },
            { id: 'system', icon: <Monitor size={17} />, label: 'System' },
          ]}
          value={theme === 'light' ? 'light' : 'dark'}
          onChange={handleTheme}
        />
      </SettingsCard>

      <SettingsCard title="Accent Color" subtitle="Pick your preferred highlight color">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {COLORS.map((c) => (
            <div key={c} onClick={() => setAccentColor(c)} style={{ width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer', border: accentColor === c ? '2.5px solid #fff' : '2.5px solid transparent', boxShadow: accentColor === c ? `0 0 0 2px ${c}` : 'none', transition: 'all 0.15s' }} title={c} />
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Interface Density" subtitle="Controls spacing and padding throughout the UI">
        <RadioCardGroup
          options={[
            { id: 'compact', icon: <AlignJustify size={17} />, label: 'Compact' },
            { id: 'comfortable', icon: <AlignCenter size={17} />, label: 'Comfortable' },
            { id: 'spacious', icon: <LayoutGrid size={17} />, label: 'Spacious' },
          ]}
          value={density}
          onChange={setDensity}
        />
      </SettingsCard>

      <SettingsCard title="Font Size" subtitle="Base text size across the application">
        <RadioCardGroup
          options={[
            { id: 'small', icon: <span style={{ fontSize: 11, fontWeight: 700 }}>Aa</span>, label: 'Small' },
            { id: 'medium', icon: <span style={{ fontSize: 14, fontWeight: 700 }}>Aa</span>, label: 'Medium' },
            { id: 'large', icon: <span style={{ fontSize: 17, fontWeight: 700 }}>Aa</span>, label: 'Large' },
          ]}
          value={fontSize}
          onChange={setFontSize}
        />
      </SettingsCard>

      <SettingsCard title="Sidebar Behavior" subtitle="How the navigation sidebar is displayed">
        <ToggleRow label="Show sidebar labels" description="Display text next to navigation icons" checked={toggles.labels} onChange={(v) => setToggles((p) => ({ ...p, labels: v }))} />
        <ToggleRow label="Animate sidebar transitions" description="Slide-in effects when switching pages" checked={toggles.animate} onChange={(v) => setToggles((p) => ({ ...p, animate: v }))} />
        <ToggleRow label="Reduce motion" description="Minimize animations for accessibility" checked={toggles.reduceMotion} onChange={(v) => setToggles((p) => ({ ...p, reduceMotion: v }))} />
      </SettingsCard>
    </>
  )
}
