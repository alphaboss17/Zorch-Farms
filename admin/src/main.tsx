import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './components/AdminLayout'
import { ToastViewport } from './components/ToastViewport'
import { CatalogProvider } from './context/CatalogContext'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { Products } from './pages/Products'
import { Settings } from './pages/Settings'
import './style.css'
import { ProtectedRoute } from './components/ProtectedRoute'


import { testSupabaseConnection } from './supabase-test'

testSupabaseConnection()

createRoot(document.getElementById('root')!).render(<StrictMode><CatalogProvider><BrowserRouter><Routes><Route path="/login" element={<Login />} />
<Route
  element={
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route
    path="/dashboard"
    element={<Dashboard />}
  />

  <Route
    path="/products"
    element={<Products />}
  />

  <Route
    path="/settings"
    element={<Settings />}
  />
</Route>
<Route path="*" element={<Navigate to="/login" replace />} />

</Routes>

<ToastViewport /></BrowserRouter></CatalogProvider></StrictMode>)