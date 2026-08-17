import { Zap, Check, Download } from 'lucide-react'
import { SettingsCard } from '../shared/SettingsCard'
import { Button } from '../../ui/Button'
import { useToastStore } from '../../../store/toastStore'
import { INVOICES } from '../../../data/mockSettingsData'

export function BillingTab() {
  const showToast = useToastStore((s) => s.showToast)

  return (
    <>
      <SettingsCard title="Current Plan" subtitle="Your subscription and billing cycle" headerRight={<Button variant="primary" style={{ height: 32, fontSize: 12 }} onClick={() => showToast('Upgrade flow coming soon', 'info', 2000)}><Zap size={13} /> Upgrade to Business</Button>}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, padding: '16px 18px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 10 }}>
          <div>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--accent-blue)', background: 'rgba(74,144,255,0.12)', padding: '2px 8px', borderRadius: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pro Plan</span>
            <div style={{ fontFamily: "'Syne'", fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginTop: 8 }}>Professional</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Next renewal: July 5, 2026 · Billed monthly</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 10 }}>
              {['Up to 20 projects', 'Up to 25 team members', '50 GB storage', 'Advanced analytics & reports', 'API access & webhooks', 'Priority support'].map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}><Check size={11} style={{ color: 'var(--accent-green)' }} />{f}</div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: "'Syne'", fontSize: 34, fontWeight: 800, color: 'var(--text-primary)' }}><span style={{ fontSize: 16, marginTop: 4 }}>$</span>49<span style={{ fontSize: 14, color: 'var(--text-secondary)', fontFamily: "'DM Sans'" }}>/mo</span></div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>$468/year (save 20%)</div>
            <Button variant="secondary" style={{ height: 28, fontSize: 11, padding: '0 10px', marginTop: 10 }} onClick={() => showToast('Switching to annual billing saves $120/yr', 'info', 3000)}>Switch to Annual</Button>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Usage" subtitle="Current plan limits and consumption" headerRight={<span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--text-muted)' }}>Resets Jul 5</span>}>
        {[
          { label: 'Projects', used: '10 / 20 used', pct: 50, color: undefined },
          { label: 'Team Members', used: '8 / 25 used', pct: 32, color: 'var(--accent-teal)' },
          { label: 'Storage', used: '18.4 GB / 50 GB', pct: 37, color: 'var(--accent-orange)' },
          { label: 'API Calls (month)', used: '84,210 / 500,000', pct: 17, color: 'var(--accent-purple)' },
        ].map((u) => (
          <div key={u.label} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}><span>{u.label}</span><span>{u.used}</span></div>
            <div style={{ height: 5, background: 'var(--border-subtle)', borderRadius: 3, overflow: 'hidden' }}><div style={{ height: '100%', width: `${u.pct}%`, background: u.color || 'var(--accent-blue)', borderRadius: 3 }} /></div>
          </div>
        ))}
      </SettingsCard>

      <SettingsCard title="Payment Method" subtitle="Default card used for subscription billing" headerRight={<Button variant="secondary" style={{ height: 28, fontSize: 11, padding: '0 10px' }} onClick={() => showToast('Card editor coming soon', 'info', 2000)}>Add Card</Button>}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 10 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700, color: 'var(--accent-blue)', background: 'rgba(74,144,255,0.08)', padding: '4px 10px', borderRadius: 6 }}>VISA</div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', fontFamily: "'DM Mono', monospace" }}>•••• •••• •••• 4242</div><div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Expires 09 / 2027 · Jacob Solayinka</div></div>
          <span style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--accent-green)', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>Default</span>
        </div>
      </SettingsCard>

      <SettingsCard title="Invoice History" subtitle="All past billing transactions" headerRight={<Button variant="secondary" style={{ height: 28, fontSize: 11, padding: '0 10px' }} onClick={() => showToast('Exporting invoice history\u2026', 'info', 1800)}><Download size={11} /> Export All</Button>}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead><tr style={{ borderBottom: '1px solid var(--border-default)' }}><th style={{ textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 10px 8px 0' }}>Description</th><th style={{ textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0 10px 8px 0' }}>Date</th><th style={{ textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0 10px 8px 0' }}>Amount</th><th style={{ textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0 10px 8px 0' }}>Status</th><th /></tr></thead>
          <tbody>
            {INVOICES.map((inv) => (
              <tr key={inv.description} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '9px 10px 9px 0', color: 'var(--text-primary)', fontWeight: 500 }}>{inv.description}</td>
                <td style={{ padding: '9px 10px', color: 'var(--text-secondary)' }}>{inv.date}</td>
                <td style={{ padding: '9px 10px', fontFamily: "'DM Mono', monospace" }}>{inv.amount}</td>
                <td style={{ padding: '9px 10px' }}><span style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--accent-green)', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>Paid</span></td>
                <td style={{ padding: '9px 0' }}><button type="button" style={{ fontSize: 11, color: 'var(--accent-blue)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontFamily: "'DM Sans'" }} onClick={() => showToast('Downloading invoice PDF\u2026', 'info', 1500)}><Download size={11} /> PDF</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SettingsCard>
    </>
  )
}
