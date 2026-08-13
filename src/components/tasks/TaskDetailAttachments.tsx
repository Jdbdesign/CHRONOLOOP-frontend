import { Layers, FileText, Archive, FileCode, Database, File as FileIcon, Download } from 'lucide-react'
import type { TaskAttachment } from '../../types/task'
import { useToastStore } from '../../store/toastStore'
import styles from './TaskDetailAttachments.module.css'

const ICON_MAP = { fig: Layers, pdf: FileText, zip: Archive, yml: FileCode, sql: Database } as const
const BG_COLOR: Record<string, string> = {
  fig: 'rgba(168,85,247,0.15)',
  pdf: 'rgba(255,77,77,0.15)',
  zip: 'rgba(234,179,8,0.15)',
  yml: 'rgba(74,144,255,0.15)',
  sql: 'rgba(0,212,170,0.15)',
}
const ICON_COLOR: Record<string, string> = {
  fig: 'var(--accent-purple)',
  pdf: 'var(--accent-red)',
  zip: 'var(--accent-yellow)',
  yml: 'var(--accent-blue)',
  sql: 'var(--accent-teal)',
}

interface TaskDetailAttachmentsProps {
  attachments: TaskAttachment[]
}

export function TaskDetailAttachments({ attachments }: TaskDetailAttachmentsProps) {
  const showToast = useToastStore((s) => s.showToast)
  if (attachments.length === 0) return null

  return (
    <div>
      <div className={styles.label}>Attachments ({attachments.length})</div>
      <div className={styles.list}>
        {attachments.map((a) => {
          const Icon = ICON_MAP[a.type as keyof typeof ICON_MAP] ?? FileIcon
          return (
            <div key={a.name} className={styles.item}>
              <div className={styles.icon} style={{ background: BG_COLOR[a.type] ?? 'var(--bg-input)' }}>
                <Icon aria-hidden="true" style={{ color: ICON_COLOR[a.type] ?? 'var(--text-muted)' }} />
              </div>
              <div className={styles.info}>
                <div className={styles.name}>{a.name}</div>
                <div className={styles.size}>{a.size}</div>
              </div>
              <button
                type="button"
                className={styles.downloadBtn}
                aria-label={`Download ${a.name}`}
                onClick={() => showToast(`Downloading ${a.name}...`, 'info')}
              >
                <Download aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
