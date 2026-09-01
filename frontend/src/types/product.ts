export type CategoryId =
  | 'fresh-produce'
  | 'proteins'
  | 'bulk-staples'
  | 'pantry'

export interface ProductVariant {
  id: string
  product_id: string
  measurement: string
  price: number
  available: boolean
  created_at?: string
  updated_at?: string
}

export interface Product {
  id: string
  slug: string
  name: string
  category: CategoryId
  description: string
  image_url: string | null
  featured: boolean
  popular: boolean
  available: boolean
  variants: ProductVariant[]
  created_at?: string
  updated_at?: string
}

export interface RequestItem {
  productId: string
  measurement: string
  quantity: number
}

export interface CustomerDetails {
  name: string
  phone: string
  email: string
  notes?: string
}