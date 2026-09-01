import { Search, SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { CATEGORY_META } from '../constants/business'
import { ProductCard } from '../features/catalog/ProductCard'
import { Chip } from '../shared/ui'

import { useEffect, useMemo, useState } from 'react'
import { getProducts } from '../services/productService'
import type { Product, CategoryId } from '../types/product'

export function CategoriesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((error) => {
        console.error('Failed to load products:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') as CategoryId | null
  const [category, setCategory] = useState<CategoryId | 'all'>(
    initialCategory && initialCategory in CATEGORY_META ? initialCategory : 'all',
  )
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const filtered = useMemo(
    () =>
      products.filter(
        (product) =>
          (category === 'all' || product.category === category) &&
          `${product.name} ${product.description}`
            .toLowerCase()
            .includes(search.toLowerCase().trim()),
      ),
    [products, category, search],
  )

  if (loading) {
    return (
      <section className="page-shell py-20 text-center">
        <p className="text-slate-600">Loading provisions...</p>
      </section>
    )
  }

  return (
    <>
      <section className="bg-forest py-12 sm:py-16 text-white">
        <div className="page-shell">
          <p className="eyebrow text-mint">Provision catalogue</p>
          <h1 className="mt-2 font-primary text-3xl sm:text-4xl font-bold">
            Build your request.
          </h1>
          <p className="mt-3 max-w-xl text-sm sm:text-base text-white/75">
            Choose a quantity for each item, then send one clear list when you
            are ready.
          </p>
        </div>
      </section>

      <section className="page-shell py-8 sm:py-10">
        <div className="flex flex-col gap-4 rounded-2xl border border-line/50 bg-white p-3.5 sm:p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-h-[44px] items-center rounded-xl bg-slate-100 px-3 lg:w-80">
            <Search size={18} className="mr-2 shrink-0 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-transparent py-2.5 text-base sm:text-sm outline-none placeholder:text-slate-500"
              placeholder="Search provisions"
              aria-label="Search provisions"
            />
          </div>

          <div
            className="flex flex-wrap items-center gap-1.5 sm:gap-2"
            aria-label="Filter provisions by category"
          >
            <span className="mr-1 inline-flex items-center text-xs sm:text-sm font-bold text-slate-600">
              <SlidersHorizontal size={15} className="mr-1.5" /> Filter:
            </span>
            {(
              [
                ['all', 'All provisions'],
                ...Object.entries(CATEGORY_META).map(([id, item]) => [
                  id,
                  item.name,
                ]),
              ] as [CategoryId | 'all', string][]
            ).map(([id, name]) => (
              <Chip
                key={id}
                selected={category === id}
                onClick={() => setCategory(id)}
                className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm"
              >
                {name}
              </Chip>
            ))}
          </div>
        </div>

        <div className="mt-8 sm:mt-10 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="eyebrow">
              {category === 'all' ? 'All provisions' : CATEGORY_META[category].name}
            </p>
            <h2 className="mt-1 font-display text-xl sm:text-2xl font-bold text-forest">
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'} found
            </h2>
          </div>
        </div>

        {filtered.length ? (
          <div className="mt-6 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-line bg-white p-8 sm:p-12 text-center">
            <h2 className="font-display text-xl font-bold text-forest">
              No provisions found
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Try another search term or remove a category filter.
            </p>
          </div>
        )}
      </section>
    </>
  )
}
