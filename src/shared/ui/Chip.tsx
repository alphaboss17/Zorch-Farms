import type { ButtonHTMLAttributes } from 'react'

interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-pressed'> { selected: boolean; children: string }

export function Chip({ selected, children, className = '', type = 'button', ...props }: ChipProps) {
  return <button type={type} aria-pressed={selected} className={`rounded-full border px-2.5 py-1 text-xs font-bold transition ${selected ? 'border-forest bg-forest text-white' : 'border-line text-slate-600 hover:border-moss'} ${className}`} {...props}>{children}</button>
}
