import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { TaskSubtask } from '../../types/task'
import styles from './TaskDetailSubtasks.module.css'

interface TaskDetailSubtasksProps {
  subtasks: TaskSubtask[]
  onToggle: (index: number) => void
  onAdd: (text: string) => void
}

export function TaskDetailSubtasks({ subtasks, onToggle, onAdd }: TaskDetailSubtasksProps) {
  const [text, setText] = useState('')
  const doneCount = subtasks.filter((s) => s.done).length
  const pct = subtasks.length > 0 ? Math.round((doneCount / subtasks.length) * 100) : 0

  const handleAdd = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setText('')
  }

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.label}>Sub-tasks ({doneCount}/{subtasks.length})</div>
        <span className={styles.pct}>{pct}%</span>
      </div>
      <div className={styles.progressWrap}>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className={styles.list}>
        {subtasks.map((s, i) => (
          <div key={i} className={styles.item}>
            <button
              type="button"
              role="checkbox"
              aria-checked={s.done}
              aria-label={s.done ? `Reopen "${s.t}"` : `Mark "${s.t}" done`}
              className={styles.check}
              data-done={s.done}
              onClick={() => onToggle(i)}
            />
            <span className={styles.text} data-done={s.done}>{s.t}</span>
          </div>
        ))}
      </div>
      <div className={styles.addRow}>
        <input
          type="text"
          className={styles.input}
          placeholder="Add a subtask..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd() } }}
        />
        <button type="button" className={styles.addBtn} aria-label="Add subtask" onClick={handleAdd}>
          <Plus aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
