import { Menu, Search, X } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRequest } from '../features/request/RequestContext'
import { Button, IconButton } from '../shared/ui'

const links = [{ href: '/', label: 'Home' }, { href: '/categories', label: 'Categories' }, { href: '/contact', label: 'Contact' }]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { totalItems, setDrawerOpen } = useRequest()
  const submitSearch = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const value = query.trim(); navigate(`/categories${value ? `?search=${encodeURIComponent(value)}` : ''}`) }
  return <header className="sticky top-0 z-40 border-b border-line/40 bg-canvas/90 backdrop-blur-md"><div className="page-shell flex h-16 items-center justify-between gap-4">
    <Link to="/" className="font-primary text-lg font-extrabold tracking-tight text-forest">Zorch Farms</Link>
    <nav aria-label="Primary navigation" className="hidden items-center gap-8 md:flex">{links.map(({ href, label }) => <Link key={href} className="text-sm font-bold text-slate-600 transition hover:text-forest" to={href}>{label}</Link>)}</nav>
    <form onSubmit={submitSearch} className="hidden max-w-56 flex-1 items-center rounded-full bg-slate-100 px-3 focus-within:ring-2 focus-within:ring-moss/30 lg:flex"><Search size={17} className="mr-2 text-slate-500" /><input aria-label="Search provisions" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search provisions" className="min-w-0 w-full bg-transparent py-2 text-sm outline-none placeholder:text-slate-500" /></form>
    <Button size="sm" onClick={() => setDrawerOpen(true)} className="relative font-primary">View Request{totalItems > 0 && <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-mint px-1 text-xs text-forest">{totalItems}</span>}</Button>
    <IconButton onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} label="Toggle navigation" variant="ghost" icon={menuOpen ? <X /> : <Menu />} className="text-forest hover:bg-transparent md:hidden" />
  </div>{menuOpen && <nav aria-label="Mobile navigation" className="border-t border-line/40 bg-white px-4 py-3 md:hidden">{links.map(({ href, label }) => <Button key={href} href={href} onClick={() => setMenuOpen(false)} variant="ghost" className="w-full justify-start rounded-lg px-3 py-3 text-forest hover:bg-slate-50">{label}</Button>)}</nav>}</header>
}
