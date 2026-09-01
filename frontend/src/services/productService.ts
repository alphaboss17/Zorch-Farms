import { supabase } from '../lib/supabase'
import type { Product } from '../types/product'

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      variants:product_variants(*)
    `)
    .eq('available', true)
    .order('name')

  if (error) {
    console.error('Error fetching products:', error)
    throw error
  }

  return (data ?? []).map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    description: product.description,
    image_url: product.image_url,
    featured: product.featured,
    popular: product.popular,
    available: product.available,
    variants: product.variants ?? [],
    created_at: product.created_at,
    updated_at: product.updated_at,
  }))
}