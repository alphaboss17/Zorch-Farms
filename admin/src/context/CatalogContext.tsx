import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { supabase } from '../lib/supabase'
import type { Activity, Product, ProductVariant } from '../types'

type ToastVariant = 'success' | 'error'

type Toast = {
  id: number
  message: string
  variant: ToastVariant
}

type ProductRow = {
  id: string
  slug: string
  name: string
  category: Product['category']
  description: string
  image_url: string | null
  featured: boolean
  popular: boolean
  available: boolean
  created_at?: string
  updated_at?: string
}

type VariantRow = {
  id: string
  product_id: string
  measurement: string
  price: number
  available: boolean
  created_at?: string
  updated_at?: string
}

type ActivityRow = {
  id: string
  title: string
  detail: string
  created_at: string
}

type CatalogContextValue = {
  products: Product[]
  activities: Activity[]
  loading: boolean
  addProduct: (
    product: Omit<Product, 'id' | 'created_at' | 'updated_at'>,
  ) => Promise<void>
  updateProduct: (product: Product) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  toasts: Toast[]
  dismissToast: (id: number) => void
  showToast: (message: string, variant?: ToastVariant) => void
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

const makeActivity = (
  title: string,
  detail: string,
): Activity => ({
  id: crypto.randomUUID(),
  title,
  detail,
  time: 'Just now',
})

const saveActivity = async (
  title: string,
  detail: string,
) => {
  const { error } = await supabase
    .from('catalog_activities')
    .insert({
      title,
      detail,
    })

  if (error) {
    console.error(
      'Failed to save activity:',
      error,
    )
  }
}

const createSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const mapProduct = (
  product: ProductRow,
  variants: VariantRow[],
): Product => ({
  id: product.id,
  slug: product.slug,
  name: product.name,
  category: product.category,
  description: product.description,
  image_url: product.image_url,
  featured: product.featured,
  popular: product.popular,
  available: product.available,
  variants: variants.map((variant) => ({
    id: variant.id,
    product_id: variant.product_id,
    measurement: variant.measurement,
    price: variant.price,
    available: variant.available,
    created_at: variant.created_at,
    updated_at: variant.updated_at,
  })),
  created_at: product.created_at,
  updated_at: product.updated_at,
})

export function CatalogProvider({
  children,
}: {
  children: ReactNode
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [loading, setLoading] = useState(true)

  const showToast = (
    message: string,
    variant: ToastVariant = 'success',
  ) => {
    const id =
      Date.now() + Math.round(Math.random() * 1000)

    setToasts((current) => [
      ...current,
      { id, message, variant },
    ])

    window.setTimeout(() => {
      setToasts((current) =>
        current.filter((toast) => toast.id !== id),
      )
    }, variant === 'error' ? 5200 : 3600)
  }

  const formatActivityTime = (
  createdAt: string,
) => {
  const created = new Date(createdAt)
  const now = new Date()

  const difference =
    now.getTime() - created.getTime()

  const seconds = Math.floor(
    difference / 1000,
  )

  if (seconds < 60) {
    return 'Just now'
  }

  const minutes = Math.floor(
    seconds / 60,
  )

  if (minutes < 60) {
    return `${minutes} minute${
      minutes === 1 ? '' : 's'
    } ago`
  }

  const hours = Math.floor(
    minutes / 60,
  )

  if (hours < 24) {
    return `${hours} hour${
      hours === 1 ? '' : 's'
    } ago`
  }

  const days = Math.floor(
    hours / 24,
  )

  if (days === 1) {
    return 'Yesterday'
  }

  if (days < 7) {
    return `${days} days ago`
  }

  return created.toLocaleDateString(
    'en-NG',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  )
}

  const loadActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('catalog_activities')
        .select('*')
        .order('created_at', {
          ascending: false,
        })
        .limit(6)

      if (error) {
        throw error
      }

      const mappedActivities: Activity[] = (
        (data ?? []) as ActivityRow[]
      ).map((activity) => ({
        id: activity.id,
        title: activity.title,
        detail: activity.detail,
        time: activity.created_at
  ? formatActivityTime(activity.created_at)
  : 'Just now',
      }))

      setActivities(mappedActivities)
    } catch (error) {
      console.error(
        'Failed to load activities:',
        error,
      )
    }
  }

  

  const loadProducts = async () => {
    setLoading(true)

    try {
      const { data: productRows, error: productError } =
        await supabase
          .from('products')
          .select('*')
          .order('created_at', {
            ascending: false,
          })

      if (productError) {
        throw productError
      }

      if (!productRows || productRows.length === 0) {
        setProducts([])
        return
      }

      const productIds = productRows.map(
        (product) => product.id,
      )

      const {
        data: variantRows,
        error: variantError,
      } = await supabase
        .from('product_variants')
        .select('*')
        .in('product_id', productIds)
        .order('created_at', {
          ascending: true,
        })

      if (variantError) {
        throw variantError
      }

      const variantsByProduct = new Map<
        string,
        VariantRow[]
      >()

      ;(variantRows ?? []).forEach((variant) => {
        const existing =
          variantsByProduct.get(variant.product_id) ?? []

        existing.push(variant)
        variantsByProduct.set(
          variant.product_id,
          existing,
        )
      })

      const mappedProducts = productRows.map(
        (product) =>
          mapProduct(
            product as ProductRow,
            variantsByProduct.get(product.id) ?? [],
          ),
      )

      setProducts(mappedProducts)
    } catch (error) {
      console.error(
        'Failed to load products:',
        error,
      )

      showToast(
        'Failed to load products from Supabase',
        'error',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProducts()
    void loadActivities()
  }, [])

  const addProduct = async (
    draft: Omit<
      Product,
      'id' | 'created_at' | 'updated_at'
    >,
  ) => {
    try {
      const slug = draft.slug?.trim()
        ? draft.slug.trim()
        : createSlug(draft.name)

      const {
        data: productRow,
        error: productError,
      } = await supabase
        .from('products')
        .insert({
          slug,
          name: draft.name,
          category: draft.category,
          description: draft.description,
          image_url: draft.image_url,
          featured: draft.featured,
          popular: draft.popular,
          available: draft.available,
        })
        .select()
        .single()

      if (productError) {
        throw productError
      }

      if (!productRow) {
        throw new Error(
          'Product was created but no product data was returned.',
        )
      }

      const variants = draft.variants.map(
        (variant) => ({
          product_id: productRow.id,
          measurement: variant.measurement,
          price: variant.price,
          available: variant.available,
        }),
      )

      const {
        data: variantRows,
        error: variantError,
      } = await supabase
        .from('product_variants')
        .insert(variants)
        .select()

      if (variantError) {
        await supabase
          .from('products')
          .delete()
          .eq('id', productRow.id)

        throw variantError
      }

      const product = mapProduct(
        productRow as ProductRow,
        (variantRows ?? []) as VariantRow[],
      )

      setProducts((current) => [
        product,
        ...current,
      ])

      setActivities((current) =>
  [
    makeActivity(
      `${product.name} added`,
      `Added to ${product.category}`,
    ),
    ...current,
  ].slice(0, 6),
)

await saveActivity(
  `${product.name} added`,
  `Added to ${product.category}`,
)

showToast('Product added successfully')

      showToast('Product added successfully')
    } catch (error) {
      console.error(
        'Failed to add product:',
        error,
      )

      showToast(
        'Failed to add product',
        'error',
      )

      throw error
    }
  }

  const updateProduct = async (
    product: Product,
  ) => {
    try {
      const {
        error: productError,
      } = await supabase
        .from('products')
        .update({
          slug: product.slug,
          name: product.name,
          category: product.category,
          description: product.description,
          image_url: product.image_url,
          featured: product.featured,
          popular: product.popular,
          available: product.available,
        })
        .eq('id', product.id)

      if (productError) {
        throw productError
      }

      const {
        error: deleteVariantsError,
      } = await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', product.id)

      if (deleteVariantsError) {
        throw deleteVariantsError
      }

      if (product.variants.length > 0) {
        const variants = product.variants.map(
          (variant) => ({
            product_id: product.id,
            measurement: variant.measurement,
            price: variant.price,
            available: variant.available,
          }),
        )

        const {
          error: variantError,
        } = await supabase
          .from('product_variants')
          .insert(variants)

        if (variantError) {
          await loadProducts()
          throw variantError
        }
      }

      await loadProducts()

      const previous = products.find(
        (item) => item.id === product.id,
      )

      const availabilityChanged =
        previous?.available !== product.available

      const variantsChanged =
        previous &&
        JSON.stringify(previous.variants) !==
          JSON.stringify(product.variants)

      let detail =
        'Product details updated'

      if (availabilityChanged) {
        detail = `Marked ${
          product.available
            ? 'available'
            : 'unavailable'
        }`
      } else if (variantsChanged) {
        detail =
          'Measurements and prices updated'
      }

     setActivities((current) =>
  [
    makeActivity(
      `${product.name} updated`,
      detail,
    ),
    ...current,
  ].slice(0, 6),
)

await saveActivity(
  `${product.name} updated`,
  detail,
)

showToast(
        availabilityChanged
          ? 'Availability updated successfully'
          : 'Product updated successfully',
      )
    } catch (error) {
      console.error(
        'Failed to update product:',
        error,
      )

      showToast(
        'Failed to update product',
        'error',
      )

      throw error
    }
  }

  const deleteProduct = async (
    id: string,
  ) => {
    try {
      const product = products.find(
        (item) => item.id === id,
      )

      const {
        error,
      } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setProducts((current) =>
        current.filter(
          (item) => item.id !== id,
        ),
      )

      if (product) {
  const title = `${product.name} deleted`
  const detail = 'Removed from product catalog'

  setActivities((current) =>
    [
      makeActivity(title, detail),
      ...current,
    ].slice(0, 6),
  )

  await saveActivity(title, detail)
}

showToast(
  'Product deleted successfully',
)
    } catch (error) {
      console.error(
        'Failed to delete product:',
        error,
      )

      showToast(
        'Failed to delete product',
        'error',
      )

      throw error
    }
  }

  const value = useMemo(
    () => ({
      products,
      activities,
      loading,
      addProduct,
      updateProduct,
      deleteProduct,
      toasts,
      dismissToast: (id: number) =>
        setToasts((current) =>
          current.filter(
            (toast) => toast.id !== id,
          ),
        ),
      showToast,
    }),
    [
      products,
      activities,
      loading,
      toasts,
    ],
  )

  return (
    <CatalogContext.Provider
      value={value}
    >
      {children}
    </CatalogContext.Provider>
  )
}

export const useCatalog = () => {
  const context =
    useContext(CatalogContext)

  if (!context) {
    throw new Error(
      'useCatalog must be used within CatalogProvider',
    )
  }

  return context
}

export const formatNaira = (
  price: number,
) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(price)