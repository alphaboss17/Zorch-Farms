import { supabase } from '../lib/supabase'
import type { Product, ProductVariant } from '../types'

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      slug,
      name,
      category,
      description,
      image_url,
      featured,
      popular,
      available,
      created_at,
      updated_at,
      product_variants (
        id,
        product_id,
        measurement,
        price,
        available,
        created_at,
        updated_at
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []).map((product) => ({
    ...product,
    variants: (product.product_variants ?? []) as ProductVariant[],
  }))
}