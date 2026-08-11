// src/components/ui/Dropdown.tsx
import * as RadixDropdown from '@radix-ui/react-dropdown-menu'
import type { ReactNode } from 'react'
import styles from './Dropdown.module.css'

interface DropdownContentProps {
  children: ReactNode
  align?: 'start' | 'center' | 'end'
}

function DropdownContent({ children, align = 'end' }: DropdownContentProps) {
  return (
    <RadixDropdown.Portal>
      <RadixDropdown.Content className={styles.panel} align={align} sideOffset={6}>
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
  onSelect?: () => void
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
