import { ClipboardList, Minus, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { getProducts } from '../../services/productService'
import type { Product } from '../../types/product'
import { formatNaira, getItemSubtotal, getRequestTotal, getVariantPrice } from '../../utils/pricing'
import { PRODUCT_IMAGE_FALLBACK, handleProductImageError } from '../../shared/productImage'

import { useRequest } from './RequestContext'

import { Button, IconButton } from '../../shared/ui'

export function RequestDrawer() {
  const {
    items,
    isDrawerOpen,
    setDrawerOpen,
    updateQuantity,
    removeItem,
    totalItems,
  } = useRequest()

  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    if (!isDrawerOpen) return

    getProducts()
      .then(setProducts)
      .catch((error) => {
        console.error('Failed to load products:', error)
      })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDrawerOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDrawerOpen, setDrawerOpen])

  if (!isDrawerOpen) return null

  const total = getRequestTotal(items, products)

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Request summary"
    >
      <button
        aria-label="Close request summary"
        className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-sm"
        onClick={() => setDrawerOpen(false)}
      />

      <aside className="relative flex h-full max-h-[100dvh] w-full max-w-md flex-col bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-line/50 p-4 sm:p-5">
          <div>
            <p className="eyebrow">Your list</p>
            <h2 className="font-primary text-lg sm:text-xl font-bold text-forest">
              Request Summary
            </h2>
          </div>

          <IconButton
            label="Close request summary"
            onClick={() => setDrawerOpen(false)}
            icon={<X size={20} />}
          />
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 sm:px-8 text-center">
            <ClipboardList
              size={40}
              className="mb-4 text-moss"
            />

            <h3 className="text-lg font-primary font-bold text-forest">
              Your request is empty
            </h3>

            <p className="mt-2 text-sm text-slate-600 max-w-xs">
              Add the provisions you need, then send one clear list to our
              team.
            </p>

            <Button
              href="/categories"
              className="mt-6 w-full sm:w-auto"
              onClick={() => setDrawerOpen(false)}
            >
              Browse provisions
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line/40 overflow-y-auto overscroll-contain">
              {items.map((item) => {
                const product = products.find(
                  (product: Product) => product.id === item.productId,
                )

                if (!product) return null

                const unitPrice = getVariantPrice(product, item.measurement)
                const subtotal = getItemSubtotal(product, item)

                return (
                  <li
                    key={`${item.productId}-${item.measurement}`}
                    className="flex gap-3 p-4 sm:p-5"
                  >
                    <img
                      src={product.image_url || PRODUCT_IMAGE_FALLBACK}
                      onError={handleProductImageError}
                      alt=""
                      className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-lg object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-forest text-sm sm:text-base leading-snug break-words">
                        {product.name}
                      </h3>

                      <p className="mt-0.5 text-xs sm:text-sm text-slate-600">
                        {item.measurement}
                      </p>

                      <p className="mt-0.5 text-xs sm:text-sm font-bold text-forest">
                        {unitPrice === undefined
                          ? 'Price unavailable'
                          : formatNaira(subtotal)}
                      </p>

                      <div className="mt-2.5 sm:mt-3 flex items-center gap-1.5 sm:gap-2">
                        <IconButton
                          label={`Decrease ${product.name}`}
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.measurement,
                              item.quantity - 1,
                            )
                          }
                          variant="outline"
                          size="sm"
                          className="shrink-0 text-forest"
                          icon={<Minus size={14} />}
                        />

                        <span className="w-5 text-center text-sm font-bold shrink-0">
                          {item.quantity}
                        </span>

                        <IconButton
                          label={`Increase ${product.name}`}
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.measurement,
                              item.quantity + 1,
                            )
                          }
                          variant="outline"
                          size="sm"
                          className="shrink-0 text-forest"
                          icon={<Plus size={14} />}
                        />

                        <IconButton
                          label={`Remove ${product.name}`}
                          onClick={() =>
                            removeItem(
                              item.productId,
                              item.measurement,
                            )
                          }
                          variant="danger"
                          size="sm"
                          className="ml-auto shrink-0"
                          icon={<Trash2 size={16} />}
                        />
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="border-t border-line/50 p-4 sm:p-5 bg-white pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  Estimated total
                </span>
                <span className="font-primary text-lg sm:text-xl font-bold text-forest">
                  {formatNaira(total)}
                </span>
              </div>

              <p className="mb-3.5 text-xs text-slate-500">
                {totalItems}{' '}
                {totalItems === 1 ? 'item' : 'items'} ready to send · final
                pricing confirmed by our team
              </p>

              <Button
                href="/request"
                fullWidth
                size="md"
                onClick={() => setDrawerOpen(false)}
              >
                Continue to details
              </Button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}