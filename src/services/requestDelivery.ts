import emailjs from '@emailjs/browser'
import { BUSINESS } from '../constants/business'
import { formatEmailItems, formatWhatsAppRequest } from '../utils/requestMessage'
import type { CustomerDetails, RequestItem } from '../types/product'

const hasEmailConfiguration = () => Boolean(import.meta.env.VITE_EMAILJS_SERVICE_ID && import.meta.env.VITE_EMAILJS_TEMPLATE_ID && import.meta.env.VITE_EMAILJS_PUBLIC_KEY)

export async function sendProvisionRequest(customer: CustomerDetails, items: RequestItem[]) {
  const sentAt = new Date()
  if (!hasEmailConfiguration()) return { emailSent: false, message: formatWhatsAppRequest(customer, items, sentAt) }
  await emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, {
    customer_name: customer.name,
    customer_phone: customer.phone,
    customer_email: customer.email || 'Not provided',
    request_items: formatEmailItems(items),
    customer_notes: customer.notes?.trim() || 'None',
    request_timestamp: sentAt.toLocaleString('en-NG', { dateStyle: 'full', timeStyle: 'short' }),
  }, { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY })
  return { emailSent: true, message: formatWhatsAppRequest(customer, items, sentAt) }
}

export function whatsappUrl(message: string) { return `https://wa.me/${BUSINESS.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}` }
