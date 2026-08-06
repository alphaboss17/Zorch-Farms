import { getProduct } from '../data/products'
import type { CustomerDetails, RequestItem } from '../types/product'

export function describeItems(items: RequestItem[]) {
  return items.flatMap((item) => {
    const product = getProduct(item.productId)
    return product ? [`${product.name} — ${item.quantity} × ${item.measurement}`] : []
  })
}

export function formatWhatsAppRequest(customer: CustomerDetails, items: RequestItem[], timestamp = new Date()) {
  const lines = describeItems(items).map((item) => `• ${item}`)
  return [
    '*NEW PROVISION REQUEST*', '', `*Customer Name:* ${customer.name}`, `*Phone:* ${customer.phone}`, `*Email:* ${customer.email || 'Not provided'}`, '', '*Requested items:*', ...lines, '', `*Notes:* ${customer.notes?.trim() || 'None'}`, `*Sent:* ${timestamp.toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}`, '', 'Please share current pricing and delivery availability. Thank you.',
  ].join('\n')
}

export function formatEmailItems(items: RequestItem[]) { return describeItems(items).map((item) => `• ${item}`).join('\n') }
