import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from '../layout/AppShell'
import { CategoriesPage } from '../pages/CategoriesPage'
import { ContactPage } from '../pages/ContactPage'
import { HomePage } from '../pages/HomePage'
import { RequestPage } from '../pages/RequestPage'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Zorch Farms | Fresh provisions, simplified',
  '/categories': 'Browse Provisions | Zorch Farms',
  '/request': 'Request Summary | Zorch Farms',
  '/contact': 'Contact Zorch Farms',
}

export function App() {
  const location = useLocation()
  useEffect(() => {
    document.title = PAGE_TITLES[location.pathname] ?? 'Zorch Farms | Fresh provisions, simplified'
  }, [location.pathname])
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categories" element={<CategoriesPage key={location.search} />} />
        <Route path="/request" element={<RequestPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </AppShell>
  )
}
