import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { classNames } from '../../utils/fileHelpers'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  size?: 'sm' | 'md'
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-slate-950 text-white hover:bg-slate-800 shadow-sm shadow-slate-950/10',
  secondary: 'bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 shadow-sm shadow-slate-950/5',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
  danger: 'bg-red-50 text-red-700 ring-1 ring-red-100 hover:bg-red-100 shadow-sm shadow-red-950/5',
}

export function Button({ children, className, variant = 'secondary', size = 'md', ...props }: ButtonProps) {
  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-45',
        size === 'sm' ? 'h-8 px-2.5 text-xs' : 'h-10 px-4 text-sm',
        variants[variant],
        className,
      )}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}
