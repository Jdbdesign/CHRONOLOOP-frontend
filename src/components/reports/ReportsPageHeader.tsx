import { useState } from 'react'
import { Download, Printer } from 'lucide-react'
import { Button } from '../ui/Button'
import { useToastStore } from '../../store/toastStore'
import styles from './ReportsPageHeader.module.css'

const RANGES = ['7D', '30D', '90D', '12M']

export function ReportsPageHeader() {
  const showToast = useToastStore((s) => s.showToast)
  const [activeRange, setActiveRange] = useState('30D')

  const handleExport = () => {
    showToast('Preparing report export\u2026', 'info', 1500)
    setTimeout(() => showToast('Report exported successfully!', 'success', 2500), 1800)
  }

  const handlePrint = () => {
    showToast('Opening print dialog\u2026', 'info', 1500)
    setTimeout(() => window.print(), 800)
  }

  return (
    <div className={styles.header}>
      <div>
        <div className={styles.breadcrumb}>Overview / Reports</div>
        <div className={styles.heading}>Reports</div>
      </div>
      <div className={styles.actions}>
        <div className={styles.rangeTabs}>
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              className={`${styles.rangeTab}${activeRange === r ? ` ${styles.rangeTabActive}` : ''}`}
              onClick={() => {
                setActiveRange(r)
                showToast(`Showing data for last ${r}`, 'info', 1500)
              }}
            >
              {r}
            </button>
          ))}
        </div>
        <Button variant="secondary" onClick={handleExport}>
          <Download size={13} /> Export
        </Button>
        <Button variant="secondary" onClick={handlePrint}>
          <Printer size={13} /> Print
        </Button>
      </div>
    </div>
  )
}
