export const categories = [
  'Fresh Produce',
  'Frozen Foods',
  'Rice & Beans',
  'Oil',
  'Spices',
  'Soup Ingredients',
] as const

export type Category = typeof categories[number]

export type ProductVariant = {
  id: string
  product_id?: string
  measurement: string
  price: number
  available: boolean
  created_at?: string
  updated_at?: string
}

export type Product = {
  id: string
  slug: string
  name: string
  category: Category
  description: string
  image_url: string | null
  featured: boolean
  popular: boolean
  available: boolean
  variants: ProductVariant[]
  created_at?: string
  updated_at?: string
}

export type Activity = {
  id: string
  title: string
  detail: string
  time: string
}