import { supabase } from '../lib/supabase'
import type { CategoryId, Product } from '../types/product'

function normalizeCategory(category: string): CategoryId {
  switch (category) {
    case 'Fresh Produce':
      return 'fresh-produce'

    case 'Frozen Foods':
      return 'frozen-foods'

    case 'Grains':
      return 'grains'

    case 'Oils':
      return 'oils'

    case 'Soups & Spices':
      return 'soups-spices'

    default:
      throw new Error(`Unknown product category: ${category}`)
  }
}

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
    category: normalizeCategory(product.category),
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

