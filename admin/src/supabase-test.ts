import { supabase } from './lib/supabase'

export async function testSupabaseConnection() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, category')

  if (error) {
    console.error('Supabase connection failed:', error)
    return
  }

  console.log('Supabase connection successful!')
  console.log('Products:', data)
}