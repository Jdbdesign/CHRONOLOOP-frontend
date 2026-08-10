import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  danger: styles.danger,
  ghost: styles.ghost,
}

export function Button({ variant = 'primary', className, children, ...rest }: ButtonProps) {
  const combined = [styles.button, VARIANT_CLASS[variant], className].filter(Boolean).join(' ')

  return (
    <button type="button" className={combined} data-variant={variant} {...rest}>
      {children}
    </button>
  )
}
