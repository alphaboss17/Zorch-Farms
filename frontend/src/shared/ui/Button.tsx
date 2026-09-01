import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'outline' | 'clay' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const base = 'inline-flex items-center justify-center gap-2 rounded-full font-bold transition duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 aria-disabled:pointer-events-none aria-disabled:opacity-60'
const variants: Record<Variant, string> = {
  primary: 'bg-forest text-white hover:bg-forest/90', secondary: 'bg-moss text-white hover:bg-moss/90', outline: 'border border-forest text-forest hover:bg-forest hover:text-white', clay: 'bg-clay text-white hover:bg-[#dd6935]', ghost: 'text-forest hover:bg-forest/5',
}
const sizes: Record<Size, string> = { sm: 'min-h-9 px-3.5 py-1.5 text-xs', md: 'min-h-11 px-5 py-2.5 text-sm', lg: 'min-h-12 px-7 py-3 text-base' }

interface CommonProps { variant?: Variant; size?: Size; fullWidth?: boolean; children: ReactNode }
type ButtonAsButton = CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined; loading?: boolean }
type ButtonAsLink = CommonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { href: string }
type ButtonProps = ButtonAsButton | ButtonAsLink

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', fullWidth, className = '', children } = props
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`
  if (props.href !== undefined) {
    const { variant: _v, size: _s, fullWidth: _f, className: _c, children: _ch, href, ...rest } = props
    // Internal route -> client-side Link; external/hash/mailto/tel -> plain anchor.
    if (href.startsWith('/')) {
      return <Link to={href} className={cls} {...rest}>{children}</Link>
    }
    return <a href={href} className={cls} {...rest}>{children}</a>
  }
  const { variant: _v, size: _s, fullWidth: _f, className: _c, children: _ch, href: _h, loading, disabled, type = 'button', ...rest } = props
  return <button type={type} disabled={disabled || loading} className={cls} {...rest}>{loading && <Loader2 size={16} className="animate-spin" />}{children}</button>
}
