import type { CustomerDetails, Product, RequestItem } from '../types/product'
import {
  formatNaira,
  getItemSubtotal,
  getRequestTotal,
  getVariantPrice,
} from './pricing'

export function describeItems(
  items: RequestItem[],
  products: Product[] = [],
) {
  const byId = new Map(products.map((product) => [product.id, product]))
  return items.flatMap((item) => {
    const product = byId.get(item.productId)
    return product
      ? [`${product.name} — ${item.quantity} × ${item.measurement}`]
      : []
  })
}

export function formatWhatsAppRequest(
  customer: CustomerDetails,
  items: RequestItem[],
  products: Product[] = [],
) {
  const byId = new Map(products.map((product) => [product.id, product]))

  const sections: string[] = []

  // Greeting
  sections.push('Hello Zorch Farms, I would like to make a provision request.')

  // Customer Details
  const customerLines = [
    'CUSTOMER DETAILS',
    `Name: ${customer.name.trim()}`,
    `Phone: ${customer.phone.trim()}`,
  ]
  if (customer.email && customer.email.trim()) {
    customerLines.push(`Email: ${customer.email.trim()}`)
  }
  sections.push(customerLines.join('\n'))

  // Request Summary
  const itemBlocks = items.map((item, index) => {
    const product = byId.get(item.productId)
    const productName = product?.name || item.productId
    const unitPrice = getVariantPrice(product, item.measurement)
    const subtotal = getItemSubtotal(product, item)

    return [
      `${index + 1}. ${productName}`,
      `   Measurement: ${item.measurement}`,
      `   Quantity: ${item.quantity}`,
      `   Price: ${formatNaira(unitPrice ?? 0)}`,
      `   Subtotal: ${formatNaira(subtotal)}`,
    ].join('\n')
  })

  sections.push(['REQUEST SUMMARY', '', itemBlocks.join('\n\n')].join('\n'))

  // Total
  const grandTotal = getRequestTotal(items, products)
  sections.push(
    [
      '--------------------------------',
      `TOTAL: ${formatNaira(grandTotal)}`,
      '--------------------------------',
    ].join('\n'),
  )

  // Notes (optional)
  if (customer.notes && customer.notes.trim()) {
    sections.push(['NOTES', customer.notes.trim()].join('\n'))
  }

  // Sign-off
  sections.push('Thank you.')

  return sections.join('\n\n')
}

export function formatEmailItems(
  items: RequestItem[],
  products: Product[] = [],
) {
  return describeItems(items, products)
    .map((item) => `•
  ${item}`)
    .join('\n')
}
