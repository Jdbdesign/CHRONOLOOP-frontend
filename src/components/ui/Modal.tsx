import * as Dialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import styles from './Modal.module.css'

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  subtitle?: string
  footer?: ReactNode
  children: ReactNode
  className?: string
}

export function Modal({ open, onOpenChange, title, subtitle, footer, children, className }: ModalProps) {
  const combined = [styles.card, className].filter(Boolean).join(' ')

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay}>
          <Dialog.Content className={combined}>
            <div className={styles.header}>
              <div>
                <Dialog.Title className={styles.title}>{title}</Dialog.Title>
                {subtitle ? <Dialog.Description className={styles.subtitle}>{subtitle}</Dialog.Description> : null}
              </div>
              <Dialog.Close className={styles.closeBtn} aria-label="Close">
                <X aria-hidden="true" />
              </Dialog.Close>
            </div>
            <div className={styles.body}>{children}</div>
            {footer ? <div className={styles.footer}>{footer}</div> : null}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
