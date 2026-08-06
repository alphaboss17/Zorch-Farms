import { Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CATEGORY_META } from '../constants/business'
import { products } from '../data/products'
import { ProductCard } from '../features/catalog/ProductCard'
import { Chip } from '../shared/ui'
import type { CategoryId } from '../types/product'

export function CategoriesPage() {
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') as CategoryId | null
  const [category, setCategory] = useState<CategoryId | 'all'>(initialCategory && initialCategory in CATEGORY_META ? initialCategory : 'all')
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const filtered = useMemo(() => products.filter((product) => (category === 'all' || product.category === category) && `${product.name} ${product.description}`.toLowerCase().includes(search.toLowerCase().trim())), [category, search])
  return <><section className="bg-forest py-16 text-white"><div className="page-shell"><p className="eyebrow text-mint">Provision catalogue</p><h1 className="mt-2 font-primary text-4xl font-bold">Build your request.</h1>
  <p className="mt-3 max-w-xl text-white/75">Choose a quantity for each item, then send one clear list when you are ready.</p></div></section><section className="page-shell py-10"><div className="flex flex-col gap-5 rounded-2xl border border-line/50 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between"><div className="flex items-center rounded-xl bg-slate-100 px-3 lg:w-80"><Search size={19} className="mr-2 text-slate-500" /><input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full bg-transparent py-3 text-sm outline-none" placeholder="Search provisions" aria-label="Search provisions" /></div><div className="flex flex-wrap gap-2" aria-label="Filter provisions by category"><span className="mr-1 inline-flex items-center text-sm font-bold text-slate-600"><SlidersHorizontal size={16} className="mr-2" /> Filter:</span>{([['all', 'All provisions'], ...Object.entries(CATEGORY_META).map(([id, item]) => [id, item.name])] as [CategoryId | 'all', string][]).map(([id, name]) => <Chip key={id} selected={category === id} onClick={() => setCategory(id)} className="px-3 py-2 text-sm">{name}</Chip>)}</div></div><div className="mt-10 flex items-end justify-between"><div><p className="eyebrow">{category === 'all' ? 'All provisions' : CATEGORY_META[category].name}</p><h2 className="mt-1 font-display text-2xl font-bold text-forest">{filtered.length} {filtered.length === 1 ? 'item' : 'items'} found</h2></div></div>{filtered.length ? <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((product) => <ProductCard product={product} key={product.id} />)}</div> : <div className="mt-6 rounded-2xl border border-dashed border-line bg-white p-12 text-center"><h2 className="font-display text-xl font-bold text-forest">No provisions found</h2><p className="mt-2 text-slate-600">Try another search term or remove a category filter.</p></div>}</section></> }
