// src/components/ui/Dropdown.tsx
import * as RadixDropdown from '@radix-ui/react-dropdown-menu'
import type { ReactNode } from 'react'
import styles from './Dropdown.module.css'

interface DropdownContentProps {
  children: ReactNode
  align?: 'start' | 'center' | 'end'
  className?: string
}

function DropdownContent({ children, align = 'end', className }: DropdownContentProps) {
  const combined = [styles.panel, className].filter(Boolean).join(' ')

  return (
    <RadixDropdown.Portal>
      <RadixDropdown.Content className={combined} align={align} sideOffset={6}>
        {children}
      </RadixDropdown.Content>
    </RadixDropdown.Portal>
  )
}

interface DropdownItemProps {
  children: ReactNode
  icon?: ReactNode
  active?: boolean
  danger?: boolean
  onSelect?: (event: Event) => void
}

function DropdownItem({ children, icon, active, danger, onSelect }: DropdownItemProps) {
  const combined = [styles.item, active && styles.active, danger && styles.danger].filter(Boolean).join(' ')

  return (
    <RadixDropdown.Item className={combined} onSelect={onSelect}>
      {icon}
      {children}
    </RadixDropdown.Item>
  )
}

function DropdownDivider() {
  return <RadixDropdown.Separator className={styles.divider} />
}

export const Dropdown = {
  Root: RadixDropdown.Root,
  Trigger: RadixDropdown.Trigger,
  Content: DropdownContent,
  Item: DropdownItem,
  Divider: DropdownDivider,
}
