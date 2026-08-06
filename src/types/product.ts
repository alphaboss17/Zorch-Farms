export type CategoryId = 'fresh-produce' | 'proteins' | 'bulk-staples' | 'pantry'

export interface Product {
  id: string
  name: string
  category: CategoryId
  measurementOptions: string[]
  description: string
  image: string
  featured: boolean
  popular: boolean
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
