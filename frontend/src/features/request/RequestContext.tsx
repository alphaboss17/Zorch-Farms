import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { RequestItem } from '../../types/product'

interface RequestContextValue {
  items: RequestItem[]
  totalItems: number
  isDrawerOpen: boolean
  addItem: (productId: string, measurement: string) => void
  updateQuantity: (productId: string, measurement: string, quantity: number) => void
  removeItem: (productId: string, measurement: string) => void
  clearRequest: () => void
  setDrawerOpen: (open: boolean) => void
}

const STORAGE_KEY = 'zorch-farms-request-v1'
const RequestContext = createContext<RequestContextValue | null>(null)

function loadItems(): RequestItem[] {
  try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? JSON.parse(saved) : [] } catch { return [] }
}

export function RequestProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RequestItem[]>(loadItems)
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) }, [items])

  const addItem = useCallback((productId: string, measurement: string) => {
    setItems((current) => {
      const existing = current.find((item) => item.productId === productId && item.measurement === measurement)
      return existing ? current.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { productId, measurement, quantity: 1 }]
    })
    setDrawerOpen(true)
  }, [])
  const updateQuantity = useCallback((productId: string, measurement: string, quantity: number) => setItems((current) => quantity < 1 ? current.filter((item) => item.productId !== productId || item.measurement !== measurement) : current.map((item) => item.productId === productId && item.measurement === measurement ? { ...item, quantity } : item)), [])
  const removeItem = useCallback((productId: string, measurement: string) => setItems((current) => current.filter((item) => item.productId !== productId || item.measurement !== measurement)), [])
  const clearRequest = useCallback(() => setItems([]), [])
  const value = useMemo(() => ({ items, totalItems: items.reduce((total, item) => total + item.quantity, 0), isDrawerOpen, addItem, updateQuantity, removeItem, clearRequest, setDrawerOpen }), [items, isDrawerOpen, addItem, updateQuantity, removeItem, clearRequest])
  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>
}

export function useRequest() { const context = useContext(RequestContext); if (!context) throw new Error('useRequest must be used within RequestProvider'); return context }
