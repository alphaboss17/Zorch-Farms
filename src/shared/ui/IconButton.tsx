import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'solid' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const base = 'inline-flex items-center justify-center rounded-full transition duration-200 active:scale-[0.95] disabled:pointer-events-none disabled:opacity-60'
const variants: Record<Variant, string> = {
  solid: 'bg-forest text-white hover:bg-forest/90', outline: 'border border-line text-forest hover:border-moss', ghost: 'text-slate-600 hover:bg-slate-100', danger: 'text-slate-500 hover:text-red-700',
}
const sizes: Record<Size, string> = { sm: 'p-1', md: 'p-2', lg: 'p-2.5' }

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> { icon: ReactNode; label: string; variant?: Variant; size?: Size }

export function IconButton({ icon, label, variant = 'ghost', size = 'md', className = '', type = 'button', ...props }: IconButtonProps) {
  return <button type={type} aria-label={label} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{icon}</button>
}
