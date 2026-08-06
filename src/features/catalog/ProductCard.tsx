import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { useRequest } from '../request/RequestContext'
import { Button, Chip } from '../../shared/ui'
import type { Product } from '../../types/product'

export function ProductCard({ product }: { product: Product }) {
  const [measurement, setMeasurement] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const { addItem } = useRequest()
  const onAdd = () => { if (!measurement) return; addItem(product.id, measurement); setAdded(true); window.setTimeout(() => setAdded(false), 1400) }
  return <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line/40 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-float">
    <img className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.03]" src={product.image} alt={product.name} loading="lazy" />
    <div className="flex flex-1 flex-col p-5"><div className="mb-3 flex items-start justify-between gap-2"><h3 className="font-display text-base font-bold text-forest">{product.name}</h3>{product.popular && <span className="rounded-full bg-mint/50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-forest">Popular</span>}</div>
    <p className="mb-4 text-sm leading-5 text-slate-600">{product.description}</p><fieldset className="mb-5 flex flex-wrap gap-2"><legend className="sr-only">Choose a measurement for {product.name}</legend>{product.measurementOptions.map((option) => <Chip key={option} selected={measurement === option} onClick={() => setMeasurement(option)}>{option}</Chip>)}</fieldset>
    <Button className="mt-auto" variant="secondary" fullWidth disabled={!measurement} onClick={onAdd}>{added ? <><Check size={16} /> Added</> : <><Plus size={16} /> Add to Request</>}</Button></div>
  </article>
}
