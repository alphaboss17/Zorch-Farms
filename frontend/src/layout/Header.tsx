import { Menu, Search, X } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { useRequest } from '../features/request/RequestContext'
import { Button, IconButton } from '../shared/ui'

const links = [
  { href: '/', label: 'Home' },
  { href: '/categories', label: 'Categories' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const { totalItems, setDrawerOpen } = useRequest()

  useEffect(() => {
    setQuery(searchParams.get('search') ?? '')
  }, [searchParams])

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const value = query.trim()

    navigate(
      `/categories${value ? `?search=${encodeURIComponent(value)}` : ''}`,
    )
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line/40 bg-canvas/90 backdrop-blur-md">
      <div className="page-shell flex h-16 items-center justify-between gap-2 sm:gap-4">
        <Link
          to="/"
          className="shrink-0 font-primary text-base font-extrabold tracking-tight text-forest sm:text-lg"
        >
          Zorch Farms
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-8 md:flex"
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              className="text-sm font-bold text-slate-600 transition hover:text-forest"
              to={href}
            >
              {label}
            </Link>
          ))}
        </nav>

        <form
          onSubmit={submitSearch}
          className="hidden max-w-56 flex-1 items-center rounded-full bg-slate-100 px-3 focus-within:ring-2 focus-within:ring-moss/30 lg:flex"
        >
          <Search size={17} className="mr-2 shrink-0 text-slate-500" />

          <input
            aria-label="Search products"
            value={query}
            onChange={(event) => {
              const value = event.target.value
              setQuery(value)

              if (!value.trim()) {
                navigate('/categories')
              }
            }}
            placeholder="Search products"
            className="min-w-0 w-full bg-transparent py-2 text-sm outline-none placeholder:text-slate-500"
          />
        </form>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <Button
            size="sm"
            onClick={() => setDrawerOpen(true)}
            className="relative shrink-0 px-2.5 font-primary sm:px-3.5"
          >
            <span>
              <span className="hidden min-[360px]:inline">View </span>
              Request
            </span>

            {totalItems > 0 && (
              <span className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-mint px-1 text-xs font-bold text-forest">
                {totalItems}
              </span>
            )}
          </Button>

          <IconButton
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            label="Toggle navigation"
            variant="ghost"
            icon={menuOpen ? <X size={20} /> : <Menu size={20} />}
            className="shrink-0 text-forest hover:bg-forest/5 md:hidden"
          />
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-line/40 bg-white px-4 py-3 shadow-lg md:hidden">
          <form
            onSubmit={(event) => {
              submitSearch(event)
              setMenuOpen(false)
            }}
            className="mb-3 flex items-center rounded-xl bg-slate-100 px-3 focus-within:ring-2 focus-within:ring-moss/30"
          >
            <Search size={17} className="mr-2 shrink-0 text-slate-500" />

            <input
              aria-label="Search products"
              value={query}
              onChange={(event) => {
                const value = event.target.value
                setQuery(value)

                if (!value.trim()) {
                  navigate('/categories')
                }
              }}
              placeholder="Search provisions"
              className="min-w-0 w-full bg-transparent py-2.5 text-base outline-none placeholder:text-slate-500"
            />
          </form>

          <nav aria-label="Mobile navigation" className="space-y-1">
            {links.map(({ href, label }) => (
              <Button
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                variant="ghost"
                className="w-full justify-start rounded-lg px-3 py-3 text-base font-semibold text-forest hover:bg-slate-50"
              >
                {label}
              </Button>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

