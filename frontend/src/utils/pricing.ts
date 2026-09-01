import type { Product, ProductVariant, RequestItem } from '../types/product'

/**
 * Pricing helpers for the request system.
 *
 * These functions are pure and operate on the product data currently loaded
 * from Supabase — prices are never hard-coded here. Every lookup is defensive:
 * a missing product, missing variant, or non-numeric price resolves to an
 * "unknown price" (undefined) or a zero subtotal rather than throwing.
 */

/** Format a numeric amount as Nigerian Naira, e.g. `2500` -> `"₦2,500"`. */
export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`
}

/** Find the variant of a product whose measurement matches the requested one. */
export function findVariant(
  product: Product | undefined,
  measurement: string,
): ProductVariant | undefined {
  return product?.variants.find((variant) => variant.measurement === measurement)
}

/**
 * Unit price for a product's measurement, or `undefined` when the product,
 * variant, or price is unavailable.
 */
export function getVariantPrice(
  product: Product | undefined,
  measurement: string,
): number | undefined {
  const price = findVariant(product, measurement)?.price
  return typeof price === 'number' ? price : undefined
}

/**
 * Subtotal for a single request item (`unit price × quantity`).
 * Returns `0` when the item's price cannot be determined.
 */
export function getItemSubtotal(
  product: Product | undefined,
  item: RequestItem,
): number {
  const unitPrice = getVariantPrice(product, item.measurement)
  return unitPrice === undefined ? 0 : unitPrice * item.quantity
}

/**
 * Overall total for a request, summing every item's subtotal.
 * Items whose price is unknown contribute `0` and never break the sum.
 */
export function getRequestTotal(
  items: RequestItem[],
  products: Product[],
): number {
  const byId = new Map(products.map((product) => [product.id, product]))
  return items.reduce(
    (total, item) => total + getItemSubtotal(byId.get(item.productId), item),
    0,
  )
}
